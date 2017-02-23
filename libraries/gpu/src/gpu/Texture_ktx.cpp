//
//  Texture_ktx.cpp
//  libraries/gpu/src/gpu
//
//  Created by Sam Gateau on 2/16/2017.
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


#include "Texture.h"

#include <ktx/KTX.h>
using namespace gpu;

ktx::KTXUniquePointer Texture::serialize(const Texture& texture) {
    ktx::Header header;

    // From texture format to ktx format description
    auto texelFormat = texture.getTexelFormat();
    auto mipFormat = texture.getStoredMipFormat();

    if (texelFormat == Format::COLOR_RGBA_32 && mipFormat == Format::COLOR_BGRA_32) {
        header.setUncompressed(ktx::GLType::UNSIGNED_BYTE, 4, ktx::GLFormat::BGRA, ktx::GLInternalFormat_Uncompressed::RGBA8, ktx::GLBaseInternalFormat::RGBA);
    } else if (texelFormat == Format::COLOR_SRGBA_32 && mipFormat == Format::COLOR_BGRA_32) {
        header.setUncompressed(ktx::GLType::UNSIGNED_BYTE, 4, ktx::GLFormat::BGRA, ktx::GLInternalFormat_Uncompressed::SRGB8_ALPHA8, ktx::GLBaseInternalFormat::RGBA);
    } else if (texelFormat == Format::COLOR_R_8 && mipFormat == Format::COLOR_R_8) {
        header.setUncompressed(ktx::GLType::UNSIGNED_BYTE, 1, ktx::GLFormat::RED, ktx::GLInternalFormat_Uncompressed::R8, ktx::GLBaseInternalFormat::RED);
    } else {
        return nullptr;
    }
 
    // Set Dimensions
    uint32_t numFaces = 1;
    switch (texture.getType()) {
    case TEX_1D: {
            if (texture.isArray()) {
                header.set1DArray(texture.getWidth(), texture.getNumSlices());
            } else {
                header.set1D(texture.getWidth());
            }
            break;
        }
    case TEX_2D: {
            if (texture.isArray()) {
                header.set2DArray(texture.getWidth(), texture.getHeight(), texture.getNumSlices());
            } else {
                header.set2D(texture.getWidth(), texture.getHeight());
            }
            break;
        }
    case TEX_3D: {
            if (texture.isArray()) {
                header.set3DArray(texture.getWidth(), texture.getHeight(), texture.getDepth(), texture.getNumSlices());
            } else {
                header.set3D(texture.getWidth(), texture.getHeight(), texture.getDepth());
            }
            break;
        }
    case TEX_CUBE: {
            if (texture.isArray()) {
                header.setCubeArray(texture.getWidth(), texture.getHeight(), texture.getNumSlices());
            } else {
                header.setCube(texture.getWidth(), texture.getHeight());
            }
            numFaces = 6;
            break;
        }
    default:
        return nullptr;
    }

    // Number level of mips coming
    header.numberOfMipmapLevels = texture.maxMip();

    ktx::Images images;
    for (uint32_t level = 0; level < header.numberOfMipmapLevels; level++) {
        auto mip = texture.accessStoredMipFace(level);
        if (mip) {
            if (numFaces == 1) {
                images.emplace_back(ktx::Image((uint32_t)mip->getSize(), 0, mip->readData()));
            } else {
                ktx::Image::FaceBytes cubeFaces(6);
                cubeFaces[0] = mip->readData();
                for (int face = 1; face < 6; face++) {
                    cubeFaces[face] = texture.accessStoredMipFace(level, face)->readData();
                }
                images.emplace_back(ktx::Image((uint32_t)mip->getSize(), 0, cubeFaces));
            }
        }
    }

    auto ktxBuffer = ktx::KTX::create(header, images);

    assert(0 == memcmp(&header, ktxBuffer->getHeader(), sizeof(ktx::Header)));
    assert(ktxBuffer->_images.size() == images.size());
    auto start = ktxBuffer->_storage->data();
    for (size_t i = 0; i < images.size(); ++i) {
        auto expected = images[i];
        auto actual = ktxBuffer->_images[i];
        assert(expected._padding == actual._padding);
        assert(expected._numFaces == actual._numFaces);
        assert(expected._imageSize == actual._imageSize);
        assert(expected._faceSize == actual._faceSize);
        assert(actual._faceBytes.size() == actual._numFaces);
        for (uint32_t face = 0; face < expected._numFaces; ++face) {
            auto expectedFace = expected._faceBytes[face];
            auto actualFace = actual._faceBytes[face];
            auto offset = actualFace - start;
            assert(offset % 4 == 0);
            assert(expectedFace != actualFace);
            assert(0 == memcmp(expectedFace, actualFace, expected._faceSize));
        }
    }
    return ktxBuffer;
}

Texture* Texture::unserialize(Usage usage, TextureUsageType usageType, const ktx::KTXUniquePointer& srcData, const Sampler& sampler) {
    if (!srcData) {
        return nullptr;
    }
    const auto& header = *srcData->getHeader();

    Format mipFormat = Format::COLOR_BGRA_32;
    Format texelFormat = Format::COLOR_SRGBA_32;

    if (header.getGLFormat() == ktx::GLFormat::BGRA && header.getGLType() == ktx::GLType::UNSIGNED_BYTE && header.getTypeSize() == 4) {
        mipFormat = Format::COLOR_BGRA_32;
        if (header.getGLInternaFormat_Uncompressed() == ktx::GLInternalFormat_Uncompressed::RGBA8) {
            texelFormat = Format::COLOR_RGBA_32;
        } else if (header.getGLInternaFormat_Uncompressed() == ktx::GLInternalFormat_Uncompressed::SRGB8_ALPHA8) {
            texelFormat = Format::COLOR_SRGBA_32;
        } else {
            return nullptr;
        }
    } else if (header.getGLFormat() == ktx::GLFormat::RED && header.getGLType() == ktx::GLType::UNSIGNED_BYTE && header.getTypeSize() == 1) {
        mipFormat = Format::COLOR_R_8;
        if (header.getGLInternaFormat_Uncompressed() == ktx::GLInternalFormat_Uncompressed::R8) {
            texelFormat = Format::COLOR_R_8;
        } else {
            return nullptr;
        }
    }

    // Find Texture Type based on dimensions
    Type type = TEX_1D;
    if (header.pixelWidth == 0) {
        return nullptr;
    } else if (header.pixelHeight == 0) {
        type = TEX_1D;
    } else if (header.pixelDepth == 0) {
        if (header.numberOfFaces == ktx::NUM_CUBEMAPFACES) {
            type = TEX_CUBE;
        } else {
            type = TEX_2D;
        }
    } else {
        type = TEX_3D;
    }

    auto tex = Texture::create( usageType,
                                type,
                                texelFormat,
                                header.getPixelWidth(),
                                header.getPixelHeight(),
                                header.getPixelDepth(),
                                1, // num Samples
                                header.getNumberOfSlices(),
                                sampler);

    tex->setUsage(usage);

    // Assing the mips availables
    tex->setStoredMipFormat(mipFormat);
    uint16_t level = 0;
    for (auto& image : srcData->_images) {
        for (uint32_t face = 0; face < image._numFaces; face++) {
            tex->assignStoredMipFace(level, face, image._faceSize, image._faceBytes[face]);
        }
        level++;
    }

    return tex;
}
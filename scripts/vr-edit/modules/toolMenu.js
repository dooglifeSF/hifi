//
//  toolMenu.js
//
//  Created by David Rowe on 22 Jul 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

/* global ToolMenu */

ToolMenu = function (side, leftInputs, rightInputs, setAppScaleWithHandlesCallback) {
    // Tool menu displayed on top of forearm.

    "use strict";

    var menuOriginOverlay,
        menuPanelOverlay,
        scaleButtonOverlay,
        cloneButtonOverlay,
        buttonHighlightOverlay,

        LEFT_HAND = 0,
        AVATAR_SELF_ID = "{00000000-0000-0000-0000-000000000001}",
        ZERO_ROTATION = Quat.fromVec3Radians(Vec3.ZERO),

        controlJointName,

        CANVAS_SIZE = { x: 0.21, y: 0.13 },
        PANEL_ROOT_POSITION = { x: CANVAS_SIZE.x / 2, y: 0.15, z: -0.04 },
        PANEL_ROOT_ROTATION = Quat.fromVec3Degrees({ x: 0, y: 0, z: 180 }),
        lateralOffset,

        PANEL_ORIGIN_PROPERTIES = {
            dimensions: { x: 0.005, y: 0.005, z: 0.005 },
            localPosition: PANEL_ROOT_POSITION,
            localRotation: PANEL_ROOT_ROTATION,
            color: { red: 255, blue: 0, green: 0 },
            alpha: 1.0,
            parentID: AVATAR_SELF_ID,
            ignoreRayIntersection: true,
            visible: true
        },

        MENU_PANEL_PROPERTIES = {
            dimensions: { x: CANVAS_SIZE.x, y: CANVAS_SIZE.y, z: 0.01 },
            localPosition: { x: CANVAS_SIZE.x / 2, y: CANVAS_SIZE.y / 2, z: 0.005 },
            localRotation: ZERO_ROTATION,
            color: { red: 192, green: 192, blue: 192 },
            alpha: 1.0,
            solid: true,
            ignoreRayIntersection: false,
            visible: true
        },

        BUTTON_PROPERTIES = {
            dimensions: { x: 0.03, y: 0.03, z: 0.01 },
            localRotation: ZERO_ROTATION,
            alpha: 1.0,
            solid: true,
            ignoreRayIntersection: false,
            visible: true
        },

        BUTTON_HIGHLIGHT_PROPERTIES = {
            dimensions: { x: 0.034, y: 0.034, z: 0.001 },
            localPosition: { x: 0.02, y: 0.02, z: -0.002 },
            localRotation: ZERO_ROTATION,
            color: { red: 240, green: 240, blue: 0 },
            alpha: 0.8,
            solid: false,
            drawInFront: true,
            ignoreRayIntersection: true,
            visible: false
        },

        HIGHLIGHT_Z_OFFSET = -0.002,

        BUTTON_POSITIONS = [
            { x: 0.02, y: 0.02, z: 0.0 },
            { x: 0.06, y: 0.02, z: 0.0 }
        ],

        BUTTON_COLORS = [
            { red: 0, green: 240, blue: 240 },
            { red: 240, green: 0, blue: 240 }
        ],

        isDisplaying = false,

        isHighlightingButton = false,
        isButtonPressed = false,

        // References.
        controlHand;


    if (!this instanceof ToolMenu) {
        return new ToolMenu();
    }

    controlHand = side === LEFT_HAND ? rightInputs.hand() : leftInputs.hand();

    function setHand(hand) {
        // Assumes UI is not displaying.
        side = hand;
        controlHand = side === LEFT_HAND ? rightInputs.hand() : leftInputs.hand();
        controlJointName = side === LEFT_HAND ? "LeftHand" : "RightHand";
        lateralOffset = side === LEFT_HAND ? -0.01 : 0.01;
    }

    setHand(side);

    function getEntityIDs() {
        return [menuPanelOverlay, scaleButtonOverlay, cloneButtonOverlay];
    }

    function update(intersectionOverlayID) {
        // Highlight button.
        if ((intersectionOverlayID === scaleButtonOverlay || intersectionOverlayID === cloneButtonOverlay)
                !== isHighlightingButton) {
            isHighlightingButton = !isHighlightingButton;
            Overlays.editOverlay(buttonHighlightOverlay, {
                localPosition: Vec3.sum({ x: 0, y: 0, z: HIGHLIGHT_Z_OFFSET },
                    intersectionOverlayID === scaleButtonOverlay ? BUTTON_POSITIONS[0] : BUTTON_POSITIONS[1]),
                visible: isHighlightingButton
            });
        }

        // Button click.
        if (!isHighlightingButton || controlHand.triggerClicked() !== isButtonPressed) {
            isButtonPressed = isHighlightingButton && controlHand.triggerClicked();
            if (isButtonPressed && intersectionOverlayID === scaleButtonOverlay) {
                Overlays.editOverlay(scaleButtonOverlay, {
                    localPosition: Vec3.sum(BUTTON_POSITIONS[0], { x: 0, y: 0, z: 0.004 })
                });
            } else {
                Overlays.editOverlay(scaleButtonOverlay, {
                    localPosition: BUTTON_POSITIONS[0]
                });
            }
            if (isButtonPressed && intersectionOverlayID === cloneButtonOverlay) {
                Overlays.editOverlay(cloneButtonOverlay, {
                    localPosition: Vec3.sum(BUTTON_POSITIONS[1], { x: 0, y: 0, z: 0.004 })
                });
            } else {
                Overlays.editOverlay(cloneButtonOverlay, {
                    localPosition: BUTTON_POSITIONS[1]
                });
            }
            if (isButtonPressed) {
                setAppScaleWithHandlesCallback();
            }
        }
    }

    function display() {
        // Creates and shows menu entities.
        var handJointIndex,
            properties;

        if (isDisplaying) {
            return;
        }

        // Joint index.
        handJointIndex = MyAvatar.getJointIndex(controlJointName);
        if (handJointIndex === -1) {
            // Don't display if joint isn't available (yet) to attach to.
            // User can clear this condition by toggling the app off and back on once avatar finishes loading.
            // TODO: Log error.
            return;
        }

        // Calculate position to put menu.
        properties = Object.clone(PANEL_ORIGIN_PROPERTIES);
        properties.parentJointIndex = handJointIndex;
        properties.localPosition = Vec3.sum(PANEL_ROOT_POSITION, { x: lateralOffset, y: 0, z: 0 });
        menuOriginOverlay = Overlays.addOverlay("sphere", properties);

        // Create menu items.
        properties = Object.clone(MENU_PANEL_PROPERTIES);
        properties.parentID = menuOriginOverlay;
        menuPanelOverlay = Overlays.addOverlay("cube", properties);
        properties = Object.clone(BUTTON_PROPERTIES);
        properties.parentID = menuOriginOverlay;
        properties.localPosition = BUTTON_POSITIONS[0];
        properties.color = BUTTON_COLORS[0];
        scaleButtonOverlay = Overlays.addOverlay("cube", properties);
        properties.localPosition = BUTTON_POSITIONS[1];
        properties.color = BUTTON_COLORS[1];
        cloneButtonOverlay = Overlays.addOverlay("cube", properties);

        // Prepare button highlight overlay.
        properties = Object.clone(BUTTON_HIGHLIGHT_PROPERTIES);
        properties.parentID = menuOriginOverlay;
        buttonHighlightOverlay = Overlays.addOverlay("cube", properties);

        isDisplaying = true;
    }

    function clear() {
        // Deletes menu entities.
        if (!isDisplaying) {
            return;
        }

        Overlays.deleteOverlay(buttonHighlightOverlay);
        Overlays.deleteOverlay(cloneButtonOverlay);
        Overlays.deleteOverlay(scaleButtonOverlay);
        Overlays.deleteOverlay(menuPanelOverlay);
        Overlays.deleteOverlay(menuOriginOverlay);
        isDisplaying = false;
    }

    function destroy() {
        clear();
    }

    return {
        setHand: setHand,
        entityIDs: getEntityIDs,
        update: update,
        display: display,
        clear: clear,
        destroy: destroy
    };
};

ToolMenu.prototype = {};

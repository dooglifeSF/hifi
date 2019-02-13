//
//  Created by Bradley Austin Davis on 2018/11/20
//  Copyright 2013-2018 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
package io.highfidelity.oculus;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.WindowManager;

/**
 * Contains a native surface and forwards the activity lifecycle and surface lifecycle
 * events to the OculusMobileDisplayPlugin
 */
public class OculusMobileActivity extends Activity implements SurfaceHolder.Callback {
    private static final String TAG = OculusMobileActivity.class.getSimpleName();
    static { System.loadLibrary("oculusMobile"); }
    private native void nativeOnCreate();
    private native static void nativeOnResume();
    private native static void nativeOnPause();
    private native static void nativeOnDestroy();
    private native static void nativeOnSurfaceChanged(Surface s);

    private SurfaceView mView;
    private SurfaceHolder mSurfaceHolder;


    public static void launch(Activity activity) {
        if (activity != null) {
            activity.runOnUiThread(()->{
                activity.startActivity(new Intent(activity, OculusMobileActivity.class));
            });
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.w(TAG, "QQQ onCreate");
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // Create a native surface for VR rendering (Qt GL surfaces are not suitable
        // because of the lack of fine control over the surface callbacks)
        mView = new SurfaceView(this);
        setContentView(mView);
        mView.getHolder().addCallback(this);

        // Forward the create message to the JNI code
        nativeOnCreate();
    }

    @Override
    protected void onDestroy() {
        Log.w(TAG, "QQQ onDestroy");
        if (mSurfaceHolder != null) {
            nativeOnSurfaceChanged(null);
        }
        nativeOnDestroy();
        super.onDestroy();
    }

    @Override
    protected void onResume() {
        Log.w(TAG, "QQQ onResume");
        super.onResume();
        nativeOnResume();
    }

    @Override
    protected void onPause() {
        Log.w(TAG, "QQQ onPause");
        nativeOnPause();
        super.onPause();
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        Log.w(TAG, "QQQ surfaceCreated");
        nativeOnSurfaceChanged(holder.getSurface());
        mSurfaceHolder = holder;
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        Log.w(TAG, "QQQ surfaceChanged");
        nativeOnSurfaceChanged(holder.getSurface());
        mSurfaceHolder = holder;
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        Log.w(TAG, "QQQ surfaceDestroyed");
        nativeOnSurfaceChanged(null);
        mSurfaceHolder = null;
    }
}
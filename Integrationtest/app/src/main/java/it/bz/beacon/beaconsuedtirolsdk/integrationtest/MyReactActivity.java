package it.bz.beacon.beaconsuedtirolsdk.integrationtest;

import android.os.Bundle;

import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.ijzerenhein.sharedelement.RNSharedElementPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.reactlibrary.BeaconSuedtirolMobileSdkPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.kevinejohn.RNMixpanel.*;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

// import com.facebook.react.LifecycleState;

public class MyReactActivity extends ReactActivity implements DefaultHardwareBackBtnHandler {
    public static final String QUEST_LOCALE = "beacon_adventure_quest_locale";
    public static final String USER_EMAIL = "beacon_adventure_user_email";

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String questLocale = getIntent().hasExtra(QUEST_LOCALE) ? getIntent().getStringExtra(QUEST_LOCALE) : "de";
        String userEmail = getIntent().hasExtra(USER_EMAIL) ? getIntent().getStringExtra(USER_EMAIL) : "";

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setCurrentActivity(this)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackage(new MainReactPackage())
                .addPackage(new RNGestureHandlerPackage())
                .addPackage(new RNLocalizePackage())
                .addPackage(new LottiePackage())
                .addPackage(new ReanimatedPackage())
                .addPackage(new LinearGradientPackage())
                .addPackage(new RNSharedElementPackage())
                .addPackage(new BeaconSuedtirolMobileSdkPackage())
                .addPackage(new RNMixpanel())
                .addPackage(new RNDeviceInfo())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        // The string here (e.g. "MyReactNativeApp") has to match
        // the string in AppRegistry.registerComponent() in index.js
        Bundle options = new Bundle();
        options.putString(QUEST_LOCALE, questLocale);
        options.putString(USER_EMAIL, userEmail);
        mReactRootView.startReactApplication(mReactInstanceManager, "BeaconAdventure", options);

        setContentView(mReactRootView);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MyReactActivity.this);
            }
        };
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
}

# beacon-gamification-module

### Setup

Gamification module is a module written in React Native to integrate Beacon Adventure "app" inside your Android project (link: https://github.com/noi-techpark/beacon-gamification-app)! I assume that you've already setup your machine with a proper enviroment:
- Android SDK installed and PATH exported to your .bashprofile
- react-native installed globally

You can find more details on react native site: https://facebook.github.io/react-native/

### Application constraints

Minimun SDK version for Android: 5.0 (level 21)

### Module structure

In this project, you'll find a real Android application which integrates our module. First thing to do is to copy-paste BeaconAdventure folder inside your project (please keep the same structure as the demo project) and run `yarn install` inside that folder

### Customize starting quest

If you want to change your starting quest, you need to edit QuestPreview.tsx file inside BeaconAdventure folder

```typescript
setQuest(
  find(quests, q => q.name.toLowerCase() === "INSERT_YOUR_QUEST_NAME_HERE")
);
```

### Enable Quest List 

First of all you need to edit the following files:

QuestPreviex.tsx

```typescript
- const [quest, setQuest] = useState();
+ const quest: Quest = useNavigationParam('quest');

// comment out useEffect method

// change onStartQuestPressed
const onStartQuestPressed = () => {
  NearbyBeacons.configureScanMode(2);
  NearbyBeacons.setDeviceUpdateCallbackInterval(2);
  
  navigation.navigate(ScreenKeys.StepViewer, {
    quest,
    stepId: 1,
    token,
    userId: user.id
  });
}  
```

App.tsx

```typescript
+ initialRouteName: ScreenKeys.Onboarding,
- initialRouteName: ScreenKeys.QuestPreview,
```

QuestCompleted.tsx

```typescript
const onFinishQuestPressed = () => {
  navigation.navigate(ScreenKeys.Home);
};
```

After this you can proceed with other configurations!

### Edit your project

You now need to edit some of your files to support react native integration

build.gradle, you need to add the following maven imports

```gradle
allprojects {
    repositories {
        google()
        mavenLocal()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../../BeaconAdventure/node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../../BeaconAdventure/node_modules/jsc-android/dist")
        }
        maven { url "http://it.bz.opendatahub.s3-website-eu-west-1.amazonaws.com/snapshot" }
        maven { url 'https://jitpack.io' }
        jcenter()
    }
}
```

settings.gradle

```gradle
apply from: file("BeaconAdventure/node_modules/@react-native-community/cli-platform-android/native_modules.gradle")
applyNativeModulesSettingsGradle(settings, "BeaconAdventure")
```

app/build.gradle, you need to configure it to support react-native + beacon SDK for the gamification!

```gradle
project.ext.react = [
        entryFile: "index.js",
        root: "../BeaconAdventure",
        enableHermes: false,  // clean and rebuild if changing
]

apply from: "../BeaconAdventure/node_modules/react-native/react.gradle"

def enableSeparateBuildPerCPUArchitecture = false
def jscFlavor = 'org.webkit:android-jsc:+'
def enableHermes = project.ext.react.get("enableHermes", false)

applicationVariants.all { variant ->
    variant.outputs.each { output ->
        // For each separate APK per architecture, set a unique version code as described here:
        // https://developer.android.com/studio/build/configure-apk-splits.html
        def versionCodes = ["armeabi-v7a": 1, "x86": 2, "arm64-v8a": 3, "x86_64": 4]
        def abi = output.getFilter(OutputFile.ABI)
        if (abi != null) {  // null for the universal-debug, universal-release variants
            output.versionCodeOverride =
                    versionCodes.get(abi) * 1048576 + defaultConfig.versionCode
        }

    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation "com.facebook.react:react-native:0.61.4"
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.core:core-ktx:1.1.0'
    implementation "it.bz.beacon:sdk:0.2.10-SNAPSHOT"
    implementation "com.kontaktio:sdk:4.0.3"
    implementation project(path: ':react-native-gesture-handler')
    implementation project(path: ':react-native-localize')
    implementation project(path: ':lottie-react-native')
    implementation project(path: ':react-native-reanimated')
    implementation project(path: ':react-native-linear-gradient')
    implementation project(path: ':react-native-shared-element')
    implementation project(path: ':react-native-beacon-suedtirol-mobile-sdk')

    if (enableHermes) {
        def hermesPath = "../BeaconAdventure/node_modules/hermes-engine/android/";
        debugImplementation files(hermesPath + "hermes-debug.aar")
        releaseImplementation files(hermesPath + "hermes-release.aar")
    } else {
        implementation jscFlavor
    }
}

apply from: file("../BeaconAdventure/node_modules/@react-native-community/cli-platform-android/native_modules.gradle")
applyNativeModulesAppBuildGradle(project, "../BeaconAdventure")
```

AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE"/>
```

And inside your `<application>` tag add

```xml
<activity
    android:name=".MyReactActivity"
    android:label="@string/app_name"
    android:theme="@style/Theme.AppCompat.Light.NoActionBar">
</activity>
```

Then you need to add MyReactActivity.java to your code (you can copy-paste it from the demo project)

After this you need to edit your Application.java file

```java
import it.bz.beacon.beaconsuedtirolsdk.NearbyBeaconManager;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(new MyReactNativePackage());
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        NearbyBeaconManager.initialize(this);
    }
}
```

### Application architecture

About the application itself, you can find more info in its repository: https://github.com/noi-techpark/beacon-gamification-app

### Release

Edit the build.gradle file with your keystore information

```gradle
...
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        ...
        // insert here keystore informations
        ...
    }
}
buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release // change the line HERE after you have configured the keytore
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
...
```

Then you need to generate the app.bundle for the gamification module. I've already created the script command in the `package.json`, so you just need to run `yarn bundle-android` from BeaconAdventure folder.

After this you can use `./gradlew assembleRelease` command like every Android app to assemble your APK

### CI

If you want to setup CI for your version of the application, you just need to execute the scripts in Installation section (after you've of course set up your CI machine with RN and Android SDK) and then run the command posted in Release section

License
----

MIT

**Free Software, Hell Yeah!**

> Made with ❤️ from Belka and NOI Tech Park


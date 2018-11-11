#!/bin/bash

# Below directory is not needed and causes duplicate module warnings
rm -rf node_modules/react-native-force/node_modules/react-native

# Fix name collision in package.json from the iOS and Android SDKs
sed -i '' 's/SalesforceReact\"/SalesforceReactAndroid\"/g;' mobile_sdk/SalesforceMobileSDK-Android/libs/SalesforceReact/package.json
sed -i '' 's/SalesforceReact\"/SalesforceReactiOS\"/g;' mobile_sdk/SalesforceMobileSDK-iOS/libs/SalesforceReact/package.json

# Add missing app icon set needed for Xcode 10 compilation
APPICON_DIR=mobile_sdk/SalesforceMobileSDK-iOS/shared/resources/SalesforceSDKAssets.xcassets/AppIcon.appiconset
mkdir $APPICON_DIR
cp appicon-contents.json $APPICON_DIR/Contents.json

# Fix React Native version in Android build script
sed -i '' 's/react-native:0.55.4/react-native:0.56.0/g;' mobile_sdk/SalesforceMobildSDK-Android/libs/SalesforceReact/build.gradle


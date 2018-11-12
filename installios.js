#!/usr/bin/env node

const execSync = require('child_process').execSync;

console.log('Installing npm dependencies');
execSync('npm install', { stdio: [0, 1, 2] });

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const packageJson = require('./package.json');

console.log('Installing sdk dependencies');
const sdkDependency = 'SalesforceMobileSDK-iOS';
const repoUrlWithBranch = packageJson.sdkDependencies[sdkDependency];
const parts = repoUrlWithBranch.split('#'),
  repoUrl = parts[0],
  branch = parts.length > 1 ? parts[1] : 'master';
const targetDir = path.join('mobile_sdk', sdkDependency);
if (fs.existsSync(targetDir)) {
  rimraf.sync(targetDir);
}

execSync(
  `git clone --branch ${branch} --single-branch --depth 1 ${repoUrl} ${targetDir}`,
  { stdio: [0, 1, 2] }
);

console.log('Installing pod dependencies');
execSync('pod install', { stdio: [0, 1, 2], cwd: 'ios' });

console.log('Generating JS bundle');
execSync('npm run bundle_ios_dev', { stdio: [0, 1, 2] });

console.log('Fix name collision in package.json from the iOS and Android SDKs');
execSync(
  "sed -i '' 's/SalesforceReact\"/SalesforceReactiOS\"/g;' mobile_sdk/SalesforceMobileSDK-iOS/libs/SalesforceReact/package.json",
  { stdio: [0, 1, 2] }
);

console.log('Add missing app icon set needed for Xcode 10 compilation');
const APPICON_DIR =
  'mobile_sdk/SalesforceMobileSDK-iOS/shared/resources/SalesforceSDKAssets.xcassets/AppIcon.appiconset';
execSync(`mkdir -p ${APPICON_DIR}`, { stdio: [0, 1, 2] });
execSync(`cp appicon-contents.json ${APPICON_DIR}/Contents.json`, {
  stdio: [0, 1, 2]
});

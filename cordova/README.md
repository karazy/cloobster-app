#Summary
Each subfolder contains one cordova project that represents a whitelabel.

#Cordova Whitelabel Setup

##List of used cordova plugins for project setup:
com.borismus.webintent 1.0.0 "WebIntent"
com.phonegap.plugins.barcodescanner 2.0.1 "BarcodeScanner"
org.apache.cordova.camera 0.3.3 "Camera"
org.apache.cordova.console 0.2.11 "Console"
org.apache.cordova.device 0.2.12 "Device"
org.apache.cordova.file 1.3.1 "File"
org.apache.cordova.file-transfer 0.4.7 "File Transfer"
org.apache.cordova.geolocation 0.3.10 "Geolocation"
org.apache.cordova.inappbrowser 0.5.3 "InAppBrowser"
org.apache.cordova.network-information 0.2.13 "Network Information"
org.apache.cordova.splashscreen 0.3.4 "Splashscreen"

###Install Plugins
cordova plugins add com.phonegap.plugins.barcodescanner org.apache.cordova.camera org.apache.cordova.console org.apache.cordova.device org.apache.cordova.file org.apache.cordova.file-transfer org.apache.cordova.geolocation org.apache.cordova.inappbrowser org.apache.cordova.network-information org.apache.cordova.splashscreen https://github.com/Initsogar/cordova-webintent


###Install Facebook Plugin - special treatment
Source: https://github.com/Wizcorp/phonegap-facebook-plugin

cordova -d plugin add /Users/frederikreifschneider/karazy/tool/phonegap-facebook-plugin --variable APP_ID="359215437471990" --variable APP_NAME="Cloobster"

cordova -d plugin add /Users/fred/karazy/tools/phonegap-facebook-plugin --variable APP_ID="359215437471990" --variable APP_NAME="Cloobster"

##Copy additional resource files
Under {project_root}/resources/{whitelabel}/{os} are resources that need to be copied to specific folders.
Those resources contain icons, or changed configurations.
Q: Why do we keep them there.
A: Often enough a recreation of cordova project is necessary and you easily loose custom adjustements.

##Misc setup
Add correct url scheme for ios.
Make sure AndroidManifest has setup the intent filters.

##Specific project requirements
###FRIZZ 
Project name is set to FRIZZ and not FRIZZ+ due to errors in project setup.
Adjust name manually where necessary.
Android: AndroidManifest.xml


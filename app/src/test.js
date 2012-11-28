var Harness = Siesta.Harness.Browser.SenchaTouch;
var cordovaInit = true;

Harness.configure({
    title               : 'All-in-one Siesta Examples for Sencha Touch',
    // transparentEx       : false,
    performSetup: false,
    hostPageUrl: 'index.html',
    preload: [
        // "touch/sencha-touch-all.js",
        // "/_ah/channel/jsapi",
        // "lib/facebook_js_sdk.js",
        // "app.js"
    ]
});

Harness.on('testsuitestart', function (event, harness) {
    window.localStorage.removeItem('eatSense_app_store');
    window.localStorage.removeItem('eatSense_app_store-1');
}, this, { single : true });

Harness.start(
    'test/010_checkin/001_checkin.t.js'
    // {
    //     group : 'Check-in Suite',

    //     // Load these files for each ST 2.0 test
    //     preload : [
    //         // "res/css/app-default.css"
    //         // "../touch/resources/css/sencha-touch.css",
    //         // "../touch/sencha-touch-all-debug.js"
    //     ],
    //     items : [
    //         'test/010_checkin/001_checkin.t.js',
    //         // {
    //         //     url : '020-sencha_touch_2.x/010_map.t.js',
    //         //     overrideSetTimeout : false,
    //         //     performSetup : false,       // This is done by the maps example itself
    //         //     alsoPreload : [
    //         //         "http://maps.google.com/maps/api/js?sensor=true",
    //         //         "../touch/examples/map/app.js",
    //         //         "../touch/examples/map/lib/plugin/google/Tracker.js",
    //         //         "../touch/examples/map/lib/plugin/google/Traffic.js",
    //         //     ]
    //         // },
    //         // {
    //         //     url : '020-sencha_touch_2.x/011_carousel.t.js',
    //         //     alsoPreload : [
    //         //         "020-sencha_touch_2.x/011_carousel.t.css"
    //         //     ]
    //         // },
    //         // '020-sencha_touch_2.x/012_form.t.js',
    //         // '020-sencha_touch_2.x/013_buttons.t.js',
    //         // '020-sencha_touch_2.x/014_events.t.js',
    //         // '020-sencha_touch_2.x/015_nested_list.t.js',
    //         // '020-sencha_touch_2.x/016_contact_list.t.js',
    //         // '020-sencha_touch_2.x/017_tabs.t.js'
    //     ]
    // }
);



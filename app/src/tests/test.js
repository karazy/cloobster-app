var Harness = Siesta.Harness.Browser.SenchaTouch;
var cordovaInit = true;

Harness.configure({
    title               : 'cloobster app workflow tests',
    transparentEx       : true,
    testClass   : EatSense.test.CloobsterTest,
    performSetup: false,
    hostPageUrl: '../index.html',
    preload: [
        // "touch/sencha-touch-all.js",
        // "/_ah/channel/jsapi",
        // "lib/facebook_js_sdk.js",
        // "app.js"
    ],
});


Harness.on('testsuitestart', function (event, harness) {
    clearLocalstorage();
}, this);

Harness.on('teststart', function (event, harness) {
    clearLocalstorage();
}, this);

function clearLocalstorage() {
    console.log('Deleting app local storage ...');
    window.localStorage.removeItem('eatSense_app_store');
    window.localStorage.removeItem('eatSense_app_store-1');
}

Harness.start(
    {
        group: 'Order' ,
        items: [
            '010_checkin/001_simple_order.t.js',
            '010_checkin/020_switch_area.t.js',
            '010_checkin/030_switch_area_barcode.t.js'
        ]
    },
    {
        group: 'Basic Mode',
        items: [
            '020_basicmode/010_check_dashboard.t.js',
            '020_basicmode/015_check_leave_alert.t.js',
            '020_basicmode/020_click_infopageteaser.t.js',
            '020_basicmode/025_hidden_cart_button.t.js'
        ]
    },
    {
        group: 'Welcome Mode',
        items: [
            '030_welcomemode/010_check_dashboard.t.js',
            '030_welcomemode/015_cart_welcomefn.t.js'
        ]
    }
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



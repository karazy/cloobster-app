var Harness = Siesta.Harness.Browser.SenchaTouch;

Harness.configure({
    title     : 'cloobster app unit tests',

    preload : [
        "../../touch/resources/css/sencha-touch.css",
        "../../touch/sencha-touch-all.js",
        "../../app/util/Constants.js",
        "../../app/util/Configuration.js",
        "../../app/util/Helper.js",
    ]
});

Harness.start(
    {
        url : '01_custom_components/001_basicbutton.t.js',
        performSetup : true,
        // overrideSetTimeout : false,
        alsoPreload : [
            "../../app/view/components/BasicButton.js",            
        ]
    }
    // '011_carousel.t.js',
    // '012_form.t.js',
    // '013_buttons.t.js',
    // '014_events.t.js',
    // '015_nested_list.t.js',
    // '016_contact_list.t.js',
    // '017_tabs.t.js'
        
);


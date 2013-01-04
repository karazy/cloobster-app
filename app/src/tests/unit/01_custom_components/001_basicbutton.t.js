StartTest(function(t) {
    t.diag('Testing basic button');

    var welcomeExecuted = false;

    Ext.Viewport.add({
        xtype: 'panel',
        items: [
            {
                xtype: 'basicbutton',
                text: 'Basic Button - Welcome Mode',
                welcome: true,
                welcomeFn: function() {
                    welcomeExecuted = true;
                }
            }
        ]
    });

    t.tap(t.cq1('basicbutton'));
    t.ok(welcomeExecuted == true, 'welcome function executed');

    t.waitForEvent(t.cq1('basicbutton'), 'tap', function() {
        t.ok(welcomeExecuted == true, 'welcome function executed');
    }, 2000);

});

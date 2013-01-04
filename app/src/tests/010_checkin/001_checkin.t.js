StartTest(function(t) {
    t.diag('Check-in Test');

    t.ok(EatSense, 'App loaded');
    t.diag('Check some dependencies.');
    t.ok(appConfig, 'appConfig exists');
    t.ok(appConstants, 'appConstants exists');
    t.ok(appHelper, 'appHelper exists');
    t.ok(appChannel, 'appChannel exists');

    t.chain(
        {
            action : 'tap',
            target : Ext.ComponentQuery.query('dashboard button[action=checkin]')[0]
        },
        {
            waitFor: 1500
        },
        { action : 'click', target : Ext.Msg.down('textfield')},
        { action : 'type', target : Ext.Msg.down('textfield'), text : 'tst001'},        
        {
            action      : 'tap',
            target      : function () {
                return Ext.Msg.down('button[itemId=yes]');
            } 
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('mainview checkinconfirmation'), next, this, 3000);
        },
        {
            action : 'tap',
            target : function() {
                return t.cq1('checkinconfirmation button[action=confirm-checkin]');
            }
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard'), next, this, 3000);
        },
        function() {
            t.done();
        }
    );

});

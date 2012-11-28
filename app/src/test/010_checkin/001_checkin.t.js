StartTest(function(t) {
    t.diag('Check-in Test');

    t.ok(EatSense, 'App loaded');
    t.diag('Check some dependencies.');
    t.ok(appConfig, 'appConfig exists');
    t.ok(appConstants, 'appConstants exists');
    t.ok(appHelper, 'appHelper exists');
    t.ok(appChannel, 'appChannel exists');
    t.ok(i10n, 'i10n exists');

    t.chain(
        {
            action : 'tap',
            target : Ext.ComponentQuery.query('dashboard button[action=checkin]')[0]
        },
        {
            waitFor: 2000
        },
        { action : 'click', target : Ext.Msg.down('textfield')},
        { action : 'type', target : Ext.Msg.down('textfield'), text : 'tst001'},
        { waitFor: 2000 },
        {
            action      : 'tap',
            target      : function () {
                return Ext.Msg.down('button[itemId=yes]');
            } 
        },
        { waitFor: 1500 },
        {
            action : 'tap',
            target : function() {
                return Ext.ComponentQuery.query('checkinconfirmation button[action=confirm-checkin]')[0];
            }
        }

    );

    t.done();

});

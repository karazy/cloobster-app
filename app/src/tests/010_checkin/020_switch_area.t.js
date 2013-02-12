StartTest(function(t) {
        //switch area and check if products get updated
         t.diag('Switch Area Test');
        //start checkin
	    t.chain(
    	{
            action : 'tap',
            target : t.cq1('dashboard button[action=checkin]')
        },
        function(next) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        { action : 'click', target : Ext.Msg.down('textfield')},
        { 
            action : 'type', 
            target : function() {
                return Ext.Msg.down('textfield');
            }, 
            text : 'tst001'
        },
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
            action: 'click', 
            target: function() {
                return t.cq1('checkinconfirmation #nicknameTf');
            }
        },
        {
            action : 'type',
            target: function() {
                return t.cq1('checkinconfirmation #nicknameTf');
            },
            text : 'Test User'
        },
        {
            action : 'tap',
            target : function() {
                return t.cq1('checkinconfirmation button[action=confirm-checkin]');
            }
        },        
        //end checkin
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard dashboardteaser[type=product]'), next, this, 3000);
        },
        function(next) {
            //TODO find a more stable way to select the special product
            var teaser = t.cq1('lounge clubarea clubdashboard dashboardteaser[type=product]');

            t.waitForContentLike(teaser.element, 'Der Geflügelte', next, this, 1000);
        },
        {
            action: 'tap',
            target: function() {
                return t.cq1('lounge button[action=toggle-navigation]');
            }
        },
        //wait that all dynamich elements have been created
        {
            waitFor: 1500
        },
        function(next) {
            var lounge = t.cq1('lounge'),
                record,
                listEle;
            // listEle = lounge.getList().element;

            record = lounge.getList().getStore().find('title', 'Zimmerservice');
            t.isGreater(record, -1, 'found a mathing service area');
            lounge.getList().select(record);
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard dashboardteaser[type=product]'), next, this, 3000);
        },
        function(next) {
            var teaser = t.cq1('lounge clubarea clubdashboard dashboardteaser');

            t.waitForContentLike(teaser.element, 'Der Pure', next, this, 1000);
        },
        function() {
            t.done();
        }

        );

});
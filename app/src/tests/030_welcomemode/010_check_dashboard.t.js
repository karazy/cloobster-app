StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible

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
            text : '$2a$10$2K4lMULCKPJ1MR.XnCLuzeB04wxYKCif/iDgfK1MElytM.AwFPidq'
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
        function(next) {
            t.waitForComponentVisible(t.cq1('clubdashboard basictilebutton[action="show-feedback"]'), next, this, 3000);
        },
        //end checkin
        {
            action: 'tap',
            target: function() {
                t.diag('test feedback button welcome fn');
                return t.cq1('clubdashboard basictilebutton[action="show-feedback"]');
            }
        },
        function(next, title) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        {
            action      : 'tap',
            target      : function () {
                return Ext.Msg.down('button[itemId=ok]');
            } 
        },
       function(next, title) {
            t.waitForComponentNotVisible(Ext.Msg, next, this, 3000);
        },
        {
            action: 'tap',
            target: function() {
                t.diag('test vip button welcome fn');
                return t.cq1('clubdashboard basictilebutton[action=show-requests]');
            }
        },
        function(next, title) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        function() {
        	t.done();
        }
        );


});

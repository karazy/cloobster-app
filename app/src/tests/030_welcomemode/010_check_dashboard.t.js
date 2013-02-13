StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible

        //start checkin
	    t.chain(
    	function(next) {
            t.checkIn('welcome001', next);
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

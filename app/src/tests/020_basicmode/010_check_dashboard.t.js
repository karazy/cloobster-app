StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible
		//do a checkin
		// t.checkIn(runTest);

	    t.chain(
    	{
            action : 'tap',
            target : t.cq1('dashboard button[action=checkin]')
        },
        function(next) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        { action : 'tap', target : Ext.Msg.down('textfield')},
        { 
            action : 'type', 
            target : function() {
                return Ext.Msg.down('textfield');
            }, 
            text : 'tstbasic001'
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
            t.waitForComponentVisible(t.cq1('clubdashboard basictilebutton'), next, this, 3000);
        },
        //explicit wait necessary for buttons to be fully rendered and initialized
        {
            waitFor: 1000
        },
        function(next) {
        	var buttons = t.cq('basictilebutton');

        	t.ok(buttons.length == 2, 'found 2 basictilebutton buttons');

        	
        	buttons.forEach(function(b) {
        		t.is(b.getHidden(), true, b.getText() + ' is not visible');
        	});

            next();
        	
        },
        function() {
        	t.done();
        }
        );

});

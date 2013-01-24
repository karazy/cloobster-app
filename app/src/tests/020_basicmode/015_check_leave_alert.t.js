StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible
		//do a checkin
		// t.checkIn(runTest);
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
        { action : 'type', target : Ext.Msg.down('textfield'), text : 'basic001'},        
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
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard'), next, this, 3000);
        },
        {
            action: 'tap',
            target: function() {
                return t.cq1('lounge #ext-tab-3');
            }
        },
        function(next) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        {
            action      : 'tap',
            target      : function () {
                return Ext.Msg.down('button[itemId=yes]');
            } 
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('dashboard'), next, this, 3000);
        },
        function() {
        	t.done();
        }
        );

		// var steps = [
		// 	function(next) {
  //       	var buttons = t.cq('basicbutton');

  //       	t.ok(buttons.length == 2, 'found 2 basic buttons');

        	
  //       	buttons.forEach(function(b) {
  //       		t.is(b.getHidden(), true, b.getText() + ' is not visible');
  //       	});
        	
	 //        },
	 //        function() {
	 //        	t.done();
	 //        }
		// ];
		
		// function runTest() {
		// 	console.log('TEST TEST TEST');
		// 	t.chain(steps);
		// }

});

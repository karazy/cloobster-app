StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible
		//do a checkin
		// t.checkIn(runTest);
        //start checkin
	    t.chain(
    	function(next) {
            t.checkIn('tstbasic001', next);
        },
        //end checkin
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard'), next, this, 3000);
        },
        {
            action: 'tap',
            target: function() {
                return t.cq1('lounge button[action=toggle-navigation]');
            }
        },
        function(next) {
            //get navigation list
            t.waitForElementVisible(t.cq1('lounge list'), next, this, 3000);
        },
        function(next) {
            var lounge = t.cq1('lounge');
            
            lounge.selectByAction('show-myorders');
            next();

            // var listEle = t.cq1('lounge list').element;
            // //first item are empty, maybe because of the new list implementation in 2.1
            // listEleHtml = listEle.down('.x-list-item:nth-child(3) .x-list-item-body');
            // t.tap(listEleHtml);
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

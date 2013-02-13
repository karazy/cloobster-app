StartTest(function(t) {
		//Check into a basic mode location and test if only 2 Dashboard Buttons are visible
		//do a checkin
		// t.checkIn(runTest);

	    t.chain(
        function(next) {
            t.checkIn('tstbasic001', next);
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

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
            t.waitForComponentVisible(t.cq1('lounge clubarea dashboardteaser[type=info]'), next, this, 3000);
        },
        function(next) {
            var ipt = t.cq1('dashboardteaser[type=info]'),
                title;

            title = ipt.getPage().get('title');
            
            next(title);

        },
        function(next, title) {
            t.tap(t.cq1('lounge clubarea dashboardteaser[type=info]'), next(title));
        },
        // {
        //     action: 'tap',
        //     target: function() {
        //         return t.cq1('lounge clubarea infopageteaser');
        //     }
        // },
        function(next, title) {
            t.waitForComponentVisible(t.cq1('infopagecarousel'), function() {
                next(title)
            }, this, 3000);
        },
        function(next, title) {
            var carousel = t.cq1('infopagecarousel'),
                activePage, record;

            activePage = carousel.getActiveItem();

            t.contentLike(activePage.element, title, 'Correct infopage loaded.');
            next();

        },
        function() {
        	t.done();
        }
        );


});

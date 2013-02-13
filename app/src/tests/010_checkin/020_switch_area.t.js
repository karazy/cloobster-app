StartTest(function(t) {
        //switch area and check if products get updated
         t.diag('Switch Area Test');
        //start checkin
	    t.chain(
    	function(next) {
            t.checkIn('tst001', next);
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
                record;

            record = lounge.getList().getStore().find('title', 'Zimmerservice');
            t.isGreater(record, -1, 'found a matching service area');
            lounge.getList().select(record);
            next();
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard dashboardteaser[type=product]'), next, this, 3000);
        },
        function(next) {
            var teaser = t.cq1('lounge clubarea clubdashboard dashboardteaser[type=product]');

            t.waitForContentLike(teaser.element, 'Der Pure', next, this, 1000);
        },
        function() {
            t.done();
        }

        );

});
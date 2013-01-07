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
            action : 'tap',
            target : function() {
                return t.cq1('checkinconfirmation button[action=confirm-checkin]');
            }
        },
        //end checkin
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea infopageteaser'), next, this, 3000);
        },
        function(next) {
            var ipt = t.cq1('infopageteaser'),
                title;

            title = ipt.getPage().get('title');
            
            next(title);

        },
        function(next, title) {
            t.tap(t.cq1('lounge clubarea infopageteaser'), next(title));
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

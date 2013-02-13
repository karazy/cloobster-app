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
            target: t.cq1('clubdashboard button[action=show-menu]')
        },
        function(next) {
            t.elementIsVisible(t.cq1('lounge menutab menuoverview'), "menuoverview is visible");
            t.waitForComponentVisible(t.cq1('lounge menutab menuoverview list'), next, this, 3000);
        },
       function(next) {
        t.waitFor({
            method: function() {
                var listEle = t.cq1('lounge menutab menuoverview list').element;
                listEleHtml = listEle.down('.x-list-item:nth-child(2)');

                return (listEleHtml != 'undefined' && listEleHtml != null);
            },
            callback: next,
            scope: this,
            timeout: 1000
        });
    },
    function(next) {
        var listEle = t.cq1('lounge menutab menuoverview list').element;
        //first item are empty, maybe because of the new list implementation in 2.1
        listEleHtml = listEle.down('.x-list-item:nth-child(2) .x-list-item-body');

        // t.waitForContentLike(listEleHtml, 'Geflügelburger', proceed, this, 1000);
        next(listEleHtml);  
        function proceed() {
            next(listEleHtml);  
        }
    },
    function(next, listItem) {
        t.click(listItem, next);
    },
    function(next) {
        t.waitForComponentVisible(t.cq1('lounge menutab productoverview list'), next, this, 3000);
    },
    function(next) {
        var listEle = t.cq1('lounge menutab productoverview list').element;
        //first item are empty, maybe because of the new list implementation in 2.1
        listEleHtml = listEle.down('.x-list-item:nth-child(2) .x-list-item-body');
        t.tap(listEleHtml, next);
        // t.waitForContentLike(listEleHtml, 'Geflügelburger', proceed, this, 1000);
        // next(listEleHtml);  
    },
    function(next) {
        t.waitForComponentVisible(t.cq1('productdetail'), next, this, 3000);
    },
    function(next) {
        t.waitForComponentNotVisible(t.cq1('productdetail button[action=cart]'), next, this, 3000);
    },
    function() {
    	t.done();
    }
    );


});

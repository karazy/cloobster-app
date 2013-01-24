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
        { action : 'type', target : Ext.Msg.down('textfield'), text : '2498-2500'},        
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
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard'), next, this, 3000);
        },
        //end checkin
          {
                action: 'tap',
                target: t.cq1('clubdashboard tilebutton[action=show-menu]')
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
            t.waitForComponentVisible(t.cq1('productdetail button[action=cart]'), next, this, 3000);
        },
        //does not work, don't know why
        // function(next) {
        //     var cartButton = t.cq1('productdetail button[action=cart]');
        //     //'EatSense.view.components.BasicButton'
        //     t.isCalled( 'getWelcomeFn', cartButton, 'Welcome function called');
        //     next();
        // },
        {
            action: 'tap',
            target: function() {
                return t.cq1('productdetail button[action=cart]');
            }
        },
        function(next, title) {
            t.waitForComponentVisible(Ext.Msg.down('button[itemId=ok]'), next, this, 3000);
        },
        function() {
        	t.done();
        }
        );


});

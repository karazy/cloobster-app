StartTest(function(t) {
        //switch area and check if products get updated
         t.diag('Switch Area List with Orders Test');

        //start checkin
	    t.chain(
        function(next) {
            t.testUserLogin(Ext, next);
        },
    	{
            action : 'tap',
            target : t.cq1('dashboard button[action=checkin]')
        },
        function(next) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        { action : 'click', target : Ext.Msg.down('textfield')},
        { 
            action : 'type', 
            target : function() {
                return Ext.Msg.down('textfield');
            }, 
            text : 'tst001'
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
        //end checkin
        //order a product
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard button[action=show-menu]'), next, this, 3000);
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
                    listEleHtml = listEle.down('.x-list-item:nth-child(6)');

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
            listEleHtml = listEle.down('.x-list-item:nth-child(6) .x-list-item-body');

            t.waitForContentLike(listEleHtml, 'Getränke', proceed, this, 2000);

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
        t.elementIsVisible(t.cq1('lounge menutab productoverview list'), 'productoverview is visible');
        var productInList;

            t.waitFor({
                method: function() {
                    var listEle = t.cq1('lounge menutab productoverview list').element;
                    productInList = listEle.down('.x-list-item:nth-child(2) .x-list-item-body');

                    return (productInList != 'undefined' && productInList != null);
                },
                callback: function() {
                    next(productInList);
                },
                scope: this,
                timeout: 1000
            });
        },
        function(next, product) {
            t.contentLike(product, 'Coca-Cola', 'Found product "Coca-Cola"');
            t.tap(product);
            t.waitForComponentVisible(t.cq1('productdetail'), next, this, 3000);
        },
        function(next) {
            t.diag('put product into cart');
            t.tap(t.cq1('productdetail button[action=cart]'), next);
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge menutab productoverview cartbutton'), next, this, 3000);
        },
        {
            action: 'tap',
            target: function() {
                return t.cq1('lounge menutab productoverview cartbutton');
            }
        },
        function(next) {
            t.waitForComponentVisible(t.cq1('lounge menutab carttab button[action=order]'), next, this, 3000);
        },
         {
            action: 'tap',
            target: function() {
                return t.cq1('lounge menutab carttab button[action=order]');
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
        //switch area
        {
            action: 'tap',
            target: function() {
                return t.cq1('lounge button[action=toggle-navigation]');
            }
        },
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
            t.waitForComponentVisible(t.cq1('lounge clubarea clubdashboard button[action=show-menu]'), next, this, 3000);
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
                    listEleHtml = listEle.down('.x-list-item:nth-child(4)');

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
            listEleHtml = listEle.down('.x-list-item:nth-child(4) .x-list-item-body');

            t.waitForContentLike(listEleHtml, 'Getränke', proceed, this, 2000);

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
          t.elementIsVisible(t.cq1('lounge menutab productoverview list'), 'productoverview is visible');
        var productInList;

            t.waitFor({
                method: function() {
                    var listEle = t.cq1('lounge menutab productoverview list').element;
                    productInList = listEle.down('.x-list-item:nth-child(2) .x-list-item-body');

                    return (productInList != 'undefined' && productInList != null);
                },
                callback: function() {
                    next(productInList);
                },
                scope: this,
                timeout: 1000
            });
        },
        function(next, product) {
            t.contentLike(product, 'Coca-Cola', 'Found product "Coca-Cola"');
            t.tap(product);
            t.waitForComponentVisible(t.cq1('productdetail'), next, this, 3000);
        },
        function(next) {
            t.diag('try put order into cart');
            t.tap(t.cq1('productdetail button[action=cart]'), next);
        },
        function(next) {
            t.waitForComponentVisible(Ext.Msg, next, this, 3000);
        },
        {
            action      : 'tap',
            target      : function () {
                return Ext.Msg.down('button[itemId=ok]');
            } 
        },
        {
            waitFor: 1500
        },
        {
            action      : 'tap',
            target      : function () {
                return t.cq('picker button')[1];
            } 
        },
        {
            waitFor: 2000
        },
        function(next) {
            var spotInList;
            t.diag('select spot');
            t.waitFor({
                method: function() {
                    var listEle = t.cq1('spotselection list').element;
                    spotInList = listEle.down('.x-list-item:nth-child(2) .x-list-item-body');

                    return (spotInList != 'undefined' && spotInList != null);
                },
                callback: function() {
                    next(spotInList);
                },
                scope: this,
                timeout: 1000
            });
        },
        function(next, spot) {
            t.contentLike(spot, 'Zimmer 001', 'Found spot Zimmer 001');
            t.tap(spot, next);
        },
        {
            waitFor: 1500
        },
        function(next) {
            t.diag('retry put order into cart');
            t.tap(t.cq1('productdetail button[action=cart]'));

            t.waitForComponentVisible(t.cq1('lounge menutab productoverview cartbutton'), next, this, 3000);
        },
        function() {
            t.done();
        }

        );

});
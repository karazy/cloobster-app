StartTest(function(t) {
    t.diag('Order Test');
    // var listEleHtml;

    t.chain(
    	{
            action : 'tap',
            target : Ext.ComponentQuery.query('dashboard button[action=checkin]')[0]
        },
        {
            waitFor: 1500
        },
        { action : 'click', target : Ext.Msg.down('textfield')},
        { action : 'type', target : Ext.Msg.down('textfield'), text : 'tst001'},        
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
    	listEleHtml = listEle.down('.x-list-item:nth-child(3) .x-list-item-body');

    	t.waitForContentLike(listEleHtml, 'Geflügelburger', proceed, this, 1000);

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
    	t.contentLike(product, 'Der Geflügelte', 'Found product "Der Geflügelte"');
    	t.tap(product);
    	t.waitForComponentVisible(t.cq1('productdetail'), next, this, 3000);
    },
    function(next) {
    	t.waitFor({
    		method: function() {
    			var listEle = t.cq1('productdetail').element;
    			listEleHtml = listEle.down('.option-panel');

    			return (listEleHtml != 'undefined' && listEleHtml != null);
    		},
    		callback: next,
    		scope: this,
    		timeout: 1000
    	});
    },
    //tap some options check product price, and close productdetail
    function(next) {
    	var productdetail,
    		choicesPanel,
    		optionPanels,
    		option,
    		optionLabel,
    		productPrice;

    	t.diag('open product | check some options | check correct price | close without order');
    	t.elementIsVisible(t.cq1('productdetail'), 'productdetail is visible');
    	productdetail = t.cq1('productdetail');
    	//check product price
    	productPrice = productdetail.element.down('.productPrice');    	
    	t.contentLike(productPrice, '5,95 €', 'product price is 5,95 €');

    	choicesPanel = t.cq1('productdetail #choicesPanel');    	

    	optionPanels = choicesPanel.element.query('.option-panel');

    	t.is(optionPanels.length, 3, 'found 3 option panels');

    	checkAndTapOption(t, choicesPanel, '.x-field:nth-child(2)', 'mit Bio-Dinkel-Hafer-Bröcthen');
    	checkAndTapOption(t, choicesPanel,'.x-field-checkbox:nth-child(1)', 'Zusätzliches Bio-Rindfleisch-Patty (+2,50 €)');
    	checkAndTapOption(t, choicesPanel,'.x-field-checkbox:nth-child(3)', 'Käse (+0,50 €)');

    	t.waitForContentLike(productPrice, '8,95 €', next, this, 1000);
    	
    },
    function(next) {
    	t.tap(t.cq1('productdetail button[action=close]'));
    	//wait until productdetail is destroyed
    	t.waitForComponentQueryNotFound('productdetail', next, this, 3000);
    },
    function(next) {
    	var list,
    		product;

    	t.diag('open the same product | check that price and options are in default state');
    	list = t.cq1('lounge menutab productoverview list');
    	product = list.element.down('.x-list-item:nth-child(2) .x-list-item-body');
    	t.tap(product);
    	t.waitForComponentQueryVisible('productdetail', next, this, 3000);
    },
    function(next) {
    	t.waitFor({
    		method: function() {
    			var productdetail = t.cq1('productdetail').element;
    			options = productdetail.down('.option-panel');

    			return (options != 'undefined' && options != null);
    		},
    		callback: next,
    		scope: this,
    		timeout: 1000
    	});
    },
    function(next) {    	
    	var productdetail,
    		choicesPanel,
    		optionPanels,
    		option,
    		optionLabel,
    		productPrice;
    	
    	productdetail = t.cq1('productdetail');
    	//check product price
    	productPrice = productdetail.element.down('.productPrice');    	
    	t.contentLike(productPrice, '5,95 €', 'product price is 5,95 €');

    	choicesPanel = t.cq1('productdetail #choicesPanel');    	

    	checkAndTapOption(t, choicesPanel, '.x-field:nth-child(2)', null);
    	checkAndTapOption(t, choicesPanel,'.x-field-checkbox:nth-child(1)', null);
    	checkAndTapOption(t, choicesPanel,'.x-field-checkbox:nth-child(3)', null);

    	t.waitForContentLike(productPrice, '8,95 €', next, this, 1000);
    },
    function(next) {
    	t.diag('place order')
    	t.tap(t.cq1('productdetail button[action=cart]'));

    	t.waitForCQVisible('lounge menutab productoverview cartbutton', next, this, 1000);
    },
    {	
    	//wait until the messagebox alert disappears
    	waitFor: 1500
    },
    function(next) {
    	var cartbutton;

    	cartbutton = t.cq1('lounge menutab productoverview cartbutton');

    	t.tap(cartbutton);

    	t.waitForCQVisible('lounge menutab carttab', next, this, 1000);
    },
    function() {
    	t.done();
    }
    );
});

//Execute a tap on an option in the given option panel
function checkAndTapOption(t, container, selector, contentExpected, callback) {
	var oLabel,
		oMask;

	if(contentExpected) {
		oLabel = container.element.down(selector);
		t.contentLike(oLabel, contentExpected, 'found option "'+contentExpected+'"');		
	}
	
	oMask = container.element.down(selector + ' .x-field-mask');

	if(typeof callback == 'function') {
		t.tap(oMask, callback);
	} else {
		t.tap(oMask);
	}
}

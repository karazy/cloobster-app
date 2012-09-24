Ext.define('EatSense.view.Cart', {
	extend : 'Ext.Panel',
	xtype : 'carttab',
	requires: ['EatSense.view.CartOverviewItem', 'EatSense.view.BackButton'],
	config : {
		iconCls : 'cart',
		// title: i10n.translate('cartTabBt'),
		// iconMask : true,
		itemId : 'carttab',
		layout: 'fit',
		// cls: 'cart-panel',
		items : [
		          {
			docked : 'top',
			xtype : 'titlebar',
			itemId: 'cartTopBar',
			title : i10n.translate('cartviewTitle'),
			items : [ 
			{
				// xtype : 'button',
				// itemId : 'backButton',
				action: 'back',
				text : i10n.translate('back'),
				ui : 'back',
				align: 'left'
			},
			]
		},
		{
			xtype: 'panel',
			docked: 'top',
			layout: {
				type: 'hbox',
				align: 'center',
				pack: 'center'
			},
			items: [
			{
				xtype: 'button',
				action: 'trash',
			    iconCls: 'trash',
			    iconMask: true,
			    align: 'left',
			    ui: 'action',
			    // flex: 1
			},
			{
				xtype: 'button',
				action: 'order',
			    text: i10n.translate('submitButton'),
			    ui: 'action',
			    align: 'right',
			    // flex: 2
			}
			]
			
		},
		{
				xtype: 'dataview',
				itemId: 'orderlist',
				useComponents: true,
				cls: 'cartoverview',
				defaultType: 'cartoverviewitem',
				grouped: true			
		}, 
		{
			type: 'panel',
			docked: 'bottom',
			itemId: 'carttotalpanel',
			items: [{
				xtype: 'label',		
				cls: 'cartTotal',		
				tpl: new Ext.XTemplate('<h1>Total {[this.formatPrice(values.price)]}</h1>',
					{
						formatPrice: function(price) {
							return appHelper.formatPrice(price);
						}
					}
				)
			}
			]			
		} 
		]
	},
	/**
	 * Show a loading screen
	 * @param mask
	 */
    showLoadScreen : function(mask) {
    	if(mask) {
    		this.setMasked({
    			message : i10n.translate('submitOrderProcess'),
        		xtype: 'loadmask' 
    		});
    	} else {
    		this.setMasked(false);
    	}
    }

});
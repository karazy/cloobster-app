Ext.define('EatSense.view.Cart', {
	extend : 'Ext.Panel',
	xtype : 'carttab',
	requires: ['EatSense.view.CartOverviewItem', 'EatSense.view.BackButton'],
	config : {
		iconCls : 'cart',
		itemId : 'carttab',
		layout: 'fit',
		items : [
		          {
			docked : 'top',
			xtype : 'titlebar',
			itemId: 'cartTopBar',
			title : i10n.translate('cartviewTitle'),
			items : [ 
			{
				xtype: 'backbutton'
			}
			]
		},
		{
			xtype: 'panel',
			docked: 'top',
			layout: {
				type: 'hbox',
				align: 'stretch',
				pack: 'center'
			},
			margin: '5',
			items: [
			{
				xtype: 'button',
				action: 'trash',
			    iconCls: 'trash',
			    iconMask: true,
			    text: i10n.translate('cart.button.deleteall'),
			    ui: 'action',
			    margin: '0 5 0 5',
			    flex: 1
			},
			{
				xtype: 'button',
				action: 'order',
				iconCls: 'action',
				iconAlign: 'right',
			    iconMask: true,
			    text: i10n.translate('submitButton'),
			    ui: 'action',
			    margin: '0 5 0 5',
			    flex: 1
			}
			]
			
		},
		{
				xtype: 'dataview',
				itemId: 'orderlist',
				useComponents: true,
				cls: 'cartoverview',
				defaultType: 'cartoverviewitem'
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
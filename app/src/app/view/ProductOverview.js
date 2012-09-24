/**
 * Displays products belonging to a menu.
 */
Ext.define('EatSense.view.ProductOverview', {
	extend : 'Ext.Container',
	xtype : 'productoverview',
	config : {
		items : [ 
		{
			docked : 'top',
			xtype : 'titlebar',
			itemId: 'menuTopBar',
			title : i10n.translate('menuTitle'),
			items : [ {
				xtype : 'button',
				itemId : 'menuBackBt',
				action: 'back',
				text : i10n.translate('back'),
				ui : 'back',
				align: 'left'
			},{
				xtype: 'button',
				itemId: 'cartBt',
				action: 'show-cart',
				align: 'right',
				iconCls : 'cart-button',
				iconMask : true
			}
			]
		},
		{
			xtype : 'list',
			itemId : 'productlist',
			ui: 'round',
			allowDeselect : true,
			itemCls: 'productListItem',
			itemTpl : new Ext.XTemplate(
					"<table style='width:100%;'>"+
						"<td align='left'><h2 class='title'>{name}</h2></td><td align='right'><h2 class='price'>{[this.formatPrice(values.price)]}</h2></td>" +
					"</table>"+
					"<p>{shortDesc}</p>",
					{
						formatPrice: function(price) {
							return appHelper.formatPrice(price);
						}
					}
				),					
			listeners : {
				select : function(dv, index, target, record, e, eOpts) {					
					Ext.defer((function() {
						dv.deselectAll();
					}), 1000, this);					
				}
			}
		} ]
	}
});
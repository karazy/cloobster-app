/**
 * Displays products belonging to a menu.
 */
Ext.define('EatSense.view.ProductOverview', {
	extend : 'Ext.Container',
	requires: ['EatSense.view.CartButton', 'EatSense.view.components.SlidenavButton'],
	xtype : 'productoverview',
	config : {
		items : [ 
		{
			docked : 'top',
			xtype : 'titlebar',
			itemId: 'menuTopBar',
			title : i10n.translate('menuTitle'),
			items : [ 
			// {
			// 	xtype: 'slidenavbutton'
			// },
			{
				xtype : 'backbutton'
			},
			{
				xtype: 'cartbutton'
			}
			]
		},
		{
			xtype: 'label',
			itemId: 'titleLabel',
			docked: 'top',
			margin: '0 0 15 0',
			tpl: new Ext.XTemplate('<div class="productlist-header">{title}</div>')
		},
		{
			xtype : 'list',
			itemId : 'productlist',
			allowDeselect : true,
			cls: 'productlist',
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
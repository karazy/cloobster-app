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
			store: 'productStore',
			allowDeselect : true,
			cls: 'productlist',
			itemCls: 'product-list-item',
			itemTpl : new Ext.XTemplate(
					"<table style='width:100%;'>",
						"<tr>",
							"<td align='left'>",
								'<tpl if="imageUrl">',
									'<div class="thumbnail scale-width" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',
								'</tpl>',
								'<div>',
									"<tpl if='special'><div class='special'></div></tpl>",
									"<h2 class='title'>{name}</h2>",
									"<p class='shortdesc'>{shortDesc}</p>",
								'</div>',
							"</td>",
							"<td align='right'>",
								"<h2 class='price'>{[this.formatPrice(values.price)]}</h2>",							
							"</td>" ,
						"</tr>",
					"</table>",				
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
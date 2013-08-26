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
					'<tpl if="imageUrl">',
						'<div class="thumbnail scale-width" style="background-image: url(\'{[values.imageUrl]}=s256\')"></div>',
					'</tpl>',
					"<div class='price'>{[this.formatPrice(values.price)]}</div>",
					'<div class="content">',
						"<tpl if='special'><div class='special'></div></tpl>",
						"<h3 class='title'>{name}</h3>",
						"<p class='shortdesc'>{shortDesc}</p>",
					'</div>',			
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
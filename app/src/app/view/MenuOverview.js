/**
 * Displays the businesses menu(s).
 * E. g.
 * Burgers, Drinks, Steaks, Salads
 * 
 */
Ext.define('EatSense.view.MenuOverview', {
	extend : 'Ext.Container',
	requires: ['EatSense.view.CartButton', 'EatSense.view.components.SlidenavButton', 'EatSense.view.components.HomeButton'],
	xtype : 'menuoverview',
	config : {
		items : [ 
			{
				docked : 'top',
				xtype : 'titlebar',
				itemId: 'menuTopBar',
				title : i10n.translate('menuTitle'),
				items : [ 
				{
					xtype: 'homebutton'
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
				tpl: new Ext.XTemplate('<div class="productlist-header">{0}</div>')
			},
		   {
			xtype : 'list',
			// onItemDisclosure: true,
			allowDeselect: true,
			itemCls: 'menulist-item',
			itemTpl : new Ext.XTemplate(
				'<h3>{title}</h3><tpl if="description"><p>{description}</p></tpl>'
			),
			store: 'menuStore',
			listeners: {
				select : function(dv, index, target, record, e, eOpts) {					
					Ext.defer((function() {
						dv.deselectAll();
					}), 1000, this);					
				}
			}
			
		}]
	}
});

/**
 * Displays the businesses menu(s).
 * E. g.
 * Burgers, Drinks, Steaks, Salads
 * 
 */
Ext.define('EatSense.view.MenuOverview', {
	extend : 'Ext.Container',
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
					xtype: 'button',
					action: 'show-cart',
					align: 'right',
					iconCls : 'cart-button',
					iconMask : true,
					hidden: true
				}
				]
			},
		   {
			xtype : 'list',
			ui: 'round',
			onItemDisclosure: true,
			allowDeselect: true,
			itemTpl : '{title}',
			store: 'menuStore',
			listeners: {
				select : function(dv, index, target, record, e, eOpts) {	
				console.log('MenuOverview');				
					Ext.defer((function() {
						dv.deselectAll();
					}), 1000, this);					
				}
			}
			
		} ]
	}
});

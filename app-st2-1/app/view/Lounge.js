Ext.define('EatSense.view.Lounge', {
	extend : 'Ext.tab.Panel',
	requires : [ 
		'EatSense.view.MyOrders', 
		'EatSense.view.Menu', 
		'EatSense.view.MenuOverview', 
		'EatSense.view.SettingsTab', 
		'EatSense.view.RequestsTab',
		'EatSense.view.ClubArea'
	],
	xtype : 'lounge',
	config : {
		layout: {
           type: 'card',
           //override default tabpanel animation setting
           animation: null
        },
		tabBarPosition: 'bottom',
		tabBar : {
			itemId : 'loungeTabBar',
			cls: 'lounge-tabbar'
			//true to hide tabbar for screenhots to keep our features secret
			// hidden: true
		},
		activeItem : 0,
		items : [
			{
				xtype: 'clubarea',
				tabName: 'home'
			},
			{
				xtype: 'menutab',
				tabName: 'menu'	
			},
			{
				xtype: 'myorderstab',
				tabName: 'myorders'
			},
			{
				xtype: 'settingstab',
				tabName: 'settings'
			}
		],
	},
	/**
	 * Switch the tab.
	 * 
	 */
	switchTab : function(view) {
		this.setActiveItem(view);
	}
});
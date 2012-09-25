Ext.define('EatSense.view.Lounge', {
	extend : 'Ext.tab.Panel',
	requires : [ 
		'EatSense.view.MyOrders', 
		'EatSense.view.Menu', 
		'EatSense.view.MenuOverview', 
		'EatSense.view.SettingsTab', 
		'EatSense.view.RequestsTab',
		'EatSense.view.ClubDashboard'
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
				xtype: 'clubdashboard',
				tabName: 'home'
			},
			{
				xtype: 'menutab',
				tabName: 'menu'	
			},
			// {
			// 	xtype: 'carttab',
			// 	tabName: 'cart'
			// },
			{
				xtype: 'myorderstab',
				tabName: 'myorders'
			},
			{
				xtype: 'requeststab',
				tabName: 'requests'
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
	 * @param direction
	 *            left or right
	 */
	switchTab : function(view, direction) {
		this.setActiveItem(view);
	}
});
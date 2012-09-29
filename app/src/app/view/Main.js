/**
 * The viewport. Defining the global layout for the application.
 */
Ext.define('EatSense.view.Main', {
	extend : 'Ext.Container',
	requires : [ 'EatSense.view.Dashboard', 'EatSense.view.MenuOverview', 'EatSense.view.Checkinconfirmation', 'EatSense.view.ProductOverview',
			'EatSense.view.CheckinWithOthers', 'EatSense.view.Cart', 'EatSense.view.Menu', 'EatSense.view.Lounge', 'EatSense.view.SettingsView'],
	xtype : 'mainview',
	config : {
		fullscreen: true,
		layout : {
			type : 'card',
			animation : {
				type : 'slide',
				direction : 'left'
			}
		},
		activeItem : 0,
		items : [ 
		{
			xtype : 'dashboard'
		}, 
		{
			xtype : 'checkinconfirmation'
		}, 
		{
			xtype: 'history'
		},
		{
			xtype: 'historydetail'
		},
		// {
		// 	layout : 'fit',
		// 	xtype : 'checkinwithothers'
		// }, 
		{
			xtype : 'lounge'
		},
		{
			xtype: 'settingsview'
		}
		]
	},
	/**
	 * Change the direction of the slide animation.
	 * 
	 * @param direction
	 *            left or right
	 */
	switchAnim : function(direction) {
		this.getLayout().setAnimation({
			type : 'slide',
			direction : direction
		});
	}
});

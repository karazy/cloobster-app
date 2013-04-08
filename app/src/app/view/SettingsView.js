/**
* Panel showing settings aka profile.
*
*/
Ext.define('EatSense.view.SettingsView', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.Settings'],
	xtype: 'settingsview',
	config: {
		layout: {
			type: 'card',
			//override default tabpanel animation setting
			animation : null
			// {
			// 	type : 'slide',
			// 	direction : 'left'
			// }
		},
		activeItem: 0,
		items: [
		{
			xtype: 'settings',
			backButton: true							
		},
		{
			xtype: 'emailsetting'
		},
		{
			xtype: 'passwordsetting'
		}
		]

	}
});
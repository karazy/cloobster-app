	/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.SettingsTab', {
	extend : 'Ext.Panel',
	xtype : 'settingstab',
	requires: ['EatSense.view.Settings', 'Ext.navigation.View', 'EatSense.view.EmailSetting', 'EatSense.view.PasswordSetting'],
	config : {
		layout: {
			type: 'card',
			//override default tabpanel animation setting
			animation : null
			// {
			// 	type : 'slide',
			// 	direction : 'left'
			// }
		},
		iconCls : 'user',
		title: i10n.translate('settingsButton'),
		iconMask : true,
		activeItem: 0,
		items : [
			{
				xtype: 'settings',
				logoutButton: false
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
/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.SettingsTab', {
	extend : 'Ext.Panel',
	xtype : 'settingstab',
	requires: ['EatSense.view.Settings', 'Ext.navigation.View', 'EatSense.view.EmailSetting', 'EatSense.view.PasswordSetting'],
	config : {
		layout: {
			type: 'fit'
		},
		iconCls : 'user',
		title: i10n.translate('settingsButton'),
		iconMask : true,
		items : [
		// {
		// 	xtype: 'navigationview',
		// 	defaultBackButtonText: i10n.translate('back'),
		// 	items: [
		// 	{
		// 		title : i10n.translate('settingsTitle'),
		// 		xtype: 'settings'
		// 	}
		// 	]
		// }
		{
			xtype: 'panel',
			layout: {
				type: 'card',
				animation : {
					type : 'slide',
					direction : 'left'
				}
			},
			itemId: 'settingCards',
			activeItem: 0,
			items:[
				{
					xtype: 'settings'
				},
				{
					xtype: 'emailsetting'
				},
				{
					xtype: 'passwordsetting'
				}
			]
		}

		]
	}
});
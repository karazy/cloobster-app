/**
* Panel showing settings aka profile.
*
*/
Ext.define('EatSense.view.SettingsView', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.Settings'],
	xtype: 'settingsview',
	config: {
		layout: 'fit',
		items: [
		{
			xtype: 'panel',
			layout: 'card',
			itemId: 'settingCards',
			activeItem: 0,
			items:[
				{
					xtype: 'panel',
					layout: 'fit',
					items: [
						{
							xtype: 'titlebar',
							title: i10n.translate('settingsButton'),
							docked: 'top',
							items: [
								{
									xtype: 'backbutton'
								}
							]
						},
						{
							xtype: 'settings'
						}
					]
				},
				{
					xtype: 'emailsetting'
				},
				{
					xtype: 'passwordsetting'
				}
			]
		},
		{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
			]
		}
		]

	}
});
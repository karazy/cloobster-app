/**
*	Settings section. Show when navigating from dashboard.
*/
Ext.define('EatSense.view.Settings', {
	extend : 'Ext.Panel',
	xtype : 'settings',
	config : {
		layout: {
			type: 'vbox',
		},
		items : [ {
			xtype : 'titlebar',
			docked : 'top',
			title : i10n.translate('settingsTitle'),
			items : [ {
				text: i10n.translate('back'),
				action: 'back',
				ui: 'back',
				align: 'left'
			} ]
		}, 
		{
			xtype: 'panel',
			layout: 'vbox',
			items: [
				{
					xtype: 'label',
					html: i10n.translate('nicknameDesc'),
					width: '80%'
				},
				{
					xtype : 'textfield',
					label : i10n.translate('nickname'),
					itemId : 'nicknameSetting',
					width: '80%'
				}
			]
		},
		// {
		// 	xtype: 'newsletter',
		// 	height: 200
		// }
		]
	}
});
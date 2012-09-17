/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.SettingsTab', {
	extend : 'Ext.Panel',
	xtype : 'settingstab',
	requires: ['Ext.navigation.View', 'EatSense.view.EmailSetting', 'EatSense.view.PasswordSetting'],
	config : {
		layout: {
			type: 'fit'
		},		
		iconCls : 'settings',
		cls: 'setting-panel',
		title: i10n.translate('settingsButton'),
		iconMask : true,
		items : [
		{
			xtype: 'navigationview',
			defaultBackButtonText: i10n.translate('back'),
			items: [
			{
				title : i10n.translate('settingsTitle'),
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'middle'
				},
				scrollable: 'vertical',
				items: [
					{
					xtype: 'formpanel',
					//prevents also that the panel has a wrong size. Bug?
					scrollable: false,			
					margin: '10 0 0 0',
					width: '80%',
					items: [
						{
							xtype: 'label',
							cls: 'general-label',
							margin: '7 0 5 0',
							html: i10n.translate('nicknameDesc')
						},
						{
							xtype : 'textfield',
							label : i10n.translate('nickname'),
							labelWidth: '40%',
							itemId : 'nickname',
							maxLength: 25,
							cls: 'general-textfield',
							labelCls: 'general-field-label-horizontal'
						}
						]
					},
					{
						xtype: 'panel',
						layout: {
							type: 'vbox',
							pack: 'center',
							align: 'middle'
						},
						width: '100%',
						itemId: 'accountPanel',
						items: [
							{
								xtype: 'label',
								cls: 'general-label',
								html: '<h1>' + i10n.translate('settings.section.account') + '</h1>'						
							},
							{
								xtype: 'label',
								itemId: 'accountEmail',
								cls: 'general-label',
								tpl: i10n.translate('settings.account.email')						
							},
							{
								xtype: 'button',
								ui: 'action',
								margin: '7 0 5 0',
								action: 'email-change',
								width: '80%',
								text: i10n.translate('settings.account.button.email')
							},
							{
								xtype: 'button',
								ui: 'action',
								action: 'password-change',
								margin: '7 0 5 0',
								width: '80%',
								text: i10n.translate('settings.account.button.password')
							}
						]
					},
					{
						xtype: 'label',
						cls: 'general-label',
						html: '<h1>' + i10n.translate('settings.section.infos') + '</h1>'						
					},
					{
						xtype: 'button',
						text: 'Impressum',
						ui: 'action',
						action: 'about',
						margin: '7 0 5 0',
						width: '80%'
					},
					{
						xtype: 'label',
						html: 'Cloobster App Version: ' + appConfig.version,
						style: 'text-align: right; font-size: 0.6em; color: black;',
						margin: '10 0 0 0',
						width: '80%'
					}
				]
			}
			]
		}

		 // {
			// xtype : 'titlebar',
			// docked : 'top',
			// title : i10n.translate('settingsTitle'),
		// }, 

		// {
		// 	xtype: 'formpanel',
		// 	//prevents also that the panel has a wrong size. Bug?
		// 	scrollable: false,			
		// 	margin: '10 0 0 0',
		// 	width: '80%',
		// 	items: [
		// {
		// 	xtype: 'label',
		// 	cls: 'general-label',
		// 	html: i10n.translate('settings.account.label.email')
		// },
		// {
		// 	xtype: 'emailfield',
		// 	labelWidth: '40%',
		// 	cls: 'general-textfield',
		// 	labelCls: 'general-field-label-horizontal',
		// 	label: i10n.translate('settings.account.field.email')
		// },
		// {
		// 	xtype: 'button',
		// 	ui: 'action',
		// 	margin: '7 0 5 0',
		// 	action: 'email-change',
		// 	text: i10n.translate('settings.account.button.email')
		// },
		// {
		// 	xtype: 'label',
		// 	cls: 'general-label',
		// 	html: i10n.translate('settings.account.label.password')
		// },
		// {
		// 	xtype: 'passwordfield',
		// 	labelWidth: '40%',
		// 	cls: 'general-textfield',
		// 	labelCls: 'general-field-label-horizontal',
		// 	label: i10n.translate('settings.account.field.password')
		// },
		// {
		// 	xtype: 'button',
		// 	ui: 'action',
		// 	action: 'password-change',
		// 	margin: '7 0 5 0',
		// 	text: i10n.translate('settings.account.button.password')
		// },
		// 	]
		// },
		// {
		// 	xtype: 'newsletter',			
		// 	width: '80%'
		// },
		// {
		// 	xtype: 'button',
		// 	text: Karazy.i10n.translate('settings.button.logout'),
		// 	ui: 'action',
		// 	action: 'logout',
		// 	margin: '7 0 5 0',
		// 	disabled: true,
		// 	width: '80%'
		// },

		]
	}
});
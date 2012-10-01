/**
*	Settings. Used in SettingsView and SettingsTab.
*/
Ext.define('EatSense.view.Settings', {
	extend : 'Ext.Panel',
	xtype : 'settings',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'middle'
		},
		scrollable: 'vertical',
		//if true, adds a backbutton to titlebar
		backButton: false,
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('settingsButton'),
				docked: 'top',
				items: [
					// {
					// 	xtype: 'backbutton',
					// 	itemId: 'backButton'
					// }
				]
			},
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
						style: 'margin-top: 1em; font-weight: bold;',
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
					},
					{
						xtype: 'button',
						ui: 'action',
						action: 'logout',
						margin: '7 0 5 0',
						width: '80%',
						text: i10n.translate('settings.button.logout')
					}
				]
			},
			{
				xtype: 'button',
				text: 'Impressum',
				ui: 'action',
				action: 'about',
				style: 'margin-top: 1em;',
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
	},
	// constructor: function(config) {
	// 	console.log('INITIALIZE SETTINGS');
	// },
	initialize: function() {
		console.log('INITIALIZE SETTINGS');
		// if(this.getBackButton()) {
		// 	console.log('Back button true');
		// }
	}
});
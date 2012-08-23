/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.SettingsTab', {
	extend : 'Ext.Panel',
	xtype : 'settingstab',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'middle'
		},
		scrollable: 'vertical',				
		iconCls : 'settings',
		cls: 'setting-panel',
		title: Karazy.i18n.translate('settingsButton'),
		iconMask : true,		
		items : [ {
			xtype : 'titlebar',
			docked : 'top',
			title : Karazy.i18n.translate('settingsTitle'),
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
					html: Karazy.i18n.translate('nicknameDesc')
				},
				{
					xtype : 'textfield',
					label : Karazy.i18n.translate('nickname'),
					labelWidth: '40%',
					itemId : 'nickname',
					maxLength: 25,
					cls: 'general-textfield',
					labelCls: 'general-field-label-horizontal'
				}
			]
		},
		{	
			xtype: 'newsletter',			
			width: '80%'
		},
		{
			xtype: 'button',
			text: Karazy.i10n.translate('settings.button.logout',
			ui: 'action',
			action: 'logout',
			margin: '7 0 5 0',
			disabled: true,
			width: '80%'
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
			html: 'Cloobster App Version: ' + Karazy.config.version,
			style: 'text-align: right; font-size: 0.6em; color: black;',
			margin: '10 0 0 0',
			width: '80%'
		}
		]
	}
});
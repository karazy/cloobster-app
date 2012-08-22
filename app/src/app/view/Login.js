Ext.define('EatSense.view.Login', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.Button'],
	xtype: 'login',
	config: {
		layout: {
			type: 'vbox',
			// align : 'center',
			pack: 'center'
		},
		cls: 'dashboard',		
		items: [
			{
				docked : 'top',
				xtype : 'toolbar',
				title : Karazy.i18n.translate('login.title'),
				items : [ {
					xtype : 'button',
					action: 'back',
					text : Karazy.i18n.translate('back'),
					ui : 'back'
				}, ]
			},
			{
				xtype: 'formpanel',
				// layout: 'vbox',
				//prevents also that the panel has a wrong size. Bug?
				scrollable: false,
				// defaults: {
				// 	width: '85%',
				// 	margin: '5 0'
				// },
				items: [
				{
					xtype: 'fieldset',
					items: [
						{	
							xtype: 'emailfield',
							name: 'email',
							required: true,
							placeHolder: Karazy.i18n.translate('login.field.email.placeholder')
						},
						{	
							xtype: 'passwordfield',
							name: 'password',
							required: true,
							placeHolder: Karazy.i18n.translate('login.field.password.placeholder')
						}
					]
				}
				]
			},
			{
				xtype: 'button',
				text: Karazy.i18n.translate('login.button.login'),
				action: 'login'
			},
			// {
			// 	xtype: 'button',
			// 	text: Karazy.i18n.translate('login.button.login'),
			// 	action: 'login-fb'
			// },
			{
				xtype: 'label',
				html: Karazy.i18n.translate('login.label.notamember')
			},
			{
				xtype: 'button',
				text: Karazy.i18n.translate('login.button.signup'),
				action: 'signup'
			}
		]
	}
});
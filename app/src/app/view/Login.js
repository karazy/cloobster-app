Ext.define('EatSense.view.Login', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.Button', 'Ext.form.FieldSet'],
	xtype: 'login',
	config: {
		layout: {
			type: 'vbox',
			// align : 'center',
			pack: 'center'
		},
		showAnimation: 'slideIn',
		hideAnimation:  {
			type: 'slide',
			direction: 'right'
		},
		padding: '0 10 0 10',
		//BUG: has to be set otherwise an error gets trown
		//http://www.sencha.com/forum/showthread.php?192847-Animating-panels-throws-Cannot-call-method-getPageBox-of-null/page2
		hidden: true,
		cls: 'dashboard',		
		items: [
			{
				docked : 'top',
				xtype : 'toolbar',
				title : i10n.translate('login.title'),
				items : [ {
					xtype : 'button',
					action: 'back',
					text : i10n.translate('back'),
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
							placeHolder: i10n.translate('login.field.email.placeholder')
						},
						{	
							xtype: 'passwordfield',
							name: 'password',
							required: true,
							placeHolder: i10n.translate('login.field.password.placeholder')
						}
					]
				}
				]
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.login'),
				action: 'login',
				margin: '5 0 7 0'
			},
			// {
			// 	xtype: 'button',
			// 	text: i10n.translate('login.button.login'),
			// 	action: 'login-fb'
			// },
			{
				xtype: 'label',
				html: i10n.translate('login.label.notamember')
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.signup'),
				action: 'signup'
			}
		]
	}
});
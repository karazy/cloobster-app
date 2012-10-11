/**
* Shows a login/signup panel.
* Has dedicated hide/show animations to use this view in various places.
*/
Ext.define('EatSense.view.Login', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.Text', 'Ext.field.Password', 'Ext.Button', 'Ext.form.FieldSet'],
	xtype: 'login',
	config: {
		layout: {
			type: 'vbox',
			align : 'center',
			pack: 'center'
		},
		showAnimation: 'slideIn',
		hideAnimation:  {
			type: 'slideOut',
			direction: 'right'
		},
		padding: '0 10 0 10',
		//BUG: has to be set otherwise an error gets trown
		//http://www.sencha.com/forum/showthread.php?192847-Animating-panels-throws-Cannot-call-method-getPageBox-of-null/page2
		hidden: true,
		//make login panel stay on top!
		style: 'z-index: 2;',
		items: [
			{
				docked : 'top',
				xtype : 'toolbar',
				title : i10n.translate('login.title'),
				items : [ {
					xtype : 'backbutton'
				}]
			},
			{
				xtype: 'formpanel',
				// layout: 'vbox',
				//prevents also that the panel has a wrong size. Bug?
				scrollable: false,
				width: '90%',
				// defaults: {
					// width: '80%',
				// 	margin: '5 0'
				// },
				items: [
				// {
				// 	xtype: 'fieldset',
				// 	items: [
						{	
							xtype: 'emailfield',
							name: 'email',
							required: true,
							label: i10n.translate('login.field.email.placeholder'),
							labelAlign: 'top',
							cls: 'general-textfield',
							labelCls: 'general-field-label-vertical'
						},
						{	
							xtype: 'passwordfield',
							name: 'password',
							required: true,
							label: i10n.translate('login.field.password.placeholder'),
							labelAlign: 'top',
							cls: 'general-textfield',
							labelCls: 'general-field-label-vertical'
						}
				// 	]
				// }
				]
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.login'),
				action: 'login',
				ui: 'action',
				margin: '7 0 10 0',
				width: '90%'
			},
			// {
			// 	xtype: 'button',
			// 	text: i10n.translate('login.button.login'),
			// 	action: 'login-fb'
			// },
			{
				xtype: 'label',
				html: i10n.translate('login.label.notamember'),
				width: '90%'
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.signup'),
				ui: 'action',
				action: 'signup',
				width: '90%'
			},
			{
				xtype: 'label',
				html: '- '+i10n.translate('or')+' -'
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.signupfb'),
				ui: 'action',
				action: 'signup-fb',
				width: '90%',
				iconCls: 'fb-signup',
				iconMask: true
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
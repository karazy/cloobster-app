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
		scrollable: 'vertical',
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
				xtype: 'label',
				html: i10n.translate('login.description'),
				width: '90%',
				// margin: '0 0 15 0',
				styleHtmlContent: true
			},
			{
				xtype: 'formpanel',
				// layout: 'vbox',
				//prevents also that the panel has a wrong size. Bug?
				scrollable: false,
				width: '90%',
				margin: '0 0 10 0',
				items: [

					{	
						xtype: 'emailfield',
						name: 'email',
						required: true,
						placeHolder: i10n.translate('login.field.email.placeholder'),
						labelAlign: 'top',
						cls: 'general-textfield',
						labelCls: 'general-field-label-vertical'
					},
					{	
						xtype: 'passwordfield',
						name: 'password',
						required: true,
						placeHolder: i10n.translate('login.field.password.placeholder'),
						labelAlign: 'top',
						cls: 'general-textfield',
						labelCls: 'general-field-label-vertical'
					}

				]
			},
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					pack: 'center',
					align: 'stretch'
				},
				width: '90%',
				items: [
					{
						xtype: 'button',
						text: i10n.translate('login.button.login'),
						action: 'login',
						ui: 'action',
						margin: '0 5 0 0',
						// width: '45%'
						flex: 1
					},
					// {
					// 	xtype: 'label',
					// 	html: i10n.translate('login.label.notamember'),
					// 	width: '90%'
					// },
					{
						xtype: 'button',
						text: i10n.translate('login.button.signup'),
						ui: 'action',
						action: 'signup',
						margin: '0 0 0 5',
						// width: '45%'
						flex: 1
					}
				]
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
				width: '50%',
				margin: '0 0 10 0',
				iconCls: 'fb-signup',
				iconMask: true
			},
			{
				xtype: 'label',
				html: i10n.translate('login.label.pwforgot'),
				width: '50%'
			},
			{
				xtype: 'button',
				text: i10n.translate('login.button.pwforgot'),
				ui: 'action',
				action: 'request-password',
				width: '50%'
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
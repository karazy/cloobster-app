Ext.define('EatSense.view.PasswordSetting', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Email', 'Ext.field.Password'],
	xtype: 'passwordsetting',
	config: {
		title: i10n.translate('passwordsetting.title'),
		layout: {
			type: 'vbox',
			align: 'center'
		},
		items: [
			{
			xtype: 'formpanel',
			//Prevents also that the panel has a wrong size. Bug?
			scrollable: false,
			width: '90%',
			margin: '10 0 0 0',
			items: [
				{	//old password field
					xtype: 'passwordfield',
					itemId: 'oldPassword',
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('passwordsetting.oldpassword.field'),
					labelAlign: 'top'
				},
				{
					//new email field
					xtype: 'passwordfield',
					itemId: 'newPassword',
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('passwordsetting.newpassword.field'),
					labelAlign: 'top'
				},
				{	
					//repeat email field
					xtype: 'passwordfield',
					itemId: 'repeatPassword',
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('passwordsetting.repeatpassword.field'),
					labelAlign: 'top'
				},

				{
					xtype: 'button',
					ui: 'action',
					action: 'save',
					text: i10n.translate('save')
				}
			]
			},
		]
	}
});
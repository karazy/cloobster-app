Ext.define('EatSense.view.EmailSetting', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Email', 'Ext.field.Password'],
	xtype: 'emailsetting',
	config: {
		title: i10n.translate('emailsetting.title'),
		layout: {
			type: 'vbox',
			align: 'center'
		},
		items: [
			{
				xtype: 'label',
				html: i10n.translate('emailsetting.description')
			},
			{
			xtype: 'formpanel',
			//Prevents also that the panel has a wrong size. Bug?
			scrollable: false,
			width: '90%',
			margin: '10 0 0 0',
			items: [
				{
					//new email field
					xtype: 'emailfield',
					itemId: 'newMail',
					// label: i10n.translate('emailsetting.email.field.placeholder'),
					// labelAlign: 'top',
					placeHolder: i10n.translate('emailsetting.email.field.placeholder')
				},
				{	
					//repeat email field
					xtype: 'textfield',
					itemId: 'repeatMail',
					placeHolder: i10n.translate('emailsetting.repeat.field.placeholder')
				},
				{
					xtype: 'passwordfield',
					itemId: 'password',
					placeHolder: i10n.translate('emailsetting.password.field')
				},
				{
					xtype: 'button',
					ui: 'action',
					action: 'save',
					text: i10n.translate('emailsetting.button.save')
				}
			]
			},
		]
	}
});
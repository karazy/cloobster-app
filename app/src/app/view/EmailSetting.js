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
				docked : 'top',
				xtype : 'titlebar',				
				title : i10n.translate('emailsetting.title'),
				items : [
					{
						xtype : 'backbutton',
					}, 
				]
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
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('emailsetting.email.field'),
					labelAlign: 'top'
				},
				{	
					//repeat email field
					xtype: 'emailfield',
					itemId: 'repeatMail',
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('emailsetting.repeat.field'),
					labelAlign: 'top'
				},
				{
					xtype: 'passwordfield',
					itemId: 'password',
					cls: 'general-textfield',
					labelCls: 'general-field-label-vertical',
					label: i10n.translate('emailsetting.password.field'),
					labelAlign: 'top'
				},
				{
					xtype: 'button',
					ui: 'action',
					action: 'save',
					margin: '5 0 7 0',
					text: i10n.translate('save')
				}
			]
			},
		]
	}
});
Ext.define('EatSense.view.EmailSetting', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Email', 'Ext.field.Password'],
	xtype: 'emailsetting',
	config: {
		title: i10n.translate('emailsetting.title'),
		layout: {
			type: 'fit'
		},		
		items: [
			{
				docked : 'top',
				xtype : 'titlebar',				
				title : i10n.translate('emailsetting.title'),
				items : [
					{
						xtype : 'backbutton'
					}
				]
			},
			{
			xtype: 'formpanel',
			layout: {
				type: 'vbox',
				align: 'stretch',
				pack: 'center'
			},
			padding: '0 30 8 30',
			items: [
				{
					xtype: 'label',
					html: '<p class="small">'+i10n.translate('emailsetting.description')+'</p>',
					cls: 'general-label'
				},
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
					xtype: 'fixedbutton',
					ui: 'action',
					action: 'save',
					margin: '5 0 7 0',
					text: i10n.translate('save')
				}
			]
			}
		]
	}
});
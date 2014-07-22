Ext.define('EatSense.view.PasswordSetting', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button', 'Ext.field.Text', 'Ext.field.Email', 'Ext.field.Password'],
	xtype: 'passwordsetting',
	config: {
		title: i10n.translate('passwordsetting.title'),
		layout: {
			type: 'fit'
		},		
		items: [
			{
				docked : 'top',
				xtype : 'titlebar',				
				title : i10n.translate('passwordsetting.title'),
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
					html: '<p class="small">'+i10n.translate('passwordsetting.description')+'</p>',
					cls: 'general-label'
				},
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
					xtype: 'fixedbutton',
					ui: 'action',
					action: 'save',
					text: i10n.translate('save')
				}
			]
			}
		]
	}
});
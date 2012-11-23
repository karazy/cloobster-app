Ext.define('EatSense.view.Newsletter', {
	extend: 'Ext.form.Panel',
	xtype: 'newsletter',
	requires: ['Ext.field.Email'],
	config: {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'middle'
		},
		//prevents also that the panel has a wrong size. Bug?
		scrollable: false,
		cls: 'newsletter',
		defaults: {
				width: '100%'
		},
		items: [
		{
			xtype: 'label',			
			cls: 'general-label',
			html: i10n.translate('newsletterLabel')
		},
		{
			xtype: 'emailfield',
			label: i10n.translate('newsletterEmail'),
			name:'email',
			labelWidth: '40%',
			cls: 'general-textfield',
			labelCls: 'general-field-label-horizontal'
		}, {
			xtype: 'button',
			action: 'register',
			ui: 'action',
			cls: 'newsletter-button',
			text: i10n.translate('newsletterRegisterBt'),
			cls: 'newsletter-register-button'
		}
		]
	}
});
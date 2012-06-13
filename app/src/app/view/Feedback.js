/**
* View for feedback form.
*/
Ext.define('EatSense.view.Feedback', {
	extend: 'Ext.Panel',
	xtype: 'feedback',
	requires: ['EatSense.view.FeedbackQuestion'],
	config: {
		title: Karazy.i18n.translate('feedback'),
		layout: {
			type: 'vbox'
		},
		scrollable: 'vertical',
		cls: 'request-panel',
		items: [
		{
			xtype: 'label',
			cls: 'general-label',
			text: Karazy.i18n.translate('feedbackQuestion'),
			docked: 'top'
		},
		{
			xtype: 'dataview',
			itemId: 'questions',
			useComponents: true,
			flex: 4,
			defaultType: 'feedbackquestion',
			scrollable: false,
		},
		{
			xtype: 'textareafield',
			itemId : 'comment',
			label: Karazy.i18n.translate('feedbackComment'),
			labelAlign: 'top',
			flex: 2,
			placeHolder: Karazy.i18n.translate('feedbackComment')
		},
		{
			xtype: 'emailfield',
			itemId: 'email',
			label: Karazy.i18n.translate('feedbackEmail'),
			labelAlign: 'top',
			flex: 1,
			placeHolder: Karazy.i18n.translate('feedbackEmail')
		},
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'center'
			},
			docked: 'bottom',
			padding: 5,
			items: [
			{
				xtype: 'button',
				ui: 'action',
				action: 'submit',
				text: Karazy.i18n.translate('feedback'),
				height: '50px',
				width: '80%'
			}
			]
		}
		]
	}
});
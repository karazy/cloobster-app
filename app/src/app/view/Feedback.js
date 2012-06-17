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
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		scrollable: 'vertical',
		cls: 'feedback-panel',
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
			defaultType: 'feedbackquestion',
			scrollable: false,
			width: '95%',
			margin: '10 0 10 0'
		},
		{
			xtype: 'textareafield',
			itemId : 'comment',
			cls: 'general-textfield',
			width: '95%',
			placeHolder: Karazy.i18n.translate('feedbackComment')
		},
		{
			xtype: 'emailfield',
			itemId: 'email',
			cls: 'general-textfield',
			width: '95%',
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
				ui: 'confirm',
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
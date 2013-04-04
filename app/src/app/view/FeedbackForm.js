/**
* View for feedback form.
*/
Ext.define('EatSense.view.FeedbackForm', {
	extend: 'EatSense.view.components.BackButtonPanel',
	xtype: 'feedbackform',
	requires: ['EatSense.view.FeedbackQuestion'],
	config: {
		items: [
		{
			xtype: 'titlebar',
			title: i10n.translate('feedback'),
			docked: 'top',
			items: [
				{
					xtype: 'homebutton'
				},
				{
					xtype: 'fixedbutton',
					ui: 'action',
					action: 'submit',
					align: 'right',
					text: i10n.translate('feedback.button.send')
				}
			]
		},
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'center'
			},
			scrollable: 'vertical',
			items: [
				{
					xtype: 'dataview',
					itemId: 'questions',
					useComponents: true,
					defaultType: 'feedbackquestion',
					scrollable: false,
					width: '95%',
					margin: '20 0 20 0'
				},
				{
					xtype: 'textareafield',
					itemId : 'comment',
					cls: 'general-textfield',
					width: '95%',
					placeHolder: i10n.translate('feedbackComment')
				},
				{
					xtype: 'emailfield',
					itemId: 'email',
					cls: 'general-textfield',
					width: '95%',
					placeHolder: i10n.translate('feedbackEmail')
				}
			]
		}

		]
	}
});
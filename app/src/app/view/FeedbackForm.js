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
				align: 'stretch',
				pack: 'center'
			},
			scrollable: 'vertical',
			padding: '20 30 8 30',
			items: [
				{
					xtype: 'dataview',
					itemId: 'questions',
					useComponents: true,
					defaultType: 'feedbackquestion',
					scrollable: false					
				},
				{
					xtype: 'textareafield',
					itemId : 'comment',
					cls: 'general-textfield',
					placeHolder: i10n.translate('feedbackComment'),
					margin: '20 0 0 0'
				},
				{
					xtype: 'emailfield',
					itemId: 'email',
					cls: 'general-textfield',
					placeHolder: i10n.translate('feedbackEmail'),
					margin: '5 0 0 0'
				}
			]
		}

		]
	}
});
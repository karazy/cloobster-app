/**
* View for feedback form.
*/
Ext.define('EatSense.view.FeedbackForm', {
	extend: 'Ext.Panel',
	xtype: 'feedbackform',
	requires: ['EatSense.view.FeedbackQuestion'],
	config: {
		//used innavigation view
		// title: i10n.translate('feedback'),
		layout: {
			type: 'vbox',
			align: 'center',
			pack: 'center'
		},
		scrollable: 'vertical',
		items: [
		{
			xtype: 'titlebar',
			title: i10n.translate('feedback'),
			docked: 'top',
			items: [
				{
					xtype: 'backbutton'
				}
			]
		},
		{
			xtype: 'label',
			cls: 'general-label',
			text: i10n.translate('feedbackQuestion'),
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
			placeHolder: i10n.translate('feedbackComment')
		},
		{
			xtype: 'emailfield',
			itemId: 'email',
			cls: 'general-textfield',
			width: '95%',
			placeHolder: i10n.translate('feedbackEmail')
		},
		{
			xtype: 'panel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'center'
			},
			docked: 'bottom',
			margin: '5 0 0 0',
			padding: '10 0 5 0',
			items: [
			{
				xtype: 'button',
				ui: 'action',
				action: 'submit',
				text: i10n.translate('feedback'),
				// height: '50px',
				width: '80%'
			}
			]
		}
		]
	}
});
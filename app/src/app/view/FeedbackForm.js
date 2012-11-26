/**
* View for feedback form.
*/
Ext.define('EatSense.view.FeedbackForm', {
	extend: 'Ext.Panel',
	xtype: 'feedbackform',
	requires: ['EatSense.view.FeedbackQuestion'],
	config: {
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
				},
				{
					xtype: 'button',
					ui: 'action',
					action: 'submit',
					align: 'right',
					text: i10n.translate('feedback.button.send')
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
		},
		// {
		// 	xtype: 'panel',
		// 	layout: {
		// 		type: 'vbox',
		// 		align: 'center',
		// 		pack: 'center'
		// 	},
		// 	docked: 'bottom',
		// 	height: 50,
		// 	// margin: '5 0 0 0',
		// 	// padding: '10 0 5 0',
		// 	items: [
		// 	{
		// 		xtype: 'button',
		// 		ui: 'action',
		// 		action: 'submit',
		// 		text: i10n.translate('feedback'),
		// 		// height: '50px',
		// 		width: '250px'
		// 	}
		// 	]
		// }
		]
	}
});
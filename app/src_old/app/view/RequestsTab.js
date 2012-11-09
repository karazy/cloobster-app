/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.RequestsTab', {
	extend : 'Ext.Panel',
	xtype : 'requeststab',
	// requires: ['Ext.navigation.View'],
	config : {
		// layout : 'fit',
		// iconCls : 'requests',
		// title: i10n.translate('requestsButton'),
		// iconMask : true,
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'middle'
		},
		cls: 'request-panel',
		items : [
			// {
			// 	xtype: 'navigationview',
			// 	defaultBackButtonText: i10n.translate('back'),			
			// 	items: [
			// 	{	
					{
						xtype: 'titlebar',
						title : i10n.translate('requestsTitle'),
						docked: 'top',
						items:[
						{
							xtype: 'backbutton'
						}
						]
					},										

					// items: [
						{
							xtype : 'panel',
							html: '<img src="res/images/club/vip.png" />',
							// cls: '',
							// docked: 'top',
							layout: 'fit'
						},	
						{
							xtype: 'label',
							itemId: 'accountLabel',
							cls: 'general-label',
							margin: 5,
							padding: '0 0 10 0'			
						},
						{
							xtype: 'label',
							cls: 'general-label',
							itemId: 'callWaiterLabel',
							html: i10n.translate('callWaiterCallHint'),
							padding: '0 5 0 5'
						},
						{
							xtype: 'button',
							text: i10n.translate('callWaiterButton'),
							action: 'waiter',
							ui: 'action',
							margin: '10 0 20 0',
							width: '80%'
						},
						// {
						// 	xtype: 'label',
						// 	itemId: 'feedbackLabel',
						// 	cls: 'general-label',
						// 	html: i10n.translate('feedbackLabel')
						// },
						// {
						// 	xtype: 'button',
						// 	text: i10n.translate('feedback'),
						// 	action: 'feedback',
						// 	ui: 'action',
						// 	margin: '10 0 0 0',
						// 	width: '80%'
						// }
					// ]
			// 	}
			// 	]	
			// }
			
		]
	}
});
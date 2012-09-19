/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.RequestsTab', {
	extend : 'Ext.Panel',
	xtype : 'requeststab',
	requires: ['Ext.navigation.View'],
	config : {
		layout : 'fit',
		iconCls : 'requests',
		title: i10n.translate('requestsButton'),
		iconMask : true,
		items : [
			{
				xtype: 'navigationview',
				defaultBackButtonText: i10n.translate('back'),			
				items: [
				{
					title : i10n.translate('requestsTitle'),
					layout : {
						type: 'vbox',
						pack: 'center',
						align: 'middle'
					},
					cls: 'request-panel',

					items: [
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
							html: i10n.translate('callWaiterCallHint')
						},
						{
							xtype: 'button',
							text: i10n.translate('callWaiterButton'),
							action: 'waiter',
							ui: 'action',
							margin: '10 0 20 0',
							width: '80%'
						},
						{
							xtype: 'label',
							itemId: 'feedbackLabel',
							cls: 'general-label',
							html: i10n.translate('feedbackLabel')
						},
						{
							xtype: 'button',
							text: i10n.translate('feedback'),
							action: 'feedback',
							ui: 'action',
							margin: '10 0 0 0',
							width: '80%'
						}
					]
				}
				]	
			}
			
		]
	}
});
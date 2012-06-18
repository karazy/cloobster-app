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
		cls: 'request-panel',
		title: Karazy.i18n.translate('requestsButton'),
		iconMask : true,
		items : [
			{
				xtype: 'navigationview',
				defaultBackButtonText: Karazy.i18n.translate('back'),			
				items: [
				{
					title : Karazy.i18n.translate('requestsTitle'),
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
							html: Karazy.i18n.translate('callWaiterCallHint')
						},
						{
							xtype: 'button',
							text: Karazy.i18n.translate('callWaiterButton'),
							action: 'waiter',
							ui: 'action',
							margin: '10 0 20 0',
							width: '80%'
						},
						{
							xtype: 'label',
							cls: 'general-label',
							html: Karazy.i18n.translate('feedbackLabel')
						},
						{
							xtype: 'button',
							text: Karazy.i18n.translate('feedback'),
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
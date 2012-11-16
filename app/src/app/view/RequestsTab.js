/*
*	Settings Tab Displayed in Lounge view.
*/
Ext.define('EatSense.view.RequestsTab', {
	extend : 'Ext.Panel',
	xtype : 'requeststab',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'middle'
		},
		cls: 'request-panel',
		items : [
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
			{
				xtype : 'panel',
				html: '<img src="res/images/club/vip.png" />',
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
			}			
		]
	}
});
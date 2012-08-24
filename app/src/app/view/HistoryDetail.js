Ext.define('EatSense.view.HistoryDetail', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'historydetail',
	config: {
		layout: {
			type: 'vbox'
		},
		items: [
			{
				docked : 'top',
				xtype : 'titlebar',				
				title : i10n.translate('history.detail.title'),
				items : [
					{
						xtype : 'button',
						action: 'back',
						text : i10n.translate('back'),
						ui : 'back'
					}, 
				]
			},
			{	//Business name and CheckInTime
				xtype: 'label',	
				itemId: 'header',
				tpl: '{businessName}',
				flex: 1		
			},
			{	//orders
				xtype: 'list',
				store: {
					model: 'EatSense.model.Order'
				},
				itemTpl: '{amount}x - {productName}',
				flex: 4
			},
			{	//total amount
				xtype: 'label',
				itemId: 'footer',
				tpl: 'Total: {billTotal}',
				flex: 1
			}
		]
	}
});
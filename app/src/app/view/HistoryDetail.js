Ext.define('EatSense.view.HistoryDetail', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'historydetail',
	config: {
		layout: {
			type: 'fit',
			align: 'stretch'
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
				cls: 'history-detail-header',
				tpl: new Ext.XTemplate('<h1>{businessName}</h1> <h3>{[this.formatDate(values.billTime)]}<h3>', {

					formatDate: function(date) {
						var format = appConstants.DateTimeFormat[appConfig.language];
						return Ext.util.Format.date(date, format);
					}
				}),
				docked: 'top',
				// flex: 1		
			},
			{	//orders
				xtype: 'list',
				itemId: 'historyOrders',
				store: {
					model: 'EatSense.model.Order'
				},
				itemTpl: '{amount}x - {productName}',
				// flex: 4,
				// layout: 'fit',
				// fullscreen: true
			},
			{	//total amount
				xtype: 'label',
				cls: 'history-detail-footer',
				itemId: 'footer',
				tpl: '<h1>Total: {billTotal}</h1>',
				docked: 'bottom'
				// flex: 1
			}
		]
	}
});
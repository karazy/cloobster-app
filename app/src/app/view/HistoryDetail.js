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
			{
				xtype: 'panel',
				cls: 'history-detail-wrapper',
				layout: 'fit',
				items: [
					{	//Business name and CheckInTime
					xtype: 'label',	
					itemId: 'header',
					cls: 'history-detail-header',
					tpl: new Ext.XTemplate('<h1>{businessName} - {[this.formatDate(values.billTime)]}</h1> ', {

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
					cls: 'history-detail-list',
					itemCls: 'history-detail-item',
					disableSelection: true,
					//prevent highlighting of item
					pressedCls: 'fake-class',
					store: {
						model: 'EatSense.model.Order'
					},
					itemTpl: new Ext.XTemplate(
							"<table style='width:100%;'>"+				
							"<td align='left'><h2 class='title'>{amount} x {productName}</h2></td><td align='right'><h2 class='price'>{[this.formatPrice(values.price_calculated)]}</td></h2>"+
							"</table>",
					{
						formatPrice: function(price) {
									return appHelper.formatPrice(price);
						}
					})
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
			},
			{
				xtype: 'toolbar',
				docked: 'bottom',
				items: [
				]
			}

		]
	}
});
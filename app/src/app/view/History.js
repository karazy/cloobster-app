Ext.define('EatSense.view.History',{
	extend: 'Ext.Panel',
	requires: ['Ext.plugin.ListPaging', 'EatSense.view.HistoryDetail'],
	xtype: 'history',				
	config: {
		layout: 'fit',
		cls: 'dashboard',
		items: [
		{
			docked : 'top',
			xtype : 'titlebar',			
			title : i10n.translate('history.title'),
			items : [
				{
					xtype : 'homebutton'
				}
			]
		},
		{
			xtype: 'panel',
			itemId: 'historyListDescPanel',
			docked: 'top',
			cls: 'dashboard',
			html: i10n.translate('history.list.description'),
			style: 'text-align: center;',
			styleHtmlContent: true,
			hidden: true
		},
		{
			xtype: 'list',
			store: 'historyStore',				
			itemTpl: new Ext.XTemplate('<strong>{businessName}</strong><br/>{[this.formatDate(values.billTime)]} | {[this.formatPrice(values.billTotal)]}',
				{
					formatPrice: function(price) {
						return appHelper.formatPrice(price);
					},

					formatDate: function(date) {
						var format = appConstants.DateFormat[appConfig.language];
						return Ext.util.Format.date(date, format);
					}
				}
			),
			plugins: [
		        {
		            xclass: 'Ext.plugin.ListPaging',
		            loadMoreText: i10n.translate('history.detail.list.paging'),
		            autoPaging: true
		        }
		    ]
		}
		]

	}
	
});
Ext.define('EatSense.view.History',{
	extend: 'Ext.Panel',
	requires: ['Ext.plugin.ListPaging', 'EatSense.view.HistoryDetail'],
	xtype: 'history',				
	config: {
		cls: 'dashboard',
		layout: 'fit',
		items: [
		{
			docked : 'top',
			xtype : 'titlebar',				
			title : i10n.translate('history.title'),
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
			xtype: 'list',
			ui: 'round',					
			store: 'historyStore',				
			itemTpl: new Ext.XTemplate('{businessName} | {[this.formatDate(values.billTime)]} | {[this.formatPrice(values.billTotal)]}',
				{
					formatPrice: function(price) {
						return appHelper.formatPrice(price);
					},

					formatDate: function(date) {
						var format = appConstants.DateTimeFormat[appConfig.language];
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
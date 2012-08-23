Ext.define('EatSense.view.History',{
	extend: 'Ext.navigation.View',
	requires: ['Ext.plugin.ListPaging', 'EatSense.view.HistoryDetail'],
	xtype: 'history',				
	config: {
		cls: 'dashboard',
		// layout: 'fit',
		defaultBackButtonText : i10n.translate('back'),
		navigationBar : {
			items: [
			{
				xtype : 'button',
				action: 'back',
				text : i10n.translate('back'),
				ui : 'back'
			}
			]
		},
		items: [

			// {
			// 	docked : 'top',
			// 	xtype : 'toolbar',				
			// 	title : i10n.translate('history.title'),
			// 	items : [
			// 		{
			// 			xtype : 'button',
			// 			action: 'back',
			// 			text : i10n.translate('back'),
			// 			ui : 'back'
			// 		}, 
			// 	]
			// },
			
			
			// title: i10n.translate('history.title'),
			
				{	
					//title for navigation view (not part of list!)
					title: i10n.translate('history.title'),
					xtype: 'list',
					ui: 'round',					
					store: 'historyStore',				
					itemTpl: new Ext.XTemplate('{businessName} | {[this.formatDate(values.billTime)]} | {[this.formatPrice(values.billTotal)]} | {paymentMethod}',
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
				            autoPaging: true
				        }
				    ],

				    items: [
				    	{
				    		title: 'second'
				    	}
				    ]
				}
			
		]

	}
	
});
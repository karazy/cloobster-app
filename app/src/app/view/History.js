Ext.define('EatSense.view.History',{
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'history',
	config: {
		cls: 'dashboard',
		layout: 'fit',
		items: [
			{
				docked : 'top',
				xtype : 'toolbar',				
				title : Karazy.i18n.translate('history.title'),
				items : [
					{
						xtype : 'button',
						action: 'back',
						text : Karazy.i18n.translate('back'),
						ui : 'back'
					}, 
				]
			},
							{
					xtype: 'list',
					ui: 'round',
					// width: 400,
					// height: 400,						
					store: 'historyStore',
					itemTpl: new Ext.XTemplate('{businessName} | {billTime} | {[this.formatPrice(values.billTotal)]}',
						{
							formatPrice: function(price) {
								return Karazy.util.formatPrice(price);
							}
						})
				}
		]

	}
	
});
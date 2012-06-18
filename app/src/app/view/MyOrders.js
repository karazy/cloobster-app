Ext.define('EatSense.view.MyOrders', {
	extend : 'Ext.Panel',
	xtype: 'myorderstab',	
	config: {
		iconCls : 'cash',
		title: Karazy.i18n.translate('myOrdersTabLeaveBt'),
		iconMask : true,
		itemId : 'myorderstab',		
		layout : 'fit',
		items: [
			{
				xtype: 'navigationview',
				defaultBackButtonText: Karazy.i18n.translate('back'),
				cls: 'myorders-panel',
				navigationBar: {
				    items: [
						{
							xtype: 'button',
							text: Karazy.i18n.translate('payRequestButton'),
							ui: 'forward',
							action: 'pay',
							hidden: true,
							align: 'right'
						},
						{
							xtype: 'button',
							text: Karazy.i18n.translate('leaveButton'),
							ui: 'forward',
							action: 'leave',
							align: 'right'
						}
				    ]
				},
				items: [ {
					title : Karazy.i18n.translate('myOrdersTitle'),
					layout: {
						type: 'fit'
					},
					items: [
						{
							xtype: 'list',
							store: 'orderStore',
							ui: 'round',
							allowDeselect: true,
							onItemDisclosure: this.removeItem,
							itemCls: 'orderListItem',
							itemTpl:  new Ext.XTemplate(
								"<table style='width:100%;'>"+				
								"<td align='left'><h2 class='title'>{amount} x {Product.name}</h2></td><td align='right'><h2 class='price collapsed-arrow'>{[this.formatPrice(values.Product.price_calculated)]}</td></h2>"+
								"</table>"+
								"<div class='myorder-detail hidden'>"+
								"<h4>"+Karazy.i18n.translate('orderTime')+": {[values.orderTime.toLocaleTimeString()]}</h4>"+
								"<div class='choices'>"+
									"<tpl for='Product.choices'>" +				
										"<tpl if='this.checkSelections(values, xindex)'>" +
											"<tpl if='!parent'><h3>{text}</h3></tpl>" +
											"<ul>" +
												"<tpl for='options'>" +
													"<tpl if='selected === true'>" +
														"<li>{name}</li>" +
													"</tpl>" +
												"</tpl>" +
											"</ul>" +
										"</tpl>" +
									"</tpl>" +
									"<tpl if='comment!=\"\"'>" +
									"<h3>"+Karazy.i18n.translate('myorderComment')+"</h3>"+
									"<p>{comment}</p>" +
									"</tpl>" +
								"</div>"+
								"</div>"
								, {
								//checks if the current choice has selections. If not it will not be shown.
								//we need to pass the product as the choices object in this context is raw data
								checkSelections: function(values, xindex) {
									console.log('Cart Overview -> checkSelections');				
									var result = false;
									Ext.each(values.options,
											function(option) {
										if(option.selected === true) {
											result = true;
										}
									});
									
									return result;
								},
								formatPrice: function(price) {
									return Karazy.util.formatPrice(price);
								},
								renderChoices: function(values) {

								}				
							}),
							listeners: {
								select: function(dv, ix, item, e) {
									Ext.defer((function() {
										dv.deselect(ix);
					    			}), 100, this);					
								}
							}
						}, {
							type: 'panel',
							docked: 'bottom',
							itemId: 'myorderstotalpanel',
							items: [{
								xtype: 'label',	
								cls: 'cartTotal',		
								tpl: new Ext.XTemplate('<h1>Total {[this.formatPrice(values.price)]}</h1>',
									{
										formatPrice: function(price) {
											return Karazy.util.formatPrice(price);
										}
									}
								)
							},			
							{
								type: 'panel',
								itemId: 'myorderscompletepanel',
								cls: 'general-panel',
								hidden: true,
								padding: 5,
								layout: {
									type: 'vbox',
									align: 'center',
									pack: 'center'
								},
								items: [
								{
									xtype: 'button',
									text: Karazy.i18n.translate('feedback'),
									ui: 'confirm',
									action: 'feedback',
									height: '45px',
									margin: '0 0 5 0 ',
									width: '80%'
								},
								{
									xtype: 'button',
									text: Karazy.i18n.translate('leave'),
									ui: 'confirm',
									action: 'complete',
									height: '45px',
									width: '80%'
								}
								]
							}
							]			
						}
					]
				}]
			}

		// {
		// 	docked : 'top',
		// 	xtype : 'titlebar',
		// 	title : Karazy.i18n.translate('myOrdersTitle'),
		// 	items : [
		// 	{
		// 		xtype: 'button',
		// 		text: Karazy.i18n.translate('payRequestButton'),
		// 		ui: 'forward',
		// 		action: 'pay',
		// 		hidden: true,
		// 		align: 'right'
		// 	},
		// 	{
		// 		xtype: 'button',
		// 		text: Karazy.i18n.translate('leaveButton'),
		// 		ui: 'forward',
		// 		action: 'leave',
		// 		align: 'right'
		// 	}
		// 	]
		// },		
		]
	},
	/**
	 * Show a loading screen
	 * @param mask
	 */
    showLoadScreen : function(mask) {
    	if(mask) {
    		this.setMasked({
    			message : Karazy.i18n.translate('loadingMsg'),
        		xtype: 'loadmask' 
    		});
    	} else {
    		this.setMasked(false);
    	}
    }
});
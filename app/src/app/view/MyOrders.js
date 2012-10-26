Ext.define('EatSense.view.MyOrders', {
	extend : 'Ext.Panel',
	requires: ['EatSense.view.CartButton'],
	xtype: 'myorderstab',
	config: {
		iconCls : 'cash',
		title: i10n.translate('myOrdersTabLeaveBt'),
		iconMask : true,
		itemId : 'myorderstab',		
		layout: {
			type: 'card',
			animation : {
				type : 'slide',
				direction : 'left'
			}
		},
		items: [
		{	
			xtype: 'panel',
			layout: 'fit',			
				items: [
				{
					docked : 'top',
					xtype : 'titlebar',
					title : i10n.translate('myOrdersTitle'),
					items : [ 
					{
						xtype: 'cartbutton'
					}
					]
				},
				{
						xtype: 'panel',
						docked: 'top',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						margin: '5',
						items: [
						{
							xtype: 'button',
							text: i10n.translate('payRequestButton'),
							ui: 'action',
							action: 'pay',
							width: '50%',
							iconCls: 'cash',
							iconMask: true
						}
					]							
					},
					{
						xtype: 'label',
						itemId: 'description',
						html: i10n.translate('myorders.description'),
						cls: 'myorders-description',
						hidden: true,
						docked: 'top'
					},
					{
						xtype: 'list',
						store: 'orderStore',
						ui: 'round',
						allowDeselect: true,
						onItemDisclosure: this.removeItem,
						itemCls: 'orderListItem',
						itemTpl:  new Ext.XTemplate(
							"<table style='width:100%;'>"+				
							"<td align='left' class='title'>{amount} x {productName}</td><td align='right' class='price'>{[this.formatPrice(values.price_calculated)]}</td><td class='arrow collapsed-arrow'></td>"+
							"</table>"+
							"<div class='myorder-detail hidden'>"+
							"<h4>"+i10n.translate('orderTime')+": {[values.orderTime.toLocaleTimeString()]}</h4>"+
							"<div class='choices'>"+
								"<tpl for='choices'>" +				
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
								"<h3>"+i10n.translate('myorderComment')+"</h3>"+
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
								return appHelper.formatPrice(price);
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
										return appHelper.formatPrice(price);
									}
								}
							)
						},			
						{
							type: 'panel',
							itemId: 'myorderscompletepanel',
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
								text: i10n.translate('feedback'),
								ui: 'action',
								action: 'feedback',
								margin: '0 0 5 0 ',
								width: '80%'
							},
							{
								xtype: 'button',
								text: i10n.translate('leave'),
								ui: 'action',
								action: 'complete',
								width: '80%'
							}
							]
						}
						]			
					}
				]
			},
			{
				xtype: 'feedbackform'
			},
			{
				xtype: 'carttab'
			}
		]
	},
	/**
	 * Show a loading screen
	 * @param mask
	 */
    showLoadScreen : function(mask) {
    	if(mask) {
    		this.setMasked({
    			message : i10n.translate('loadingMsg'),
        		xtype: 'loadmask' 
    		});
    	} else {
    		this.setMasked(false);
    	}
    },
    	/**
	* Change the direction of the slide animation.
	* 
	* @param direction
	*            left or right
	*/
	switchAnim : function(direction) {
		this.getLayout().setAnimation({
			type : 'slide',
			direction : direction
		});
	}
});
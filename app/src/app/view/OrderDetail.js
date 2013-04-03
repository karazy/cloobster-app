/**
 * Displays details and options of an order.
 * Very similar to productdetail.
 */
Ext.define('EatSense.view.OrderDetail', {
	extend : 'Ext.Panel',
	xtype : 'orderdetail',	
	config : {
		scrollable : 'vertical',
		items : [
		{
			xtype: 'titlebar',
			title : i10n.translate('order.detail.title'),
			docked: 'top',
			items: [
				{
					xtype: 'backbutton',
					text: i10n.translate('cancel'),
					action: 'undo'
				},
				{
					xtype: 'fixedbutton',
					action: 'edit',
					ui: 'action',
					iconCls: 'check2',
					align: 'right',
					iconMask: true
				}				
			]
		},
		
		{
			xtype : 'panel',
			itemId: 'productDetailPanel',
			items : [
				{
					xtype: 'label',
					itemId: 'titleLabel',
					docked: 'top',			
					tpl: new Ext.XTemplate('<div class="productlist-header">'+
						'<tpl if="productSpecial"><div class="special"></div></tpl>'+
						'{productName}'+
						'</div>')
				}
			]
		},
		{
			xtype : 'label',
			itemId : 'prodDetailLabel',
			cls: 'productDetail',
			padding: '0 10',
			tpl: new Ext.XTemplate(
				'<div>{productLongDesc}</div>'
			)
		}, 
		// ###
		// 	{
		// 		xtype : 'panel',
		// 		docked: 'right',
		// 		width: 130,
		// 		padding: 3,
		// 		style: {
		// 			'border-radius': '3px',
		// 			'background': 'rgba(211, 211, 211, 0.7)',
		// 			//prevents the box from having the height of the long desc
		// 			'height' : '100%'
		// 		},
		// 		items : [ 
		// 			{
		// 				xtype: 'numberfield',
		// 				label: i10n.translate('amount'),
		// 				labelAlign: 'top',
		// 				itemId: 'amountField',
		// 				value: 1,
		// 				minValue: 1,
		// 				maxValue: 100,
		// 				clearIcon: false,
		// 				autoCorrect: true
		// 			},
		// 			{
		// 				xtype: 'label',
		// 				cls: 'productPrice',
		// 				padding: '5 0 0 2',
		// 				itemId : 'prodPriceLabel',
		// 				tpl: new Ext.XTemplate(
		// 				'{[this.formatPrice(values.order.calculate())]}',
		// 				{
		// 					formatPrice: function(price) {
		// 						return appHelper.formatPrice(price);
		// 					}
		// 				}
		// 				)
		// 			} 
		// 		]
		// 	}]
		// }, 
		// ##
		{
			xtype: 'panel',
			padding: '0 10',
			margin: '10 0 15 0',
			layout: {
				type: 'hbox',
				align: 'center',
				pack: 'center'
			},
			items: [
				{
					xtype: 'label',
					cls: 'productPrice',
					itemId : 'prodPriceLabel',
					flex: 1,
					tpl: new Ext.XTemplate(
					'<div>{[this.formatPrice(values.order.data.price_calculated)]}</div>',
					{
						formatPrice: function(price) {
							//price must be calculated in advance
							return appHelper.formatPrice(price);
						}
					}
					)
				},
				{
					xtype: 'numberfield',
		            label: i10n.translate('amount'),
		            itemId: 'amountField',
		            value: 1,
		            minValue: 1,
		            maxValue: 100,
		            clearIcon: false,
		            autoCorrect: true,
		            style: {
		            	'height' : '40px',
		            	'min-heigt' : '40px'
		            },
		            inputCls: 'amount-input',
		            labelCls: 'amount-label',
		            labelWidth: '45%',
		            flex: 1,
		            listeners: {
		            	tap: {
		            		element: "label",
		            		fn: function() {
		            			this.focus();
		            		}
		            	}
		            }
		        }				
			]
		},
		{
			xtype : 'formpanel',
			itemId : 'choicesPanel',
			cls: 'choice-panel',
			scrollable : false
		}
		]		
	}
});
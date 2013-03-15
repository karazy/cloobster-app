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
			cls: 'productDetailPanel',
			itemId: 'productDetailPanel',
			layout : {
				type : 'hbox'
			},
			items : [
			{
				xtype: 'label',
				itemId: 'titleLabel',
				docked: 'top',			
				tpl: new Ext.XTemplate('<div class="productlist-header">{productName}</div>')
			},
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				tpl: new Ext.XTemplate(
					'<div>{productLongDesc}</div>'
				)
			}, 
			{
				xtype : 'panel',
				docked: 'right',
				width: 130,
				padding: 3,
				style: {
					'border-radius': '3px',
					'background': 'rgba(211, 211, 211, 0.7)',
					//prevents the box from having the height of the long desc
					'height' : '100%'
				},
				items : [ 
					{
						xtype: 'numberfield',
						label: i10n.translate('amount'),
						labelAlign: 'top',
						itemId: 'amountField',
						value: 1,
						minValue: 1,
						maxValue: 10,
						clearIcon: false,
						autoCorrect: true
					},
					{
						xtype: 'label',
						cls: 'productPrice',
						padding: '5 0 0 2',
						itemId : 'prodPriceLabel',
						tpl: new Ext.XTemplate(
						'{[this.formatPrice(values.order.calculate())]}',
						{
							formatPrice: function(price) {
								return appHelper.formatPrice(price);
							}
						}
						)
					} 
				]
			}]
		}, 
		{
			xtype : 'label',
			itemId : 'prodDetailLabelImage',
			cls: 'productDetail',
			padding: 5,
			tpl: new Ext.XTemplate(
				'<div>{productLongDesc}</div>'
			)
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
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
					xtype: 'fixedbutton',
					action: 'edit',
					ui: 'action',
					iconCls: 'check2',
					align: 'right',
					iconMask: true
				},
				{
					xtype: 'fixedbutton',
					text: i10n.translate('cancel'),
					action: 'undo',
					ui: 'back'
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
				// margin: '0 0 15 0',				
				tpl: new Ext.XTemplate('<div class="productlist-header" style="position: absolute; right: 0; left: 0; top: 0px;">{productName}</div>')
			},
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				tpl: new Ext.XTemplate(
					'<div>{order.data.productLongDesc}</div>'
					)
			}, 
			{
				xtype : 'panel',
				docked: 'right',
				width: 130,
				padding: 3,
				style: {
					'border-radius': '3px',
					'background-color': '#d3d3d3'
				},
				items : [ 
					{
						xtype : 'spinnerfield',
						label: i10n.translate('amountspinnerLabel'),
						style: 'background-color: #d3d3d3;',
						labelCls: 'productdetail-spinner-label',
						inputCls: 'productdetail-spinner-input',
						labelAlign: 'top',
						stepValue : 1,
						value : 1,
						minValue : '1',
						maxValue : '10',
						cycle : true
					},
					{
						xtype: 'label',
						cls: 'productPrice',
						padding: '5 0 0 0',
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
				'<div>{order.data.productLongDesc}</div>'
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
/**
 * Displays details and options of a product.
 */
Ext.define('EatSense.view.ProductDetail', {
	extend : 'Ext.Panel',
	requires: ['Ext.field.Spinner', 'Ext.field.Radio', 'Ext.form.Panel', 'Ext.field.Checkbox'],
	xtype : 'productdetail',	
	config : {
    	scrollable : 'vertical',
		items : [
		{
			xtype: 'titlebar',
			title : i10n.translate('menuTitle'),
			docked: 'top',
			items: [
				{
					xtype: 'fixedbutton',
					action: 'close',
					text: i10n.translate('back'),
					ui: 'back',
					// iconCls: 'delete1',
					// iconAlign: 'right',
					iconMask: true,
					// flex: 1,
					align: 'left'
				},
				{
					xtype: 'basicbutton',
					// text: i10n.translate('putIntoCartButton'),
					action: 'cart',
					ui: 'action',
					iconCls: 'shop1',
					iconMask: true,
					// flex: 1,
					align: 'right',
					welcomeFn: function() {
						Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
					}
				}
			]
		},
		{
			xtype: 'label',
			itemId: 'titleLabel',
			docked: 'top',
			// margin: '0 0 15 0',
			tpl: new Ext.XTemplate('<div class="productlist-header" style="position: absolute; right: 0; left: 0; top: 0px;">{productName}</div>')
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
					'<div>{product.data.productLongDesc}</div>'
				)
				// flex: 2
			}, 
			{
				xtype : 'panel',
				width: 130,
				docked: 'right',
				padding: 3,
				style: {
					'border-radius': '3px',
					'background': 'rgba(211, 211, 211, 0.7)',
					//prevents the box from having the size of the long desc
					'height' : '100%'
				},
				items : [
				{	
					xtype : 'spinnerfield',
					itemId : 'productAmountSpinner',
					style: {
						'background': 'transparent'
					},
					inputCls: 'productdetail-spinner-input',
					padding: '5 0 0 2',
					stepValue : 1,
					value : 1,
					minValue : '1',
					maxValue : '10',					
					cycle : true
				},
				{
					xtype: 'label',
					cls: 'productPrice',
					itemId : 'prodPriceLabel',
					padding: '5 0 0 2',
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
			}
			]
		}, 
		{
			xtype : 'label',
			itemId : 'prodDetailLabelImage',
			cls: 'productDetail',
			padding: 5,
			tpl: new Ext.XTemplate(
				'<div>{product.data.productLongDesc}</div>'
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
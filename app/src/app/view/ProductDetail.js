/**
 * Displays details and options of a product.
 */
Ext.define('EatSense.view.ProductDetail', {
	extend : 'Ext.Panel',
	requires: ['Ext.field.Spinner', 'Ext.field.Radio', 'Ext.form.Panel', 'Ext.field.Checkbox', 'Ext.field.Number'],
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
					xtype: 'backbutton'
				},
				{
					xtype: 'basicbutton',
					action: 'cart',
					ui: 'action',
					iconCls : 'shop1',
					iconMask: true,
					align: 'right',
					welcomeFn: function() {
						Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
					}
				}
			]
		},
		{
			xtype : 'panel',
			// cls: 'productDetailPanel',
			itemId: 'productDetailPanel',
			// margin: ''
			layout : {
				type : 'hbox'
			},
			items : [ 
			{
				xtype: 'label',
				itemId: 'titleLabel',
				docked: 'top',	
				tpl: new Ext.XTemplate('<div class="productlist-header">'+
					'<tpl if="productSpecial"><div class="special"></div></tpl>'+
					'{productName}'+
					'</div>')
			},
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				padding: '0 10 0 10',
				tpl: new Ext.XTemplate(
					'<div>{product.data.productLongDesc}</div>'
				)
			} 
			// {
			// 	xtype : 'panel',
			// 	width: 130,
			// 	docked: 'right',
			// 	padding: 3,
			// 	style: {
			// 		'border-radius': '3px',
			// 		'background': 'rgba(211, 211, 211, 0.7)',
			// 		//prevents the box from having the height of the long desc
			// 		'height' : '100%'
			// 		// 'margin-top' : '35px'
			// 	},
			// 	items : [
				// {
				// 	xtype: 'numberfield',
				// 	label: i10n.translate('amount'),
				// 	labelAlign: 'top',
				// 	itemId: 'amountField',
				// 	value: 1,
				// 	minValue: 1,
				// 	maxValue: 100,
				// 	clearIcon: false,
				// 	autoCorrect: true
				// },
			// 	{
			// 		xtype: 'label',
			// 		// cls: 'productPrice',
			// 		itemId : 'prodPriceLabel',
			// 		padding: '5 0 0 2',
			// 		style: {
			// 			'position' : 'absolute',
			// 			'background-color' : 'red',
			// 			'width' : '100px',
			// 			'height' : '50px'
			// 		},
			// 		tpl: new Ext.XTemplate(
			// 		'{[this.formatPrice(values.order.calculate())]}',
			// 		{
			// 			formatPrice: function(price) {
			// 				return appHelper.formatPrice(price);
			// 			}
			// 		}
			// 		)
			// 	} 
			// 	]
			// }
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
			xtype: 'panel',
			padding: 5,
			margin: '0 0 10 0',
			layout: {
				type: 'hbox',
				align: 'center',
				pack: 'center'
			},
			items: [
				{
					xtype: 'numberfield',
		            label: i10n.translate('amount'),
		            // label: 'x',
		            itemId: 'amountField',
		            // labelAlign: 'right',
		            value: 1,
		            minValue: 1,
		            maxValue: 100,
		            clearIcon: false,
		            autoCorrect: true,
		            inputCls: 'amount-input',
		            labelCls: 'amount-label',
		            labelWidth: '50%',
		            width: '40%',
		            margin: '0 20px 0 0'
		            // labelCls: 'amount',
		            // style: {
		            //     'text-align' : 'right'
		            // },
		            // margin: '0 0 5 0',
		            // flex:1
		        },
				{
					xtype: 'label',
					cls: 'productPrice',
					itemId : 'prodPriceLabel',
					width: '40%',
					margin: '0 0 0 20px',
					// padding: '5 0 0 2',
					// flex: 1,
					// style: {
					// 	'position' : 'absolute',
					// 	'background-color' : 'red',
					// 	'width' : '100px',
					// 	'height' : '50px'
					// },
					tpl: new Ext.XTemplate(
					'<div>{[this.formatPrice(values.order.calculate())]}</div>',
					{
						formatPrice: function(price) {
							return appHelper.formatPrice(price);
						}
					}
					)
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
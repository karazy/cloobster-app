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
			margin: '0 0 15 0',
			tpl: new Ext.XTemplate('<div class="productlist-header">{productName}</div>')
		},
		{
			xtype : 'panel',
			cls: 'productDetailPanel',
			itemId: 'productDetailPanel',
			layout : {
				type : 'hbox'
			},
			// itemId : 'prodDetailLabel',
			// cls: 'productDetail',
			// 	tpl: new Ext.XTemplate(
			// 		'<tpl if="product.data.imageUrl"><div class="thumbnail" style="background-image: url(\'{product.data.imageUrl}=s720\')"></div></tpl>'+
			// 		'<div>{product.data.productLongDesc}</div>'
			// 	),
			// style: {'background-image': 'url("res/images/background.jpg")',
			// 		 'background-size': '100%',
			// 		 'background-position: center'
			// 		},
			items : [ 
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				tpl: new Ext.XTemplate(
					'<div>{product.data.productLongDesc}</div>'
					),
				// flex: 2
			}, 
			{
				xtype : 'panel',
				width: 130,
				docked: 'right',
				padding: 3,
				style: {
					'border-radius': '3px',
					'background-color': '#d3d3d3'
				},
				// layout : {
				// 	type : 'vbox',
				// 	align : 'right',
				// 	pack: 'center'
				// },
				// flex: 1,
				// cls: 'productDetail',
				items : [
				{	
					xtype : 'spinnerfield',
					label: i10n.translate('amountspinnerLabel'),
					labelAlign: 'top',
					itemId : 'productAmountSpinner',
					// cls: 'productdetail-spinner',
					style: 'background-color: #d3d3d3;',
					labelCls: 'productdetail-spinner-label',
					inputCls: 'productdetail-spinner-input',
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
					padding: '5 0 0 0',
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
			// layout: 'vbox',
			// minHeight: '200px',
			scrollable : false
			// items: [
			// 	{
			// 		xtype: 'label',
			// 		docked: 'top',
			// 		cls: 'choice-panel-title',
			// 		html: i10n.translate('choicesPanelTitle')
			// 	}
			// ]
		},
		// {
		// 	xtype: 'toolbar',
		// 	docked: 'bottom',
			// layout: {
   // 				type: 'hbox',
   // 				align: 'middle',
   // 				pack: 'center'
			// },
			// items: [
				// {
				// 	xtype: 'basicbutton',
				// 	text: i10n.translate('putIntoCartButton'),
				// 	action: 'cart',
				// 	ui: 'action',
				// 	iconCls: 'shop1',
				// 	iconMask: true,
				// 	flex: 1,
				// 	welcomeFn: function() {
				// 		Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				// 	}
				// }, 
				// {
				// 	xtype: 'fixedbutton',
				// 	action: 'close',
				// 	text: i10n.translate('close'),
				// 	ui: 'action',
				// 	iconCls: 'delete1',
				// 	iconAlign: 'right',
				// 	iconMask: true,
				// 	flex: 1
				// }
		// 	]
		// }
		]	
	}
});
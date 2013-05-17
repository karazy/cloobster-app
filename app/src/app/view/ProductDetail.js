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
					// iconAlign: 'right',
					align: 'right',
					// text: '&gt;',
					welcomeFn: function() {
						Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
					}
				},
				{
					xtype: 'fixedbutton',
					action: 'no-order-info',
					iconMask: true,
					iconCls: 'help',
					align: 'right',
					ui: 'action',
					hidden: true
				}
			]
		},
		{	//panel also cotains product image
			xtype : 'panel',
			itemId: 'productDetailPanel',
			style: {
				'padding': '0 0.5em'				
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
				}
			]
		}, 
		{
			xtype : 'label',
			itemId : 'prodDetailLabel',
			cls: 'productDetail',
			padding: '5px 12px 0px',
			tpl: new Ext.XTemplate(
				//product is an order object
				'<div>',
					'<tpl if="productLongDesc">',
						'{productLongDesc}',
					'<tpl else>',
						'{productShortDesc}',
					'</tpl>',
					// '{[values.product.data.productLongDesc != null ? values.product.data.productLongDesc : values.product.data.productShortDesc]}',
				'</div>'
				// '<div>{product.data.productLongDesc}</div>'
			)
		}, 
		{
			xtype: 'panel',
			padding: '0 10',
			margin: '10 0 15 0',
			layout: {
				type: 'hbox',
				//algin start, center will only center price label, don't know why
				align: 'start',
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
		            labelWidth: '50%',
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
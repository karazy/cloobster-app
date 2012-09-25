/**
 * Displays details and options of a product.
 */
Ext.define('EatSense.view.ProductDetail', {
	extend : 'Ext.Panel',
	requires: ['Ext.field.Spinner', 'Ext.field.Radio', 'Ext.form.Panel', 'Ext.field.Checkbox'],
	xtype : 'productdetail',	
	layout : {
		type : 'vbox',
		align : 'stretch',
	},	
	config : {
		scrollable : {
		  direction: 'vertical',
		  directionLock: true,
		  momentumEasing:  {
		     momentum: {
		       acceleration: 30,
		       friction: 0.5
		     },
		     bounce: {
		        acceleration: 0.0001,
		        springTension: 0.9999,
		     },
		     minVelocity: 5
		  },
		  outOfBoundRestrictFactor: 0	
		 },
    	// scrollable : 'vertical',
    	// fullscreen: true,
    	modal: true,
		top: '3%',
		left: '2%',
		right: '2%',
		bottom: '2%',
		floatingCls: 'panel-floating',
		items : [
		{
			xtype: 'titlebar',
			docked: 'top',
		},
		{
			xtype : 'panel',
			cls: 'productDetailPanel',
			layout : {
				type : 'vbox',
			},
			items : [ 
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				tpl: '{product.data.productLongDesc}'
			}, 
			{
				xtype : 'panel',
				docked: 'right',
				width: 110,
				layout : {
					type : 'vbox',
					align : 'stretch',
					pack: 'center'
				},
				items : [
				{
					xtype : 'spinnerfield',
					label: i10n.translate('amountspinnerLabel'),
					labelAlign: 'top',
					itemId : 'productAmountSpinner',
					labelCls: 'productdetail-spinner-label',
					inputCls: 'productdetail-spinner-input',
					increment : 1,
					value : 1,
					minValue : '1',
					maxValue : '10',					
					cycle : true
				},
				{
					xtype: 'label',
					cls: 'productPrice',
					itemId : 'prodPriceLabel',
					margin: '5 0 0 0',
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
			xtype : 'formpanel',
			itemId : 'choicesPanel',
			cls: 'choice-panel',
			layout: 'vbox',
			// minHeight: '200px',
			scrollable : false,
			items: [
				{
					xtype: 'label',
					docked: 'top',
					cls: 'choice-panel-title',
					html: i10n.translate('choicesPanelTitle')
				}
			]
		},
		{
			xtype: 'toolbar',
			docked: 'bottom',
			layout: {
   				type: 'hbox',
   				align: 'middle',
   				pack: 'center'
			},
			items: [
				{
					xtype: 'button',
					text: i10n.translate('putIntoCartButton'),
					action: 'cart',
					ui: 'action',
				}, 
				{
					xtype: 'button',
					action: 'close',
					text: i10n.translate('close'),
					ui: 'action',
				}
			]
		}
		]		
	}
});
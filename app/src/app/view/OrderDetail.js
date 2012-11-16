/**
 * Displays details and options of an order.
 * Very similar to productdetail.
 */
Ext.define('EatSense.view.OrderDetail', {
	extend : 'Ext.Panel',
	xtype : 'orderdetail',	
	// layout : {
	// 	type : 'vbox',
	// 	align : 'stretch',
	// },	
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
		        springTension: 0.9999
		     },
		     minVelocity: 5
		  },
		  outOfBoundRestrictFactor: 0	
		},
    	modal: true,
		top: '3%',
		left: '2%',
		right: '2%',
		bottom: '2%',
		items : [
		{
			xtype: 'titlebar',
			docked: 'top'
		},
		{
			xtype : 'panel',
			cls: 'productDetailPanel',
			// layout : {
			// 	type : 'vbox',
			// },
			items : [ 
			{
				xtype : 'label',
				itemId : 'prodDetailLabel',
				cls: 'productDetail',
				tpl: '{order.data.productLongDesc}'
			}, {
				xtype : 'panel',
				docked: 'right',
				width: 110,
				// layout : {
				// 	type : 'vbox',
				// 	align : 'stretch',
				// 	pack: 'center'
				// },
				items : [ {
					xtype : 'spinnerfield',
					label: i10n.translate('amountspinnerLabel'),
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
			xtype : 'formpanel',
			itemId : 'choicesPanel',
			cls: 'choice-panel',
			// layout: 'vbox',
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
			// layout: {
   // 				type: 'hbox',
   // 				align: 'middle',
   // 				pack: 'center'
			// },
			items: [
				{
					xtype: 'button',
					// ui: 'confirm',
					text: i10n.translate('change'),
					action: 'edit',
					ui: 'action',
					iconCls: 'check2',
					iconMask: true,
					flex: 1
				},
				{
					xtype: 'button',
					// ui: 'confirm',
					text: i10n.translate('cancel'),
					action: 'undo',
					ui: 'action',
					iconCls: 'delete1',
					iconAlign: 'right',
					iconMask: true,
					flex: 1
				}
			]
		}
		]		
	}
});
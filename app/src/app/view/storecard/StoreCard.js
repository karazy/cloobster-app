/**
* Enables user to add a storecard for the location he checked in.
*
*/
Ext.define('EatSense.view.storecard.StoreCard', {
	extend: 'Ext.Panel',
	requires: [
		'Ext.field.Radio',
		'EatSense.view.components.BackButtonPanel'
	],
	xtype: 'storecard',
	config: {
		layout: 'card',
		activeItem: 0,
		items: [		
			{
				xtype: 'backbuttonpanel',
				homeButton: true,
				layout: {
						type: 'vbox',
						pack: 'center',
						align: 'center'
				},
				// scrollable: 'vertical',
				// padding: '10px 30px 8px 30px',
				items: [
					{
						xtype: 'titlebar',
						title: i10n.translate('storecard.title'),
						docked: 'top',
						items: [
						]
					},
					{
						xtype: 'label',
						html: i10n.translate('storecard.description'),
						width: '95%'
					},
					{
						xtype: 'textfield',
						label: i10n.translate('storecard.customernumber'),
						labelAlign: 'top',
						placeHolder: i10n.translate('storecard.customernumber.ph'),
						cls: 'general-textfield',
						labelCls: 'general-field-label-vertical',
						margin: '7 0 5 0',
						width: '95%'
					},
					{
						xtype: 'label',
						itemId: 'generatedQr',
						width: '95%'
					},
					{
			            xtype: 'radiofield',
			            name : 'qrtype',
			            value: 'qr',
			            label: i10n.translate('storecard.qrtype.qr'),
			            width: '95%'
			        },
			        {
			            xtype: 'radiofield',
			            name : 'qrtype',
			            value: 'barcode',
			            label: i10n.translate('storecard.qrtype.barcode'),
			            width: '95%'
			        }
				]
			}		
		]
	}

});
/**
* Enables user to add a storecard for the location he checked in.
*
*/
Ext.define('EatSense.view.storecard.StoreCard', {
	extend: 'Ext.Panel',
	requires: [
		// 'Ext.field.Radio',
		// 'Ext.form.FieldSet',
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
							{
								xtype: 'fixedbutton',
								text: i10n.translate('storecard.scan'),
								align: 'right',
								action: 'scan-barcode',
								ui: 'normal'
							}
						]
					},					
					{
						xtype: 'label',
						itemId: 'generatedQr',
						// width: '95%',
						height: 200,
						margin: '0 0 20 0'
					},
					{
						xtype: 'label',
						html: i10n.translate('storecard.description'),
						width: '95%',
						margin: '7 0 5 0'
					},					
					{
						xtype: 'textfield',
						label: i10n.translate('storecard.customernumber'),
						labelAlign: 'top',
						placeHolder: i10n.translate('storecard.customernumber.ph'),
						cls: 'general-textfield',
						labelCls: 'general-field-label-vertical',
						margin: '7 0 5 0',
						width: '95%',
						name: 'customerNumber'
					}						
				]
			}		
		]
	}

});
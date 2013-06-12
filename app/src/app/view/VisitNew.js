/**
* View for new custom visits, which don't belong to a cloobster location.
*/
Ext.define('EatSense.view.VisitNew', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.DatePicker'],
	xtype: 'visitnew',
	config: {
		layout: {
			type: 'vbox'
		},
		//make panel stay on top!
		style: 'z-index: 5;',
		autoDestroy: true,
		fullscreen: true,
		scrollable: 'vertical',		
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('tovisit.title.new'),
				docked: 'top',
				items: [
					{
						xtype: 'backbutton'
					}					
				]
			},
			{
				xtype: 'formpanel',
				layout: {
					type: 'vbox',
					align: 'stretch',
					pack: 'start'
				},
				cls: 'tovisit-new',
				scrollable: false,
				margin: 5,
				defaults: {
					margin: '5 0'
				},
				items: [
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
						},
						margin: '5',
						items: [
							{
								xtype: 'fixedbutton',
								text: i10n.translate('tovisit.scanbutton'),
								iconCls: 'qrcode-icon',
								iconMask: true,
								ui: 'action',
								action: 'scan',
								hidden: true,
								flex: 1,
								margin: '0 5 0 0'
							},							
							{
								xtype: 'fixedbutton',
								ui: 'action',
								action: 'create',
								text: i10n.translate('save'),
								// align: 'right',
								iconCls: 'action',
								iconMask: true,
								flex: 1,
								margin: '0 0 0 5'
							}
						]
					},
					
					{
						xtype: 'label',
						hidden: true,
						itemId: 'locationNameLabel',
						margin: '5 5'
					},
					{
						xtype: 'textfield',
						placeHolder: i10n.translate('tovisit.formnew.locationname'),
						name: 'locationName',
						cls: 'general-textfield',
						margin: '5'
					},
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
						},
						margin: '5',
						items: [
							{
								xtype: 'datepickerfield',
								placeHolder: i10n.translate('tovisit.formnew.visitdate'),
								name: 'visitDate',
								dateFormat: appConstants.DateFormat[appConfig.language],
								destroyPickerOnHide: true,							
								picker: {
									yearFrom: 2013,
							        yearTo: 2020,
							        cancelButton: {
							        	text: i10n.translate('cancel'),
							        	// action: 'delete-visitdate'
							        },
							        doneButton: i10n.translate('ok'),
							        value: new Date(),
							        toolbar : {
					                    items : [
					                        {
					                            // text    : 'X',
					                            iconMask: true,
					                            iconCls: 'delete',
					                            ui      : 'decline',
					                            align   : 'right',
					                            handler : function(btn) {
					                                var picker = btn.up('datepicker');

					                                picker.fireEvent('change', picker, null);

					                                picker.hide();
					                            }
					                        }
					                    ]
					                }
							    },
							    cls: 'general-textfield',
							    flex: 2
							},
							// {
							// 	xtype: 'fixedbutton',
							// 	iconCls: 'delete',
							// 	iconMask: true,
							// 	ui: 'sirkobutton',
							// 	action: 'delete-visitdate',
							// 	margin: '0 0 0 7'
							// }
							{
								xtype:'fixedbutton',
								action: 'capture-photo',
								iconCls: 'photo1',
								iconMask: true,
								// text: i10n.translate('tovisit.camerabutton'),
								// iconAlign: 'top',
								ui: 'action',
								flex: 1,
								margin: '0 0 0 5',
								padding: '12 0'
							}
						]
					},
					{
						xtype: 'textareafield',
						placeHolder: i10n.translate('tovisit.formnew.comment'),
						name: 'comment',
						cls: 'general-textfield',
						maxLength: 140,
						margin: '5'
					},				
					{
						xtype: 'panel',
						hidden: true,
						itemId: 'image',
						items: [
							{
								xtype: 'fixedbutton',
								iconCls: 'trash',
								iconMask: true,
								ui: 'sirkobutton',
								action: 'delete-photo',
								disabled: true,
								hidden: true,
								style: {
									'position' : 'absolute',
									'top' : '5px',
									'right' : '5px'
								}
							}
						],
						margin: '5'
					},
					// {
					// 	xtype: 'panel',
					// 	xtype: 'panel',
					// 	layout: {
					// 		type: 'hbox',
					// 		align: 'center'
					// 	},
					// 	// margin: '5 0',
					// 	items: [
					// 		// {
					// 		// 	xtype:'fixedbutton',
					// 		// 	action: 'capture-photo',
					// 		// 	iconCls: 'photo1',
					// 		// 	iconMask: true,
					// 		// 	text: i10n.translate('tovisit.camerabutton'),
					// 		// 	ui: 'action',
					// 		// 	flex: 1,
					// 		// 	margin: '0 5 0 0'
					// 		// },
					// 		{
					// 			xtype: 'fixedbutton',
					// 			iconCls: 'delete',
					// 			iconMask: true,
					// 			ui: 'action',
					// 			action: 'delete-photo',
					// 			disabled: true
					// 		}
					// 	]
					// },
					{
						xtype: 'label',
						hidden: true,
						itemId: 'noMapHint',
						margin: '5',
						html: i10n.translate('tovisit.map.nogeodata')
					}
					
				]	
			}

		]
	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
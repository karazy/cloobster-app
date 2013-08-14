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
		padding: '20 15 8 15',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				items: [
					{
						xtype: 'backbutton'
					},
					{
						xtype: 'fixedbutton',
						iconCls: 'qrcode-icon',
						iconMask: true,
						ui: 'action',
						action: 'scan',
						align: 'right',
						hidden: true,
						flex: 1
					},		
					{
						xtype:'fixedbutton',
						action: 'capture-photo',
						iconCls: 'photo1',
						iconMask: true,
						align: 'right',
						ui: 'action',
						flex: 1
					},
					{
						xtype: 'fixedbutton',
						ui: 'action',
						action: 'create',
						align: 'right',
						iconCls: 'check2',
						iconMask: true,
						flex: 1
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
				defaults: {
					margin: '10 0 0 0'
				},
				items: [	
					{
						xtype: 'label',
						html: i10n.translate('tovisit.title.new'),
						itemId: 'titleLabel',
						style: {
							'font-size' : '1.6em'
						}
					},				
					{
						xtype: 'label',
						hidden: true,
						itemId: 'locationNameLabel',
						style: {
							'font-size' : '1.6em'
						}
					},
					{
						xtype: 'textfield',
						placeHolder: i10n.translate('tovisit.formnew.locationname'),
						name: 'locationName',
						cls: 'general-textfield',
					},					
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
					},
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
						        	text: i10n.translate('cancel')
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
							    flex: 3,
							    margin: '0 12 0 0'
							}							
						]
					},
					{
						xtype: 'textareafield',
						placeHolder: i10n.translate('tovisit.formnew.comment'),
						name: 'comment',
						cls: 'general-textfield',
						maxLength: 140,
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
						margin: '15 0 0 0'
					},
					{
						xtype: 'label',
						hidden: true,
						itemId: 'noMapHint',
						margin: '5 5 5 0',
						html: i10n.translate('tovisit.map.nogeodata')
					}					
				]	
			}

		]
	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
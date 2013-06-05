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
					},
					{
						xtype: 'fixedbutton',
						ui: 'action',
						action: 'create',
						align: 'right',
						iconCls: 'action',
						iconMask: true
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
						xtype: 'fixedbutton',
						text: i10n.translate('tovisit.scanbutton'),
						ui: 'action',
						action: 'scan',
						hidden: true,
						// margin: '5 0'
					},
					{
						xtype: 'label',
						hidden: true,
						itemId: 'locationNameLabel',
						margin: '5 7'
					},
					{
						xtype: 'textfield',
						placeHolder: i10n.translate('tovisit.formnew.locationname'),
						name: 'locationName',
						// margin: '5 0'
					},
					{
						xtype: 'textareafield',
						placeHolder: i10n.translate('tovisit.formnew.comment'),
						name: 'comment',
						// margin: '5 0'
					},
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
						},
						// margin: '5 0',
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
							        cancelButton: i10n.translate('cancel'),
							        doneButton: i10n.translate('ok'),
							        value: new Date()
							    },
							    flex: 1
							},
							{
								xtype: 'fixedbutton',
								iconCls: 'delete',
								iconMask: true,
								ui: 'action',
								action: 'delete-visitdate'
							}
						]
					},
					{
						xtype: 'label',
						hidden: true,
						itemId: 'image',
						// margin: '5 0'
					},
					{
						xtype: 'panel',
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
						},
						// margin: '5 0',
						items: [
							{
								xtype:'fixedbutton',
								action: 'capture-photo',
								iconCls: 'photo1',
								iconMask: true,
								text: i10n.translate('tovisit.camerabutton'),
								ui: 'action',
								flex: 1,
								margin: '0 5 0 0'
							},
							{
								xtype: 'fixedbutton',
								iconCls: 'delete',
								iconMask: true,
								ui: 'action',
								action: 'delete-photo',
								disabled: true
							}
						]
					},
					{
						xtype: 'label',
						hidden: true,
						itemId: 'noMapHint',
						// margin: '5 0',
						html: i10n.translate('tovisit.map.nogeodata')
					}
					
				]	
			}

		]
	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
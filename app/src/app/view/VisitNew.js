/**
* View for new custom visits, which don't belong to a cloobster location.
*/
Ext.define('EatSense.view.VisitNew', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.DatePicker'],
	xtype: 'visitnew',
	config: {
		layout: {
			type: 'fit'
		},
		//make panel stay on top!
		style: 'z-index: 5;',
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('visit.new.title'),
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
				items: [
					{
						xtype: 'fixedbutton',
						text: i10n.translate('tovisit.scanbutton'),
						ui: 'action',
						action: 'scan',
						hidden: true
					},
					{
						xtype: 'label',
						hidden: true,
						itemId: 'locationNameLabel'
					},
					{
						xtype: 'textfield',
						placeHolder: i10n.translate('tovisit.formnew.locationname'),
						name: 'locationName'
					},
					{
						xtype: 'textareafield',
						placeHolder: i10n.translate('tovisit.formnew.comment'),
						name: 'comment'
					},
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							align: 'center'
						},
						margin: '0 0 5 0',
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
						xtype: 'map',
						//retrieve location via phonegap
    					// useCurrentLocation: true,
    					mapOptions: {
							draggable: false,
							disableDefaultUI: true
						},
						height: '300px'
						// flex: 1
					}
				]	
			}

		]
	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
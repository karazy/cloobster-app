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
		//make login panel stay on top!
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
						xtype: 'datepickerfield',
						placeHolder: i10n.translate('tovisit.formnew.locationname'),
						name: 'visitDate'
					}
					// {
					// 	xtype: 'panel',
					// 	layout: {
					// 		type: 'hbox'
					// 	},
					// 	items: [
					// 		{
					// 			xtype: 'textfield',
					// 			placeHolder: i10n.translate('visit.formnew.visitdate'),
					// 			disabled: true,
					// 			flex: 2
					// 		},
					// 		{
					// 			xtype: 'fixedbutton',
					// 			iconCls: 'action',
					// 			iconMask: true,
					// 			flex: 1
					// 		}
					// 	]
					// // },
					// {
					// 	xtype: 'label',
					// 	// item
					// },
					// {
					// 	xtype: 'fixedbutton'
					// }
				]	
			}

		]
	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
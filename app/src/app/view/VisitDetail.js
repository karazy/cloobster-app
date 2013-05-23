/**
* Detail view for visits.
*/
Ext.define('EatSense.view.VisitDetail', {
	extend: 'Ext.Panel',
	requires: ['Ext.field.DatePicker'],
	xtype: 'visitdetail',
	config: {
		layout: {
			type: 'vbox'
		},
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('tovisit.detail.title'),
				docked: 'top',
				items: [
					{
						xtype: 'backbutton'
					}
				]
			},
			{
				xtype: 'panel',
				docked: 'top',
				layout: {
					type: 'hbox',
					align: 'stretch',
					pack: 'center'
				},
				margin: '5',
				items: [
					{
						xtype: 'fixedbutton',
						action: 'delete',
					    iconCls: 'trash',
					    iconMask: true,
					    text: i10n.translate('delete'),
					    ui: 'action',
					    margin: '0 5 0 5',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						action: 'edit',
						iconCls: 'compose',
						// iconAlign: 'right',
					    iconMask: true,
					    text: i10n.translate('edit'),
					    ui: 'action',
					    margin: '0 5 0 5',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						iconCls: 'action',
						// iconAlign: 'right',
					    iconMask: true,
					    text: i10n.translate('checkInButton'),
					    ui: 'action',
					    margin: '0 5 0 5',
					    flex: 1,
					    hidden: true
					}
				]
			},
			{
				xtype: 'label',
				itemId: 'content',
				padding: '5px 12px 0px',
				tpl: new Ext.XTemplate(
					'<div class="location">',
						'{locationName}',
					'</div>',
					'<div>',
						'{comment}',
					'</div>',
					{
						formatDate: function(date) {
							var format = appConstants.DateFormat[appConfig.language],
								html;

							html = '<div class="day">' + date.getDay() + '</div>'+
									'<div class="mmyy">' + i10n.translate('month.' + date.getMonth()) + '</div>' +
									'<div class="mmyy">' + date.getFullYear() + '</div>';
							return html;
							// return Ext.util.Format.date(date, format);
						}
					}
				)
			},
			{
				xtype: 'map',
				mapOptions: {
					draggable: false,
					disableDefaultUI: true
				},
				flex: 1
			}


		],

		/**
		* @cfg
		* The record displayed on this page. Must be of type @see{EatSense.model.Visit}
		*/
		record: null
	},

	/**
	* Uses record to render content.
	*/
	updateRecord: function(newRecord, oldRecord) {

	}
});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)
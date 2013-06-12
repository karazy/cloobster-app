/**
* Detail view for visits.
*/
Ext.define('EatSense.view.VisitDetail', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'visitdetail',
	config: {
		layout: {
			type: 'vbox',
			align: 'stretch',
			pack: 'start'
		},
		scrollable: 'vertical',
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
					    // text: i10n.translate('delete'),
					    ui: 'sirkobutton',
					    margin: '0 5 0 5',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						action: 'edit',
						iconCls: 'compose',
						// iconAlign: 'right',
					    iconMask: true,
					    // text: i10n.translate('edit'),
					    ui: 'sirkobutton',
					    margin: '0 5 0 5',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						iconCls: 'qrcode-icon',
						iconAlign: 'right',
					    iconMask: true,
					    text: i10n.translate('checkInButton'),
					    ui: 'sirkobutton',
					    margin: '0 5 0 5',
					    flex: 2,
					    hidden: true
					}
				]
			},		
			{
				xtype: 'panel',
				itemId: 'content',
				margin: '5 10',
				cls: 'tovisit-detail',
				tpl: new Ext.XTemplate(
					'<div>',						
						'<div>',
							'<tpl if="imageUrl">',
								// '<div class="thumbnail" style="background-image: url(\'http://robohash.org/FRED\')"></div>',
								'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',
							'</tpl>',
							'<div class="location content-box">',
								'{locationName}',							
							'</div>',
						'</div>',						
						'<tpl if="visitDate">',
							'<div style="margin: 5px 0px 10px 0px;">',
								'<div class="date content-box">{[this.formatDate(values.visitDate)]}</div>',
								'<div>',
									i10n.translate('tovisit.date.description'),
								'</div>',
							'</div>',
						'</tpl>',
						'<tpl if="comment">',
							'<div class="comment content-box">',
								'{comment}',
							'</div>',
						'</tpl>',
						'<tpl if="locationCity">',
							'<div>',
								'<div class="address">{locationCity}</div>',
							'</div>',
						'</tpl>',
					'</div>',
					{
						formatDate: function(date) {
							var format = appConstants.DateFormat[appConfig.language],
								html;
							var format = appConstants.DateFormat[appConfig.language];
							return Ext.util.Format.date(date, format);
						}
					}
				)
			},
			{
				xtype: 'label',
				hidden: true,
				itemId: 'image',
				margin: '5 10'
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
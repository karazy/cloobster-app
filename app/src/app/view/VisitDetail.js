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
					    ui: 'action',
					    margin: '0 5 0 0',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						action: 'edit',
						iconCls: 'compose',
						// iconAlign: 'right',
					    iconMask: true,
					    // text: i10n.translate('edit'),
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
					    // text: i10n.translate('checkInButton'),
					    ui: 'action',
					    margin: '0 0 0 5',
					    flex: 1,
					    hidden: true
					}
				]
			},		
			{
				xtype: 'panel',
				itemId: 'content',
				margin: '0 5',
				cls: 'tovisit-detail',
				tpl: new Ext.XTemplate(
					'<div>',
						'<tpl if="imageUrl">',
							'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',
						'</tpl>',
						'<div class="location">',
							'{locationName}',
						'</div>',
						'<div class="comment">',
							'{comment}',
						'</div>',
						'<tpl if="visitDate">',
							'<div>',
								'<div class="date">{[this.formatDate(values.visitDate)]}</div>',
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
				margin: '0 5'
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
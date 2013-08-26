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
		padding: '20 30 8 30',
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
						action: 'delete',
					    iconCls: 'trash',
					    iconMask: true,
					    ui: 'action',
					    align: 'right'
					},
					{
						xtype: 'fixedbutton',
						action: 'edit',
						iconCls: 'compose',
						align: 'right',
					    iconMask: true,
					    ui: 'action'
					}
				]
			},		
			{
				xtype: 'panel',
				itemId: 'content',
				cls: 'tovisit-detail',
				tpl: new Ext.XTemplate(					
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
							'<div style="margin: 5px 0px 15px 0px; clear: both;">',
								'<div class="date content-box">{[this.formatDate(values.visitDate)]}</div>',
								'<div>',
									i10n.translate('tovisit.date.description'),
								'</div>',
							'</div>',
						'</tpl>',
						'<tpl if="locationCity">',
							'<div class="content-box">',
								'<div class="address">{locationCity}</div>',
							'</div>',
						'</tpl>',
						'<tpl if="comment">',
							'<div class="comment content-box">',
								'{comment}',
							'</div>',
						'</tpl>',						
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
				xtype: 'panel',
				layout: {
					type: 'hbox',
					align: 'center'
				},
				margin: '5 0 0 0',
				items: [					
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						// iconCls: 'qrcode-icon',
						// iconCls: 'favorites',
						align: 'right',
					    text: i10n.translate('tovisit.detail.sneakinbutton'),
					    ui: 'action',
					    margin: '0 5 0 0',
					    flex: 1
					    // hidden: true
					},
					{
						xtype: 'fixedbutton',
						iconCls: 'qrcode-icon',
						iconMask: true,
						ui: 'action',
						action: 'scan',
						align: 'right',
						margin: '0 0 0 5'
					}
				]
			},			
			{
				xtype: 'label',
				hidden: true,
				itemId: 'image',
				margin: '5 0 0 0'
			}

		]
	}
});
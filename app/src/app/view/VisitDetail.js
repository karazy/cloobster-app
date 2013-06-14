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
				// title: i10n.translate('tovisit.detail.title'),
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
					    align: 'right',
					},
					{
						xtype: 'fixedbutton',
						action: 'edit',
						iconCls: 'compose',
						align: 'right',
					    iconMask: true,
					    ui: 'action'
					},
					{
						xtype: 'fixedbutton',
						iconCls: 'qrcode-icon',
						iconMask: true,
						ui: 'action',
						action: 'scan',
						align: 'right',
						flex: 1
						// margin: '0 5 0 2'
					},	
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						// iconCls: 'qrcode-icon',
						// iconCls: 'favorites',
						align: 'right',
					    text: i10n.translate('tovisit.detail.sneakinbutton'),
					    ui: 'action',
					    hidden: true
					}
				]
			},		
			{
				xtype: 'panel',
				itemId: 'content',
				margin: '30 15 5 15',
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
							'<div style="margin: 5px 0px 15px 0px;">',
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
				margin: '5 24'
			}

		]
	}
});
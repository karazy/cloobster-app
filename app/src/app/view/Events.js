Ext.define('EatSense.view.Events',{
	extend: 'Ext.Panel',
	requires: ['Ext.plugin.ListPaging'],
	xtype: 'events',				
	config: {
		layout: 'fit',
		items: [
		{
			docked : 'top',
			xtype : 'titlebar',			
			title : i10n.translate('events.title'),
			items : [
				{
					xtype : 'homebutton'
				}
			]
		},
		{
			xtype: 'list',
			store: 'ztixEventsStore',
			cls: 'event-item',			
			itemTpl: new Ext.XTemplate(
				'<table style="width:100%;">',					
					'<td align="left" style="vertical-align: top;">',
						// '<tpl if="imageUrl">',
						// 	'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',							
						// '<tpl elseif="values.image && values.image.url">',
						// 	'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s128\')"></div>',
						// '</tpl>',
						'<div>',
							// '<tpl if="locationId">',
							// 	'<div class="cloobster-location"></div>',
							// '</tpl>',
							'<div class="location">',
								'{title}',
							'</div>',
							'<tpl if="location">',
								'<div class="location-city">',
									'{location}',
								'</div>',
							'</tpl>',
						'</div>',
					'</td>',
					'<tpl if="date">',
						'<td align="right">',
							'{[this.formatDate(values.visitDate)]}',
						'</td>',
					'</tpl>',					
				'</table>'
				,
				{
					formatPrice: function(price) {
						return appHelper.formatPrice(price);
					},
					formatDate: function(date) {
						var format = appConstants.DateFormat[appConfig.language];
						return Ext.util.Format.date(date, format);
					}
				}
			),
			plugins: [
		        {
		            xclass: 'Ext.plugin.ListPaging',
		            loadMoreText: i10n.translate('history.detail.list.paging'),
		            autoPaging: true
		        }
		    ]
		}
		]

	}
	
});
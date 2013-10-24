/**
* View shows a List of {@link EatSense.model.ZtixEvent}.
*/
Ext.define('EatSense.view.ZtixEvents',{
	extend: 'Ext.dataview.List',
	requires: ['Ext.plugin.ListPaging', 'Ext.plugin.PullRefresh'],
	xtype: 'ztixevents',				
	config: {
		store: 'ztixEventsStore',
		cls: 'event-item',
		scollToTopOnRefresh: true,
		emptyText: i10n.translate('de.ztix.events.empty'),
		itemTpl: new Ext.XTemplate(
			'<table style="width:100%;">',					
				'<td align="left" style="vertical-align: top;">',
					'<tpl if="infpic">',
						'<div class="thumbnail" style="background-image: url(\'{[values.infpic]}\')"></div>',
					'<tpl else>',
						'<div class="thumbnail" style="background-image: url(\'res/images/empty_list_image.png\')"></div>',
					'</tpl>',
					'<div>',
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
						'{[this.formatDate(values.date)]}',
					'</td>',
				'</tpl>',					
			'</table>'
			,
			{
				formatPrice: function(price) {
					return appHelper.formatPrice(price);
				},
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language],
						shortYear,
						html;

					shortYear = date.getFullYear().toString().substring(2,4);

					html =  '<div class="date">' +
							'<div class="day">' + date.getDate() + '</div>'+
							'<div class="mmyy">' + 
								appHelper.shorten(i10n.translate('month.' + date.getMonth()), 3) + ' ' + 
								shortYear +
							'</div>';
					return html;
				}
			}
		),
		plugins: [
	        // {
	        //     xclass: 'Ext.plugin.ListPaging',
	        //     loadMoreText: i10n.translate('history.detail.list.paging'),
	        //     autoPaging: false
	        // },
	        // {
	        //     xclass: 'Ext.plugin.PullRefresh',
	        //     pullRefreshText: i10n.translate('pullrefresh'),
	        //     releaseRefreshText: i10n.translate('releaserefreshtext')
	        // }
	    ],
	    listeners: {
			select : function(dv, index, target, record, e, eOpts) {					
				Ext.defer((function() {
					dv.deselectAll();
				}), 1000, this);					
			}
		},
		items: [
			{
				docked : 'top',
				xtype : 'titlebar',			
				// title : i10n.translate('de.ztix.events.title'),
				items : [
					{
						xtype : 'homebutton'
					},
					{
						xtype: 'fixedbutton',
						action: 'prev-month',
						ui: 'action',
						iconCls: 'arrow_left',
						iconMask: true,
						align: 'right',
						hidden: true
					},
					{
						xtype: 'fixedbutton',
						action: 'next-month',
						ui: 'action',
						align: 'right',
						iconCls: 'arrow_right',
						iconMask: true
					}
				]
			}
		]

	}
	
});
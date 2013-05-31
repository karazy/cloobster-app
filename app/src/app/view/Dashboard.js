/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.Dashboard', {
	extend : 'Ext.Panel',
	xtype : 'dashboard',
	requires: ['Ext.Img'],
	config : {
		layout: {
				type: 'fit'
		},
		padding: '25 8 30',
		cls: 'dashboard',		
		items : [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'dashboard-header',
			title: '<img src="res/images/dashboard/Logo_cloobster_weiss.png" height="30px" width="auto" style="margin-top: 8px;">'
		},
		{
			xtype: 'panel',
			layout: {
				type: 'hbox',
				align: 'start'
				// pack: 'center',
			},
			docked: 'top',
			padding: 5,
			items: [
				{
					xtype : 'fixedbutton',
					action: 'tovisit',
					text: i10n.translate('dashboard.button.tovisit'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-history',
					iconCls: 'dashboard-button-icon',
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '0 3 0 0'
				},
				{
					xtype : 'fixedbutton',
					action: 'checkin',
					html: i10n.translate('dashboard.button.checkin'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-checkin',
					iconCls: 'dashboard-button-icon',			
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '0 0 0 3'
				}	
			]
		},
		{
			xtype: 'list',
			store: 'visitStore',
			emptyText: i10n.translate('tovisit.list.emptytext'),
			deferEmptyText: false,
			// grouped: true,
			itemCls: 'tovisit-item',
			itemTpl: new Ext.XTemplate(
				"<table style='width:100%;'>",					
					'<td align="left" style="vertical-align: top;">',
						// '<div class="thumbnail" style="background-image: url(http://robohash.org/FRED)"></div>',
						'<tpl if="imageUrl">',
							'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',							
						'<tpl elseif="image">',
							'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s128\')"></div>',
						'</tpl>',
						'<div>',
							'<div class="location">',
								'{locationName}',
							'</div>',
							'<tpl if="locationCity">',
								'<div class="location-city">',
									'{locationCity}',
								'</div>',
							'</tpl>',
						'</div>',
					'</td>',
					'<tpl if="visitDate">',
						'<td align="right">',
							'{[this.formatDate(values.visitDate)]}',
						'</td>',
					'</tpl>',					
				'</table>',
				'<tpl if="locationId">',
					'<div class="cloobster-location"></div>',
				'</tpl>'
				, {
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language],
						staleDate = (date < new Date()) ? ' stale' : '',
						html;

					html =  '<div class="date' + staleDate +'">' +
							'<div class="day">' + date.getDate() + '</div>'+
							'<div class="mmyy">' + i10n.translate('month.' + date.getMonth()) + '</div>' +
							'<div class="mmyy">' + date.getFullYear() + '</div></div>';
					return html;
				}
			}),			
			listeners: {
				select: function(dv, ix, item, e) {
					Ext.defer((function() {
						dv.deselect(ix);
	    			}), 100, this);					
				}
			},
			plugins: [
		        {
		            xclass: 'Ext.plugin.ListPaging',
		            loadMoreText: i10n.translate('history.detail.list.paging'),
		            autoPaging: false
		        }
		    ]
		}			
		// {
		// 	xtype: 'fixedbutton',
		// 	ui: 'action',
		// 	action: 'demo-checkin',
		// 	text: i10n.translate('dashboard.button.demo'),
		// 	baseCls: 'dashboard-button',
		// 	cls: 'dashboard-button-demo',
		// 	iconCls: 'dashboard-button-icon',
		// 	pressedCls: 'dashboard-button-pressed',
		// 	labelCls: 'dashboard-button-label',
		// 	flex: 2
		// }
		]
	},
	showLoadScreen : function(mask) {
		if (mask) {
			this.setMasked({
				message : i10n.translate('loadingMsg'),
				xtype : 'loadmask'
			});
		} else {
			this.setMasked(false);
		}
	}
});

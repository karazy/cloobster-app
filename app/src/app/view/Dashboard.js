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
			},
			docked: 'top',
			padding: 5,
			margin: '0 0 10 0',
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
					margin: '10 3 0 4'
				},
				{
					xtype : 'fixedbutton',
					action: 'checkin',
					html: i10n.translate('dashboard.button.checkin'),
					baseCls: 'dashboard-button',
					cls: ['dashboard-button-checkin', 'right'],
					iconCls: 'dashboard-button-icon',			
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '10 4 0 3'
				}	
			]
		},
		{
			xtype: 'list',
			store: 'visitStore',
			emptyText: '<div class="welcome-text">' + i10n.translate('tovisit.list.emptytext') + '</div>',
			deferEmptyText: false,
			// grouped: true,
			itemCls: 'tovisit-item',
			itemTpl: new Ext.XTemplate(
				"<table style='width:100%;'>",					
					'<td align="left" style="vertical-align: top;">',
						//Dummy
						// '<div class="thumbnail" style="background-image: url(http://robohash.org/FRED); background-color: blue;"></div>',
						'<tpl if="imageUrl">',
							'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',							
						'<tpl elseif="values.image && values.image.url">',
							'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s128\')"></div>',
						'</tpl>',
						'<div>',
							'<tpl if="locationId">',
								'<div class="cloobster-location"></div>',
							'</tpl>',
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
				'</table>'				
				, {
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language],
						compareDate = new Date(),
						staleDate,
						shortYear,
						html;

					compareDate.setHours(0,0,0,0);
					staleDate = (date < compareDate) ? ' stale' : '';
					shortYear = date.getFullYear().toString().substring(2,4);

					html =  '<div class="date' + staleDate +'">' +
							'<div class="day">' + date.getDate() + '</div>'+
							'<div class="mmyy">' + 
								appHelper.shorten(i10n.translate('month.' + date.getMonth()), 3) + ' ' + 
								shortYear +
							'</div>';
					return html;
				}
			}),			
			listeners: {
				select: function(dv, ix, item, e) {
					Ext.defer((function() {
						dv.deselect(ix);
	    			}), 100, this);					
				}
			}
			// plugins: [
		 //        {
		 //            xclass: 'Ext.plugin.ListPaging',
		 //            loadMoreText: i10n.translate('history.detail.list.paging'),
		 //            autoPaging: false
		 //        }
		 //    ]
		}
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

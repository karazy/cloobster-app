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
			xtype: 'toolbar',
			docked: 'top',
			cls: 'dashboard-header',
			html: '<img src="res/images/dashboard/logo_frizz.png">'+
					'<div>Darmstadt</div>'
		},
		{
			xtype: 'panel',
			layout: {
				type: 'hbox',
				align: 'start'
			},
			docked: 'bottom',
			// padding: 10,
			margin: '0 0 8 0',
			items: [
				// {
				// 	xtype : 'fixedbutton',
				// 	action: 'tovisit',
				// 	text: i10n.translate('dashboard.button.tovisit'),
				// 	baseCls: 'dashboard-button',
				// 	cls: 'dashboard-button-history',
				// 	// iconCls: 'dashboard-button-icon',
				// 	pressedCls: 'dashboard-button-pressed',
				// 	labelCls: 'dashboard-button-label',
				// 	flex: 1,
				// 	margin: '7 7 0 30'
				// },
				{
					xtype : 'fixedbutton',
					action: 'checkin',
					html: i10n.translate('dashboard.button.checkin'),
					baseCls: 'dashboard-button',
					cls: ['dashboard-button-checkin', 'right'],
					// iconCls: 'dashboard-button-icon',			
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '7 7 0 30'
					// margin: '7 7 0 7'
				},
				{
					xtype : 'fixedbutton',
					action: 'show-locationsearch',
					html: i10n.translate('dashboard.button.geosearch'),
					baseCls: 'dashboard-button',
					cls: ['dashboard-button-checkin', 'right'],
					// iconCls: 'dashboard-button-icon',			
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '7 30 0 7'
				}
			]
		},
		{
			xtype: 'list',
			store: 'visitStore',
			emptyText: '<div class="welcome-text">' + i10n.translate('tovisit.list.emptytext') + '</div>',
			deferEmptyText: false,
			loadingText: i10n.translate('loadingMsg'),			
			itemCls: 'tovisit-item',
			itemTpl: new Ext.XTemplate(
				'<tpl if="imageUrl">',
					'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s256\')"></div>',
				'<tpl elseif="values.image && values.image.url">',
					'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s256\')"></div>',
				'</tpl>',				
				'<div class="content">',
					'<div class="location">',
						'{locationName}',
					'</div>',
					'<tpl if="locationCity">',
						'<div class="location-city">',
							'{locationCity}',
						'</div>',
					'</tpl>',
				'</div>'
				),			
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
		 //            // loadMoreText: i10n.translate('history.detail.list.paging'),
		 //            loadMoreText: '',
		 //            // noMoreRecordsText : 'Alles geladen',
		 //            // bottom: 0,
		 //            autoPaging: true
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

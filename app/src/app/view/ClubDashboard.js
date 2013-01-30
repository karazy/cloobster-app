/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.BasicButton', 'EatSense.view.components.TileButton',
		'EatSense.view.components.BasicTileButton', 'EatSense.view.components.DashboardTeaser'],
	config : {
		layout : {
			type : 'fit'
		},
		items : [
		{
			xtype : 'panel',
			itemId: 'header',
			html: '<img class="header" src="res/images/dashboard/header-bg.png" />',
			cls: 'club-dashboard-header',
			docked: 'top',
			layout: 'fit',
			items: [
				{
					xtype: 'fixedbutton',
					ui: 'action',
					action: 'toggle-navigation',
					iconMask: true,
					iconCls: 'more',
					top: 10,
					left: 10,
					cls: 'slidenavigation-button'
				},
				{
						xtype: 'fixedbutton',
						ui: 'action',
						action: 'fb-wallpost',
						baseCls: 'fb-wimpel-button',
						pressedCls: 'fb-wimpel-button-pressed',
						top: 0,
						right: 15
				}				
			]
		},
		{
			xtype: 'panel',
			width: '100%',
			itemId: 'tilePanel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'start'
			},
			padding: '0 8 12 8',
			scrollable: 'vertical',
			items: [
				{
					xtype: 'label',
					itemId: 'description',
					cls: 'club-dashboard-description',
					style: 'text-align: center;',
					html: i10n.translate('clubdashboard.label.description')
				},
				{
					xtype: 'panel',
					width: '100%',
					layout: {
						type: 'hbox',
						align: 'start',
						pack: 'center'
					},					
					// scrollable: 'vertical',
					padding: '5px 0 0 0',			
					items: [
					{
						xtype: 'panel',
						flex: 1,
						padding: '0 4 0 0',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [
						{
							xtype : 'tilebutton',
							action: 'show-infopage',
							title: i10n.translate('clubdashboard.button.infopage'),
							text: i10n.translate('clubdashboard.button.infopage.text'),
							iconCls: 'info'
						},
						{
							xtype : 'basictilebutton',
							action: 'show-requests',
							title: i10n.translate('clubdashboard.button.vip'),
							text: i10n.translate('clubdashboard.button.vip.text'),
							iconCls: 'vip',
							welcomeFn: function() {
								Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
							}
						},
						{
							xtype : 'dashboardteaser',
							type: 'info',
							store : 'infopageStore',
							iconFit: true,
							tpl: new Ext.XTemplate(
								'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
								'<div class="text-container">'+
									'<h3>{title}</h3>'+
									'<p>{shortText}</p>'+
								'</div>'+
								'<div class="teaser-icon info-icon"></div>'
							)
						}											
						]
					},
					{
						xtype: 'panel',
						flex: 1,
						padding: '0 0 0 4',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [
							{
								xtype : 'tilebutton',
								action: 'show-menu',
								text: i10n.translate('clubdashboard.menu.text'),
								title: i10n.translate('menuTab'),
								iconCls: 'menu'
							},
							{
								xtype : 'dashboardteaser',
								store : 'productStore',
								type: 'product',
								tpl: new Ext.XTemplate(
									'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
									'<div class="text-container">'+
										'<h3>{name}</h3>'+
										'<p>{shortDesc}</p>'+									
									'</div>'+
									'<div class="teaser-icon star-icon"></div>'
								)
							},	
							{
								xtype : 'dashboardteaser',
								store : 'menuStore.productsStore',
								type: 'product',
								tpl: new Ext.XTemplate(
									'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
									'<div class="text-container">'+
										'<h3>{name}</h3>'+
										'<p>{shortDesc}</p>'+
									'</div>'+
									'<div class="teaser-icon menu-icon"></div>'
								)
							},				
							{
								xtype : 'basictilebutton',
								action: 'show-feedback',
								title: i10n.translate('clubdashboard.button.feedback'),
								text: i10n.translate('clubdashboard.button.feedback.text'),
								iconCls: 'feedback',
								welcomeFn: function() {
									Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
								}
							}	
						]
					}
			]
		}
			]
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

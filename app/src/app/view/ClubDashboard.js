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
		// layout: {
		// 	type: 'vbox',
		// 	align: 'center',
		// 	pack: 'center'
		// },		
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
						action: 'fb-wallpost',
						baseCls: 'fb-wimpel-button',
						pressedCls: 'fb-wimpel-button-pressed',
						top: 0,
						right: 15
				}				
			]
		},
		{
			xtype: 'label',
			itemId: 'description',
			cls: 'club-dashboard-description',
			docked: 'top',
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
			scrollable: 'vertical',
			padding: '10 0 0 0',
			items: [
			{
				xtype: 'panel',
				flex: 1,
				layout: {
					type: 'vbox',
					align: 'center',
					pack: 'center'
				},
				defaults: {
					width: '90%'
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
					tpl: new Ext.XTemplate(
					'<div class="">'+
						'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s720\')"></div></tpl>'+
						'<div class="text-container">'+
							'<h3>{title}</h3>'+
							'<p>{shortText}</p>'+
						'</div>'+
						'<div class="teaser-icon info-icon"></div>'+
					'</div>'
					)
				}											
				]
			},
			{
				xtype: 'panel',
				flex: 1,
				layout: {
					type: 'vbox',
					align: 'center',
					pack: 'center'
				},
				defaults: {
					width: '90%'
				},
				items: [
					{
						xtype : 'tilebutton',
						action: 'show-menu',
						text: i10n.translate('clubdashboard.menu.text'),
						title: i10n.translate('menuTab'),
						iconCls: 'menu',
						expandIcon: true
					},
					{
						xtype : 'dashboardteaser',
						store : 'productStore',
						type: 'product',
						tpl: new Ext.XTemplate(
							'<div class="">'+
								'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s720\')"></div></tpl>'+
								'<div class="text-container">'+
									'<h3>{name}</h3>'+
									'<p>{shortDesc}</p>'+									
								'</div>'+
								'<div class="teaser-icon menu-icon"></div>'+
								'<div class="special-icon"></div>'+
							'</div>'
						)
					},	
					{
						xtype : 'dashboardteaser',
						store : 'menuStore.productsStore',
						type: 'product',
						tpl: new Ext.XTemplate(
							'<div class="">'+
								'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s720\')"></div></tpl>'+
								'<div class="text-container">'+
									'<h3>{name}</h3>'+
									'<p>{shortDesc}</p>'+
								'</div>'+
								'<div class="teaser-icon menu-icon"></div>'+
							'</div>'
						)
					},				
					{
						xtype : 'basictilebutton',
						action: 'show-feedback',
						title: i10n.translate('clubdashboard.button.feedback'),
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

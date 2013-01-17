/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.BasicButton', 'EatSense.view.components.InfoPageTeaser', 'EatSense.view.components.TileButton'],
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
					xtype : 'tilebutton',
					action: 'show-requests',
					title: i10n.translate('clubdashboard.button.vip'),
					text: i10n.translate('clubdashboard.button.vip.text'),
					iconCls: 'vip',
					welcomeFn: function() {
						Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
					}
				},
				{
					xtype : 'infopageteaser',
					pageStore : 'infopageStore'
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
						// baseCls: 'club-dashboard-button',
						// cls: 'club-dashboard-button-menu',
						// pressedCls: 'club-dashboard-button-pressed',
						// labelCls: 'club-dashboard-button-label',
						// badgeCls: 'club-dashboard-button-badge'
					},	
					{
						xtype : 'tilebutton',
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

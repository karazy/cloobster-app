/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.DashboardButton'],
	config : {
		layout : {
			type : 'fit'
		},
		cls: 'club-dashboard',
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
						xtype: 'button',
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
				type: 'vbox',
				align: 'center',
				pack: 'center'
			},
			padding: '10 0 0 0',
			items: [
			{
				xtype: 'panel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'center',
					pack: 'center'
				},
				items: [
				{
					xtype : 'button',
					action: 'show-menu',
					text: i10n.translate('menuTab'),
					baseCls: 'club-dashboard-button',
					cls: 'club-dashboard-button-menu',
					pressedCls: 'club-dashboard-button-pressed',
					labelCls: 'club-dashboard-button-label',
					badgeCls: 'club-dashboard-button-badge'
				},
				{
						xtype : 'button',
						action: 'show-infopage',
						text: i10n.translate('clubdashboard.button.infopage'),
						baseCls: 'club-dashboard-button',
						cls: 'club-dashboard-button-infopage',
						pressedCls: 'club-dashboard-button-pressed',
						labelCls: 'club-dashboard-button-label'
				}							
				]
			},
			{
				xtype: 'panel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'center',
					pack: 'center'
				},
				items: [
					{
						xtype : 'basicbutton',
						action: 'show-requests',
						text: i10n.translate('clubdashboard.button.vip'),
						// baseCls: 'club-dashboard-button',
						cls: 'club-dashboard-button-vip',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
						// pressedCls: 'club-dashboard-button-pressed',
						// labelCls: 'club-dashboard-button-label'
					},
					{
						xtype : 'basicbutton',
						action: 'show-feedback',
						text: i10n.translate('clubdashboard.button.feedback'),
						baseCls: 'club-dashboard-button',
						cls: 'club-dashboard-button-feedback',
						pressedCls: 'club-dashboard-button-pressed',
						labelCls: 'club-dashboard-button-label',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
					}					
					// {
					// 	xtype : 'button',
					// 	action: 'exit',
					// 	text: i10n.translate('clubdashboard.button.exit'),
					// 	baseCls: 'club-dashboard-button',
					// 	cls: 'club-dashboard-button-exit',
					// 	pressedCls: 'club-dashboard-button-pressed',
					// 	labelCls: 'club-dashboard-button-label'
					// }
					// {
					// 	xtype : 'button',
					// 	action: 'show-info',
					// 	text: i10n.translate('clubdashboard.button.info'),
					// 	baseCls: 'club-dashboard-button',
					// 	cls: 'club-dashboard-button-info',
					// 	pressedCls: 'club-dashboard-button-pressed',
					// 	labelCls: 'club-dashboard-button-label',
					// 	badgeCls: 'club-dashboard-button-badge',
					// },
					// {
					// 	xtype : 'button',
					// 	action: 'show-events',
					// 	text: i10n.translate('clubdashboard.button.events'),
					// 	baseCls: 'club-dashboard-button',
					// 	cls: 'club-dashboard-button-events',
					// 	pressedCls: 'club-dashboard-button-pressed',
					// 	labelCls: 'club-dashboard-button-label'
					// },
					// {
					// 	xtype : 'button',
					// 	action: 'show-aroundme',
					// 	text: i10n.translate('clubdashboard.button.aroundme'),
					// 	baseCls: 'club-dashboard-button',
					// 	cls: 'club-dashboard-button-aroundme',
					// 	pressedCls: 'club-dashboard-button-pressed',
					// 	labelCls: 'club-dashboard-button-label'
					// }
				]
			}
			// {
			// 	xtype: 'panel',
			// 	width: '100%',
			// 	layout: {
			// 		type: 'hbox',
			// 		align: 'center',
			// 		pack: 'center'
			// 	},
			// 	items: [
			// 		{
			// 			xtype : 'spacer',
			// 		},
			// 		{
			// 			xtype : 'button',
			// 			action: 'exit',
			// 			text: i10n.translate('clubdashboard.button.exit'),
			// 			baseCls: 'club-dashboard-button',
			// 			cls: 'club-dashboard-button-exit',
			// 			pressedCls: 'club-dashboard-button-pressed',
			// 			labelCls: 'club-dashboard-button-label'
			// 		},
			// 		{
			// 			xtype : 'spacer',
			// 		}
			// 	]
			// }
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

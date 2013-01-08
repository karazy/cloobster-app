/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.BasicButton', 'EatSense.view.components.InfoPageTeaser'],
	config : {
		layout : {
			type : 'fit'
		},
		// cls: 'club-dashboard',
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
					xtype : 'fixedbutton',
					action: 'show-menu',
					text: i10n.translate('menuTab'),
					baseCls: 'club-dashboard-button',
					cls: 'club-dashboard-button-menu',
					pressedCls: 'club-dashboard-button-pressed',
					labelCls: 'club-dashboard-button-label',
					badgeCls: 'club-dashboard-button-badge'
				},
				{
					xtype : 'fixedbutton',
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
						baseCls: 'club-dashboard-button',
						pressedCls: 'club-dashboard-button-pressed',
						labelCls: 'club-dashboard-button-label',
						cls: 'club-dashboard-button-vip',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
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
				]
			},

			//InfoPageTeaser start
			{
				xtype: 'panel',
				width: '100%',
				layout: {
					type: 'hbox',
					align: 'center',
					pack: 'center'
				},
				// margin: '10 0 0 0',
				items: [
					{
						xtype : 'infopageteaser',
						hidden: true,
						pageStore : 'infopageStore'
					}
				]
			}

			//InfoPageTeaser end
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

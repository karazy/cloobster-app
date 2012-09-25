/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',
	xtype : 'clubdashboard',
	requires: ['Ext.Img'],
	config : {
		layout : {
			type : 'fit'
		},
		cls: 'club-dashboard',
		items : [
		{
			xtype : 'panel',
			html: '<img src="res/images/dashboard/header-bg.png" />',
			cls: 'club-dashboard-header',
			docked: 'top',
			layout: 'fit'
		},		
		{
			xtype: 'label',
			cls: 'dashboard-description',
			docked: 'top',
			style: 'text-align: center;',
			html: i10n.translate('club.dashboard.label.description')
		},
		{
			xtype: 'panel',
			width: '100%',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'center'
			},
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
					action: 'checkin',
					text: i10n.translate('dashboard.button.checkin'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-checkin',
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label'
				},
				{
					xtype : 'button',
					action: 'history',
					text: i10n.translate('dashboard.button.history'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-history',
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label'
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
						xtype : 'button',
						action: 'facebook',
						text: 'Facebook',
						baseCls: 'dashboard-button',
						cls: 'dashboard-button-facebook',
						pressedCls: 'dashboard-button-pressed',
						labelCls: 'dashboard-button-label',
						badgeCls: 'dashboard-button-badge',
						badgeText: i10n.translate('general.comingsoon'),
						disabled: true
					},
					{
						xtype : 'button',
						action: 'login',
						text: 'Login',
						baseCls: 'dashboard-button',
						cls: 'dashboard-button-login',
						pressedCls: 'dashboard-button-pressed',
						labelCls: 'dashboard-button-label'
					},
					{
						xtype : 'button',
						action: 'logout',
						text: 'Logout',
						hidden: true,
						baseCls: 'dashboard-button',
						cls: 'dashboard-button-login',
						pressedCls: 'dashboard-button-pressed',
						labelCls: 'dashboard-button-label'
					}
				]
			}
			]
		},
		{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
			{
				xtype: 'spacer'
			},
			{
			xtype: 'button',
			action: 'about',
			iconCls: 'about',
			iconMask: true,
			styleHtmlContent: true,
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
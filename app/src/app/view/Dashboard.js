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
				type: 'vbox',
				align: 'center',
				pack: 'center'
		},
		cls: 'dashboard',		
		items : [
		{
			xtype : 'panel',
			html: '<img src="res/images/dashboard/header-bg.png" />',
			cls: 'dashboard-header',
			docked: 'top',
			layout: 'fit',
			items: [
				{
					xtype: 'fixedbutton',
					ui: 'action',
					action: 'demo-checkin',
					baseCls: 'demo-wimpel-button',
					pressedCls: 'demo-wimpel-button-pressed',
					top: 0,
					right: 15
				}
			]
		},		
		{
			xtype: 'label',
			cls: 'dashboard-description',
			docked: 'top',
			style: 'text-align: center;',
			html: i10n.translate('dashboardLabel1')
		},
		{
			xtype : 'fixedbutton',
			action: 'checkin',
			html: i10n.translate('dashboard.button.checkin'),
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-checkin',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label'
		},
		{
			xtype : 'fixedbutton',
			action: 'history',
			text: i10n.translate('dashboard.button.history'),
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-history',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label'
		},
		{
			xtype : 'fixedbutton',
			action: 'show-login',
			text: i10n.translate('dashboard.button.settings'),
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-login',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label'
		},
		{
			xtype : 'fixedbutton',
			action: 'profile',
			text: i10n.translate('dashboard.button.settings'),
			hidden: true,
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-login',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label'
		},
		{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
				{
					xtype: 'spacer'
				},
				{
					xtype: 'fixedbutton',
					action: 'about',
					iconCls: 'about',
					iconMask: true,
					styleHtmlContent: true
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

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
				align: 'stretch',
				pack: 'center'
		},
		padding: '20 10 30',
		cls: 'dashboard',		
		items : [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'dashboard-header',
			title: '<img src="res/images/dashboard/Logo_cloobster_weiss.png" height="47px" width="auto">',
			items: [
				{
					xtype: 'fixedbutton',
					action: 'about',
					iconCls: 'about',
					iconMask: true,
					// styleHtmlContent: true,
					align: 'left'
				},
				{
					xtype : 'fixedbutton',
					action: 'show-login',
					// text: i10n.translate('dashboard.button.settings'),
					iconCls: 'settings',
					iconMask: true,
					align: 'right'
				},
				{
					xtype : 'fixedbutton',
					action: 'profile',
					// text: i10n.translate('dashboard.button.settings'),
					hidden: true,
					iconCls: 'user',
					iconMask: true,
					align: 'right'
				}
			]
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
			flex: 1
		},
		{
			xtype : 'fixedbutton',
			action: 'history',
			text: i10n.translate('dashboard.button.history'),
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-history',
			iconCls: 'dashboard-button-icon',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label',
			flex: 1
		},
		{
			xtype: 'fixedbutton',
			ui: 'action',
			action: 'demo-checkin',
			text: i10n.translate('dashboard.button.demo'),
			baseCls: 'dashboard-button',
			cls: 'dashboard-button-demo',
			iconCls: 'dashboard-button-icon',
			pressedCls: 'dashboard-button-pressed',
			labelCls: 'dashboard-button-label',
			flex: 1
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

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
		padding: '25 8 30',
		cls: 'dashboard',		
		items : [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'dashboard-header',
			title: '<img src="res/images/dashboard/Logo_cloobster_weiss.png" height="30px" width="auto" style="margin-top: 8px;">'
			// items: [
			// 	{
			// 		xtype : 'fixedbutton',
			// 		action: 'show-login',
			// 		iconCls: 'user',
			// 		iconMask: true,
			// 		align: 'right'
			// 	},
			// 	{
			// 		xtype : 'fixedbutton',
			// 		action: 'profile',
			// 		hidden: true,
			// 		iconCls: 'user',
			// 		iconMask: true,
			// 		align: 'right'
			// 	}
			// ]
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
			flex: 2
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
			flex: 3
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
			flex: 2
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

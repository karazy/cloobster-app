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
				type: 'fit',
		},
		padding: '25 8 30',
		cls: 'dashboard',		
		items : [
		{
			xtype: 'titlebar',
			docked: 'top',
			cls: 'dashboard-header',
			title: '<img src="res/images/dashboard/Logo_cloobster_weiss.png" height="30px" width="auto" style="margin-top: 8px;">'
		},
		{
			xtype: 'panel',
			layout: {
				type: 'hbox',
				align: 'start',
				// pack: 'center',
			},
			docked: 'top',
			padding: 5,
			items: [
				{
					xtype : 'fixedbutton',
					action: 'tovisit',
					text: i10n.translate('dashboard.button.tovisit'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-history',
					iconCls: 'dashboard-button-icon',
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '0 3 0 0'
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
					flex: 1,
					margin: '0 0 0 3'
				}	
			]
		},
		{
			xtype: 'list',
			store: 'visitStore'
		}			
		// {
		// 	xtype: 'fixedbutton',
		// 	ui: 'action',
		// 	action: 'demo-checkin',
		// 	text: i10n.translate('dashboard.button.demo'),
		// 	baseCls: 'dashboard-button',
		// 	cls: 'dashboard-button-demo',
		// 	iconCls: 'dashboard-button-icon',
		// 	pressedCls: 'dashboard-button-pressed',
		// 	labelCls: 'dashboard-button-label',
		// 	flex: 2
		// }
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

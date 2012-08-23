/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.Dashboard', {
	extend : 'Ext.Panel',
	xtype : 'dashboard',
	requires: ['Ext.Img'],
	config : {
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'center',
		},
		cls: 'dashboard',
		items : [ 
		{
			xtype : 'image',
			src : 'res/images/dashboard/cloobster-logo-186.png',
			style : 'background-repeat:no-repeat; background-position:center center;',
			height : 80,
			width : 186,
			margin: '0 0 10 0'
		},		
		{
			xtype: 'label',
			cls: 'dashboard-description',
			style: 'text-align: center;',
			html: i10n.translate('dashboardLabel1')
		},	
		{
			xtype : 'button',
			action: 'checkin',
			margin: '7 0',
			text: 'Check-In',
			ui: 'action',
			iconMask: true,
			iconCls: 'action',
			height: 50,
			width: 150
		},
		{
			xtype : 'button',
			action: 'history',
			margin: '7 0',
			text: i10n.translate('dashboard.button.history'),
			ui: 'action',
			iconMask: true,
			iconCls: 'locate4',
			height: 50,
			width: 150
		},
		{
			xtype : 'button',
			action: 'login',
			margin: '7 0',
			text: 'Login',
			ui: 'action',
			iconMask: true,
			iconCls: 'user',
			height: 50,
			width: 150
		},
		{
			xtype: 'label',
			cls: 'dashboard-description',
			html: i10n.translate('dashboardLabel2')
		},
		{
			xtype: 'button',
			action: 'about',
			ui: 'confirm',
			iconCls: 'about',
			iconMask: true,
			styleHtmlContent: true,
			style: 'position: absolute; bottom: 10px; right: 10px;'
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

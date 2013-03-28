/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',	
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.BasicButton', 'EatSense.view.components.TileButton',
		'EatSense.view.components.BasicTileButton', 'EatSense.view.components.DashboardTeaser'],

	/**
	* @event tilesrendered
	* Tiles have been rendered.
	*/

	config : {
		layout : {
			type : 'fit'
		},
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
			xtype: 'panel',
			width: '100%',
			itemId: 'tilePanel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'start'
			},
			padding: '0 8 12 8',
			scrollable: 'vertical',
			items: [
				{
					xtype: 'label',
					itemId: 'description',
					cls: 'club-dashboard-description',
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
					padding: '5px 0 0 0',			
					items: [
					{
						xtype: 'panel',
						flex: 1,
						itemId: 'leftTileColumn',
						padding: '0 4 0 0',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [										
						]
					},
					{
						xtype: 'panel',
						flex: 1,
						padding: '0 0 0 4',
						itemId: 'rightTileColumn',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [	
						]
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

Ext.define('EatSense.view.contactinfo.Map', {
	extend: 'EatSense.view.components.BackButtonPanel',
	xtype: 'locationmap',
	requires: [],
	config: {
		itemId: 'mapsPanel',
		backButton: true,
		layout: {
			type: 'fit'
		},
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('contactinfo.map.title'),
				docked: 'top',
				items: [
					{
						xtype: 'fixedbutton',
						action: 'open-maps',
						text: i10n.translate('contactinfo.location.maps'),
						iconCls: 'globe2',
						iconMask: true,
						hidden: true,
						ui: 'action',
						align: 'right'
					}
				]
			}
		]
	}
});
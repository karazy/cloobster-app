Ext.define('EatSense.view.BackButton', {
	extends: 'Ext.Button',
	// requires: ['Ext.Button'],
	xtype: 'backbutton',
	config : {
		// xtype : 'button',
		itemId : 'backButton',
		action: 'back',
		text : i10n.translate('back'),
		ui : 'back',
		align: 'left'
	}
});
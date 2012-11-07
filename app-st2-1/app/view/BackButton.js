/**
* A button used for toolbars for navigating to previous view.
*/
Ext.define('EatSense.view.BackButton', {
	extend: 'Ext.Button',
	xtype: 'backbutton',
	config : {
		itemId : 'backButton',
		action: 'back',
		text : i10n.translate('back'),
		ui : 'back',
		align: 'left'
	}
});
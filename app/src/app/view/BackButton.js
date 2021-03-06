/**
* A button used for toolbars for navigating to previous view.
*/
Ext.define('EatSense.view.BackButton', {
	extend: 'GT.override.FixedButton',
	xtype: 'backbutton',
	config : {
		itemId : 'backButton',
		action: 'back',
		// text : i10n.translate('back'),
		iconCls: 'arrow_left',
		iconMask: true,
		// ui : 'back',
		align: 'left'
	}
});
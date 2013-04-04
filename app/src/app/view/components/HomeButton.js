/**
* A button used for toolbars for navigating to dashboard.
*/
Ext.define('EatSense.view.components.HomeButton', {
	extend: 'GT.override.FixedButton',
	xtype: 'homebutton',
	config : {
		itemId : 'homeButton',
		action: 'home',
		ui : 'normal',
		align: 'left',
		iconCls: 'home2',
		iconMask: true
	}
});
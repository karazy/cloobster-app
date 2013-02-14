/**
* Button to toggle slide navigation
*/
Ext.define('EatSense.view.components.SlidenavButton', {
	extend: 'GT.override.FixedButton',
	requires: ['GT.override.FixedButton'],
	xtype: 'slidenavbutton',
	config: {
		ui: 'action',
		iconCls: 'more',
		iconMask: true,
		action: 'toggle-navigation',
		cls: 'slidenavigation-button',
		align: 'left'		
	}
});
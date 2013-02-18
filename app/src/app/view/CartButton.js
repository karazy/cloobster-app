/**
* A button used in toolbars for showing the cart.
*/
Ext.define('EatSense.view.CartButton', {
	extend: 'GT.override.FixedButton',
	xtype: 'cartbutton',
	config : {
		xtype: 'button',
		action: 'show-cart',
		align: 'right',
		iconCls : 'shop1',
		iconMask : true,
		hidden: true,
		ui: 'action'
	}
});
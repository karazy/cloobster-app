/**
* Adds {@link EatSense.view.components.BasicButton} as a mixin to {@link EatSense.view.components.TileButton}.
* This makes this TileButton react to welcome and basicmode.
* 
*
*/
Ext.define('EatSense.view.components.BasicTileButton', {
	extend: 'EatSense.view.components.TileButton',
	xtype: 'basictilebutton',
	requires: [],
	mixins: {
		basicButton: 'EatSense.view.components.BasicButton'
		// setHidden: 'EatSense.view.components.BasicButton.setHidden',
		// activateBasicMode: 'EatSense.view.components.BasicButton.activateBasicMode'
	},
	onRelease: function() {
		console.log('EatSense.view.components.BasicTileButton.onRelease mixin');
		return this.mixins.basicButton.onRelease.apply(this, arguments);
	},
	setHidden: function() {
		console.log('EatSense.view.components.BasicTileButton.setHidden mixin');
		return this.mixins.basicButton.setHidden.apply(this, arguments);
	},
	activateBasicMode: function() {
		console.log('EatSense.view.components.BasicTileButton.activateBasicMode mixin');
		return this.mixins.basicButton.activateBasicMode.apply(this, arguments);
	}
});

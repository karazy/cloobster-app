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
	config: {

		/**
		*
		*/
		basic: false,
		/**
		*
		*/
		welcome: false,
		basicFn: null,
		welcomeFn: null,

	},
	/**
	* @override
	*
	*/
	onTap: function(me, e) {
		if(this.getBasic() === true) {
			if(appHelper.isFunction(this.getBasicFn())) {
				//execute basic function
				this.getBasicFn()();
			}
			return false;
		}

		if(this.getWelcome() === true && appHelper.isFunction(this.getWelcomeFn())) {
			//execute welcome function
			this.getWelcomeFn()();
		} else {
			this.callParent([me, e]);
		}	

	},
	/**
	* @override
	*
	*/
	setHidden: function(hidden) {
		if(this.getBasic()) {
			console.log('BasicButton.setHidden ' + hidden);
			hidden = true;
		}

		this.callParent([hidden]);
	},

	activateBasicMode: function(basic) {
		this.setHidden(basic);
		this.setDisabled(basic);
	}

	// mixins: {
	// 	basicButton: 'EatSense.view.components.BasicButton'
	// 	// setHidden: 'EatSense.view.components.BasicButton.setHidden',
	// 	// activateBasicMode: 'EatSense.view.components.BasicButton.activateBasicMode'
	// },
	// onRelease: function() {
	// 	console.log('EatSense.view.components.BasicTileButton.onRelease mixin');
	// 	return this.mixins.basicButton.onRelease.apply(this, arguments);
	// },
	// setHidden: function() {
	// 	console.log('EatSense.view.components.BasicTileButton.setHidden mixin');
	// 	return this.mixins.basicButton.setHidden.apply(this, arguments);
	// },
	// activateBasicMode: function() {
	// 	console.log('EatSense.view.components.BasicTileButton.activateBasicMode mixin');
	// 	return this.mixins.basicButton.activateBasicMode.apply(this, arguments);
	// }
});

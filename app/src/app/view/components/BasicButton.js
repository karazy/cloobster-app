Ext.define('EatSense.view.components.BasicButton', {
	extend: 'Ext.Button',
	xtype: 'basicbutton',
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
		welcomeFn: null
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

});
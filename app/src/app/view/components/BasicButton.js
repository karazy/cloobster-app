Ext.define('EatSense.view.components.BasicButton', {
	extend: 'GT.override.FixedButton',
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
	onRelease: function(e, me) {
		if(this.getBasic() === true) {
			if(appHelper.isFunction(this.getBasicFn())) {
				//execute basic function
				this.getBasicFn()();
			}

			this.callParent([me, e, true]);
			// return false;
		}

		if(this.getWelcome() === true && appHelper.isFunction(this.getWelcomeFn())) {
			//execute welcome function
			this.getWelcomeFn()();

			// return false;
			this.callParent([me, e, true]);
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
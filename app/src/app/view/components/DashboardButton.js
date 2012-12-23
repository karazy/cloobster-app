Ext.define('EatSense.view.components.DashboardButton', {
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
		welcomeFn: null,
		baseCls: 'club-dashboard-button',
		pressedCls: 'club-dashboard-button-pressed',
		labelCls: 'club-dashboard-button-label'
	},

	onTap:function(me, e) {
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

	activateBasicMode: function(basic) {
		this.setHidden(basic);
		this.setDisabled(basic);
	}

});
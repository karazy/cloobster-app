/**
* Controller handles general initializations during checkin.
* Other responsibilities include stuff like setting correct android back handlers on 
* tab switch. Everything which does not fit in a specific controller should be handled here.
*/
Ext.define('EatSense.controller.Lounge', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
            mainview: 'mainview',
			loungeview: 'lounge',
            clubArea: 'clubarea',
            clubDashboard: 'clubarea clubdashboard',
			descriptionLanel: 'clubarea clubdashboard #description',
			menuDashboardButton: 'clubarea clubdashboard button[action="show-menu"]'
		},
		control: {
			menuDashboardButton : {
				tap: 'showMenu'
			},
			loungeview : {
     			activeitemchange : function(container, value, oldValue, opts) {
     				var androidCtr = this.getApplication().getController('Android');
     				//prevent false exit!
     				androidCtr.setExitOnBack(false);

    				if(value.tabName === 'cart') {
    					status = this.getApplication().getController('Order').refreshCart();
    					androidCtr.setAndroidBackHandler(this.getApplication().getController('Order').getMyordersNavigationFunctions());
    				} else if (value.tabName === 'myorders') {
    					this.getApplication().getController('Order').refreshMyOrdersList();
    					//reset navigation view
    					this.getApplication().getController('Feedback').getMyordersNavview().pop();
    					androidCtr.setAndroidBackHandler(this.getApplication().getController('Order').getCartNavigationFunctions());
    				} else if(value.tabName === 'menu') {
    					androidCtr.setAndroidBackHandler(this.getApplication().getController('Menu').getMenuNavigationFunctions());
    				} else if(value.tabName === 'settings') {
    					androidCtr.setAndroidBackHandler(this.getApplication().getController('Settings').getSettingsNavigationFunctions());
    				} 
        //             else if(value.tabName === 'requests') {
    				// 	androidCtr.setAndroidBackHandler(this.getApplication().getController('Request').getRequestNavigationFunctions());
    				// 	//reset navigation view
    				// 	this.getApplication().getController('Feedback').getRequestNavview().pop();
    				// } 
                    else if(value.tabName === 'home') {
                         //always jump to dashboard on home tab pressed
                         this.getClubArea().setActiveItem(0);
                    }
    				else {    				
    					androidCtr.setAndroidBackHandler(null);
    				}

    				return status;
    			}
    		}
		}
	},
    /**
    * Init and show dashboard upon checkin.
    */
    initDashboard: function() {
        var descriptionLanel = this.getDescriptionLanel(),
            // accountCtr = this.getApplication().getController('Account'),
            checkInCtr = this.getApplication().getController('CheckIn'),
            nickname = "",
            business = "",
            main = this.getMainview(),
            lounge = this.getLoungeview();


        if(checkInCtr.getActiveCheckIn()){
            nickname = checkInCtr.getActiveCheckIn().get('nickname');
            business = checkInCtr.getActiveCheckIn().get('businessName');
        };

       descriptionLanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business));

        //always show dashboard first
        this.getClubArea().setActiveItem(0);
        lounge.setActiveItem(0);

        main.switchAnim('left');
        main.setActiveItem(lounge);
    },

	showMenu: function(button) {
		this.getLoungeview().setActiveItem(1);
	}
});
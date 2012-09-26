Ext.define('EatSense.controller.Lounge', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
			loungeview: 'lounge',
            clubDashboard: 'clubdashboard',
			descriptionLanel: 'clubdashboard #description',
            showFeedbackButton: 'clubdashboard button[action=show-feedback]',
			menuDashboardButton: 'clubdashboard button[action="show-menu"]'
		},
		control: {
			menuDashboardButton : {
				tap: 'showMenu'
			},
            showFeedbackButton : {
                tap: 'showFeedback'
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
    				} else if(value.tabName === 'requests') {
    					androidCtr.setAndroidBackHandler(this.getApplication().getController('Request').getRequestNavigationFunctions());
    					//reset navigation view
    					this.getApplication().getController('Feedback').getRequestNavview().pop();
    				}
    				else {    				
    					androidCtr.setAndroidBackHandler(null);
    				}

    				return status;
    			}
    		}
		}
	},

    initDashboard: function() {
        var descriptionLanel = this.getDescriptionLanel(),
            // accountCtr = this.getApplication().getController('Account'),
            checkInCtr = this.getApplication().getController('CheckIn'),
            nickname = "",
            business = "";

        //always use the nickname from checkin not profile
        // if(accountCtr.getProfile()) {
        //     //TODO show nickname in not logged in state
        //     nickname = accountCtr.getProfile().get('nickname');
        // } else if(checkInCtr.getActiveCheckIn()){
        //     nickname = checkInCtr.getActiveCheckIn().get('nickname');
        // };

        if(checkInCtr.getActiveCheckIn()){
            nickname = checkInCtr.getActiveCheckIn().get('nickname');
            business = checkInCtr.getActiveCheckIn().get('businessName');
        };


        descriptionLanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business));
    },

    showFeedback: function(button) {
        var dashboard = this.getClubDashboard(),
            feedbackView = this.getApplication().getController('Feedback').getFeedback();

        dashboard.add(feedbackView);
        feedbackView.show();
        // dashboard.show(feedbackView);
    },

	showMenu: function(button) {
		this.getLoungeview().setActiveItem(1);
	}
});
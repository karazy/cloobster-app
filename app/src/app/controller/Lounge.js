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
            dashboardHeader: 'clubarea clubdashboard #header',
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
            header = this.getDashboardHeader(),
            main = this.getMainview(),
            lounge = this.getLoungeview(),
            headerUrl = null,
            logoUrl = null,
            //html for custom business header            
            headerHtml = null,
            //used for dynamic size calculation
            domLogo = null,
            realLogoWidth = null,
            realLogoHeight = null;


        if(checkInCtr.getActiveCheckIn()){
            nickname = checkInCtr.getActiveCheckIn().get('nickname');
            business = checkInCtr.getActiveCheckIn().get('businessName');
        };

       descriptionLanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business));

       //set header images with business logo and banner
       if(checkInCtr.getActiveSpot()) {
            headerUrl = checkInCtr.getActiveSpot().get('headerUrl');
            logoUrl = checkInCtr.getActiveSpot().get('logoUrl');

            if(headerUrl) {
                headerHtml = '<img class="header" src="'+headerUrl+'" />';
            };
            if(logoUrl) {
                headerHtml +='<img class="logo" src="'+logoUrl+'" />';
            };
            //TODO testing purpose
            // headerHtml = '<img class="header" src="res/images/club/banner_test.png" />';
            // headerHtml +='<img class="logo" src="res/images/club/logo_test.png" />';
            // headerUrl = true;
            //only show if header exists!
            if(headerUrl) {
                header.setHtml(headerHtml);
            };
       };
       //a switch to change classes for business logo
       header.on('painted', function(panel, eOpts){
       		console.log('Lounge.initDashboard > header painted');
       		//get width and height of logo
       		try {
       			domLogo = panel.getInnerHtmlElement().dom.getElementsByClassName('logo')[0];
       			domLogo.onload = function() {
       				       			realLogoWidth = domLogo.width;
       			realLogoHeight = domLogo.height;

       			//if image is taller then wide remove calss logo and add class logo-vertical
       			if((realLogoWidth/realLogoHeight) < (3/2)) {
       				//add class vertical, than adjust dynamic properties
       				domLogo.setAttribute('class', 'logo-vertical');
       				domLogo.style.left = '50%';
       				domLogo.style.marginLeft = -domLogo.width/2 + "px";
       			};

       			};

       		} catch(e) {
       			console.log('Lounge.initDashboard > something went fucking wrong ' + e);
       			//restore default
       			header.setHtml('<img class="header" src="res/images/dashboard/header-bg.png" />');
       		}
       		
       }, this, {
       	// single: true
       });

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
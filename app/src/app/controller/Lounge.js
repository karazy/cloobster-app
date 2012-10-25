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
			descriptionPanel: 'clubarea clubdashboard #description',
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
    					// this.getApplication().getController('Feedback').getMyordersNavview().pop();
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
                 androidCtr.setAndroidBackHandler(this.getNavigationFunctions());
            }	else {    				
    					androidCtr.setAndroidBackHandler(null);
    				}

    				return status;
    			}
    		}
		},
		/* Android Back handlers */
		navigationFunctions : new Array()
	},
  /**
  * Initialize and show dashboard upon checkin.
  */
  initDashboard: function() {
      var descriptionPanel = this.getDescriptionPanel(),
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

     descriptionPanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business));
      
      this.drawCustomHeader();

      //always show dashboard first
      this.getClubArea().setActiveItem(0);
      lounge.setActiveItem(0);

      main.switchAnim('left');
      main.setActiveItem(lounge);
  },
  /**
  * Draws custom business header in club dashboard if it exists.
  */
  drawCustomHeader: function() {
    var checkInCtr = this.getApplication().getController('CheckIn'),
        headerUrl = null,
        logoUrl = null,
        header = this.getDashboardHeader(),
        //html for custom business header            
        headerHtml = null,
        //used for dynamic size calculation
        domLogo = null,
        realLogoWidth = null,
        realLogoHeight = null;

    console.log('Lounge.drawCustomHeader');
    //set header images with business logo and banner
       if(checkInCtr.getActiveSpot()) {
            headerUrl = checkInCtr.getActiveSpot().get('headerUrl');
            logoUrl = checkInCtr.getActiveSpot().get('logoUrl');
            //use image scaling from google =sxxx
            if(headerUrl) {
                headerHtml = '<img class="header" src="'+headerUrl+'=s720" />';
            };
            if(logoUrl) {
                headerHtml +='<img class="header-logo logo-horizontal" src="'+logoUrl+'=s180" />';
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
       //waits for panel to be drawn
       header.on('painted', function(panel, eOpts) {

        Ext.defer(function() {
          
          //get width and height of logo
          try {
            //get hold of the logo img element
            domLogo = panel.getInnerHtmlElement().dom.getElementsByClassName('header-logo');

            if(domLogo && domLogo[0]) {
              domLogo = domLogo[0];
              //wait for logo to be fully loaded, only then we can get the real width and height
              if(domLogo.complete) {
                console.log('Lounge.initDashboard > domLogo.complete');
                calculateHeaderLogoSize(domLogo); 
              } else {
                console.log('Lounge.initDashboard > domLogo.onload');
                domLogo.onload = function() {
                  calculateHeaderLogoSize(domLogo);  
                }                
              }
            } else {
              console.log('Lounge.initDashboard > no domLogo found');
            }


            function calculateHeaderLogoSize(logo) {      
                realLogoWidth = logo.width;
                realLogoHeight = logo.height;

                //if image is taller then wide remove calss logo and add class logo-vertical
                if((realLogoWidth/realLogoHeight) < (3/2)) {
                  //add class vertical, than adjust dynamic properties
                  logo.setAttribute('class', 'header-logo logo-vertical');
                  logo.style.left = '50%';
                  logo.style.marginLeft = -logo.width/2 + "px";
                }
            }

          } catch(e) {
            console.log('Lounge.initDashboard > something went wrong ' + e);
            //restore default on error
            header.setHtml('<img class="header" src="res/images/dashboard/header-bg.png" />');
          }

        }, 100, this);
          
       }, this, {
        //only execute on first load
        single: true
       });

  },

	showMenu: function(button) {
		this.getLoungeview().setActiveItem(1);
	}
});
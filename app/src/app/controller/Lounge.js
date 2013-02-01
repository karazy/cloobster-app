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
			menuDashboardButton: 'clubarea clubdashboard button[action="show-menu"]',
      navButtons: 'lounge button[action=toggle-navigation]'    
		},
		control: {
			menuDashboardButton : {
				tap: 'showMenu'
			},
      clubArea: {
        activate: 'clubAreaActivated'
      },
      // navButtons: {
      //   tap: 'toggleNavigation'
      // }
		},
		/* Android Back handlers */
		navigationFunctions : new Array()
	},
  launch: function() {
    var checkInCtr = this.getApplication().getController('CheckIn');

    checkInCtr.on('basicmode', this.manageBasicMode, this);

    checkInCtr.on('statusChanged', function(status) {
      if(status == appConstants.CHECKEDIN) {
        this.getLoungeview().getList().select(0);
        this.getLoungeview().setWelcomeMode(checkInCtr.getActiveSpot().get('welcome'));
        this.toggleSlidenavButtons(true);
        this.getLoungeview().on('containertoggle', this.toggleSlidenavButtonState, this);
        this.registerSlideBezelTap();
      }  else if(status == appConstants.PAYMENT_REQUEST) {
         this.toggleSlidenavButtons(false);
      } else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
         this.toggleSlidenavButtons(true);
         this.getLoungeview().un('containertoggle', this.toggleSlidenavButtonState, this);
         this.registerSlideBezelTap(false);
      }
    }, this);
    
  },
  /**
  * Show/hide the slidenavigation menu.
  */
  toggleNavigation: function(button) {
    var loungeview = this.getLoungeview();
    loungeview.toggleContainer();
  },
  registerSlideBezelTap: function(un) {
    var me = this,
        slideBezel = Ext.getCmp('slidenavigationbezel');

    if(!un) {
      slideBezel.element.on({
        tap: me.toggleNavigation,
        scope: this
      });
    } else {
      slideBezel.element.un({
        tap: me.toggleNavigation,
        scope: this
      });
    }    
  },
  /**
  * Toggles navigation button cls based on he given containerState either 'open' or 'closed'.
  * @param {String} containerState
  */
  toggleSlidenavButtonState: function(containerState) {
    var buttons = this.getLoungeview().query('button[action=toggle-navigation]');

    Ext.Array.each(buttons, function(button) {
      if(containerState == 'open') {
        button.addCls('mask-open');
      } else {
        button.removeCls('mask-open');
      }      
    });
  },
  /**
  * Manages the slidenavigation menu based on given parameters.
  * @param basicMode
  *   Toggles visibility of flagged menu items. And activates basicmode on slide navigation.
  */
  manageBasicMode: function(basicMode) {
      var lounge = this.getLoungeview();

      if(!lounge) {
          console.log('Lounge.manageBasicMode: no loungeview found!');
          return;
      }

      if(!lounge.getList()) {
        console.log('Lounge.manageBasicMode: loungeview contains no list with navigation items!');
          return; 
      }

      console.log('Lounge.manageBasicMode: basicMode=' + basicMode);

      lounge.setBasicMode(basicMode);

      //hide all elements with flag hideOnBasic
      if(basicMode == true) {
        lounge.getList().getStore().filter([
          {property: "hideOnBasic", value: false}
        ]);
      } else {
        lounge.getList().getStore().clearFilter();
      }       
  },
  /**
  * Shows or hides all slidenav buttons.
  * @param show
  *   true to show/enable, false to hide/disable
  */
  toggleSlidenavButtons: function(show) {
    var lounge = this.getLoungeview(),
        buttons;

        buttons = lounge.query('button[action=toggle-navigation]');

        Ext.Array.each(buttons, function(b) {
          b.setDisabled(!show);
          b.setHidden(!show);
        });
  },
  clubAreaActivated: function(tab, options) {
      var androidCtr = this.getApplication().getController('Android'),
          tilePanel = tab.down('#tilePanel');

     //always jump to dashboard on home tab pressed
     tab.setActiveItem(0);
     androidCtr.setExitOnBack(false); 
     this.setNavigationFunctions(new Array());
     androidCtr.setAndroidBackHandler(this.getNavigationFunctions());

     //scroll to top when activating the home menu
     if(tilePanel && tilePanel.getScrollable()) {
      tilePanel.getScrollable().getScroller().scrollToTop();
     }
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
          spotName = "",
          main = this.getMainview(),
          lounge = this.getLoungeview();

      if(checkInCtr.getActiveCheckIn()){
          nickname = checkInCtr.getActiveCheckIn().get('nickname');
          business = checkInCtr.getActiveCheckIn().get('businessName');
          spotName = checkInCtr.getActiveSpot().get('name');
      };

     descriptionPanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business, spotName));
      
      this.setCustomHeader();

      //always show dashboard first
      this.getClubArea().setActiveItem(0);
      lounge.setActiveItem(0);

      main.switchTo(lounge, 'left');
  },
  /**
  * Draws custom business header in club dashboard if it exists.
  */
  setCustomHeader: function() {
    var checkInCtr = this.getApplication().getController('CheckIn'),
        headerUrl = null,
        header = this.getDashboardHeader(),
        //html for custom business header            
        headerHtml = null;

    // console.log('Lounge.setCustomHeader');
      //set header images with business logo and banner
       if(checkInCtr.getActiveSpot()) {
            headerUrl = checkInCtr.getActiveSpot().get('headerUrl');

            if(headerUrl) {
                headerHtml = '<img class="header" src="'+headerUrl+'=s720" />';
            };

            //only show if header exists!
            if(headerUrl) {
              header.setHtml(headerHtml);
            } else {
              header.setHtml('<img class="header" src="res/images/dashboard/header-bg.png" />');
            }
       }
  },
	showMenu: function(button) {
		var lounge = this.getLoungeview();
    lounge.selectByAction('show-menu');
	}
});
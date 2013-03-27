/**
* Controller handles general initializations during checkin.
* Other responsibilities include stuff like setting correct android back handlers on 
* tab switch. Everything which does not fit in a specific controller should be handled here.
*/
Ext.define('EatSense.controller.Lounge', {
	extend: 'Ext.app.Controller',

  /**
	* @event areaswitched
	* Fires whenever the user selected a new area in the slidenavigation.
	* @param {EatSense.model.Area} the new area
	*/

	requires: ['EatSense.util.DashboardItemTemplates'],
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
			}
		},
		/* Android Back handlers */
		navigationFunctions : new Array()
	},
  launch: function() {
	 var me = this,
		  checkInCtr = this.getApplication().getController('CheckIn');

	  checkInCtr.on({
		 'spotswitched' : function(spot) {
			this.markSlideNavAreaActive(checkInCtr.getActiveArea(), spot);
		 },
		 'statusChanged' : function(status) {
			if(status == appConstants.CHECKEDIN) {			  
			  this.initDashboard();
			  this.buildDashboard();
			  this.loadDashboardConfiguration();

			  // appHelper.toggleMask(i10n.translate('checkin.init.loading', checkInCtr.getActiveSpot().get('businessName')), this.getLoungeview().getContainer().getActiveItem());
 				this.getLoungeview().setWelcomeMode(checkInCtr.getActiveSpot().get('welcome'));
			  	this.toggleSlidenavButtons(true);
				  // this.getLoungeview().on('containertoggle', this.containerStateBasedActions, this);
				  this.getLoungeview().on('containertoggle', this.disableTextFields, this);
				  this.registerSlideBezelTap();
				  //initially only the area id exists so use areaName from spot
				  this.applyAreaNameToMenuTileButton(checkInCtr.getActiveSpot().get('areaName'));

				  this.getLoungeview().selectByAction('show-clubdashboard');
				  this.getLoungeview().setDisableDrag(false);
			 
			}  else if(status == appConstants.PAYMENT_REQUEST) {
				this.toggleSlidenavButtons(false);
				this.registerSlideBezelTap(true);
				this.getLoungeview().setDisableDrag(true);
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.toggleSlidenavButtons(true);
				// this.getLoungeview().un('containertoggle', this.containerStateBasedActions, this);
				this.getLoungeview().un('containertoggle', this.disableTextFields, this);
				this.registerSlideBezelTap(true);
				this.getLoungeview().setDisableDrag(false);
				this.cleanup();
			}
		 },
		 'basicmode' : function(basicMode) {
		 	this.manageBasicMode(basicMode);		 	
		 	this.tryLoadingAreas();		 	
		 },
		 scope: this
	  });
  },
  /**
  * Show/hide the slidenavigation menu.
  */
  toggleNavigation: function(button) {
	 var loungeview = this.getLoungeview();
	 loungeview.toggleContainer();
	 //stop propagation
	 return false;
  },
  /**
  * Enable tapping on slidebezel to show slide nav.
  * @param {Boolean} unregister
  *		True to remove tap event.
  */
  registerSlideBezelTap: function(unregister) {
	 var me = this,
		  slideBezel = Ext.getCmp('slidenavigationbezel');

	 if(!unregister) {
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
  * Toggles navigation button cls based on the given containerState either 'open' or 'closed'.
  * @param {String} containerState
  */
  containerStateBasedActions: function(containerState) {
  	var me = this,
  		androidCtr = this.getApplication().getController('Android');
	 // var buttons = this.getLoungeview().query('button[action=toggle-navigation]');

	 // Ext.Array.each(buttons, function(button) {
		// if(containerState == 'open') {
		//   button.addCls('mask-open');
		// } else {
		//   button.removeCls('mask-open');
		// }      
	 // });	 
	console.log('Lounge.containerStateBasedActions: state ' + containerState);
	if(containerState == 'open') {
		androidCtr.addBackFn(toggleContainer);
	} else {
		androidCtr.removeBackFn(toggleContainer);
	}

	//create closure to execute in right scope
	function toggleContainer() {
		me.toggleNavigation();
		androidCtr.removeBackFn(toggleContainer);
	}
  },
  /**
  * Disables all textarea fields in the active container. 
  * This is due to a strange bug propagating the focus event to inputs, also 
  * the container is masked.
  * @param {String} containerState
  */
  disableTextFields: function(containerState) {
  	var textfields = this.getLoungeview().getContainer().getActiveItem().query('textareafield');

  	Ext.Array.each(textfields, function(field) {
  		
  		if(containerState == 'open') {
  			field.setDisabled(true);
		} else {
			Ext.defer(function() {
				field.setDisabled(false);
			}, 300, this);		  
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
			 {
			 	property: "hideOnBasic", 
			 	value: false
			 }
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
  /*
  * Set title of menu tilebutton in club dashboard to name of active area.
  * @param {EatSense.model.Area|String} area 
  *		Area whos name to display as title. If none provided resets to default.
  *		Can either be an area model or a string
  */
  applyAreaNameToMenuTileButton: function(area) {
  	var dashboard = this.getClubDashboard(),
  		menuTileButton;

  		menuTileButton = dashboard.down('tilebutton[action=show-menu]');

  		if(!menuTileButton) {
  			return;
  		}

  		if(area) {  
  			if(typeof area == 'string') {
  				menuTileButton.setTitle(area);
  			} else {
  				menuTileButton.setTitle(area.get('name'));	
  			}	  		
  		} else {
  			menuTileButton.setTitle(i10n.translate('menuTab'));
  		}
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
	//TODO maybe load from business.images instead from spot
	//set header images
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
	},
	/**
	* @private
	* Tries to load areas. Areas can only be loaded after business and spot exist.
	*
	*/
	tryLoadingAreas: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');

		if(checkInCtr.getActiveSpot() && checkInCtr.getActiveBusiness()) {			
			if(checkInCtr.getActiveSpot().get('welcome') == false && checkInCtr.getActiveBusiness().get('basic') == false) {
				console.log('Lounge.tryLoadingAreas');
				me.loadAreas(function() {
					me.markSlideNavAreaActive(checkInCtr.getActiveArea(), checkInCtr.getActiveSpot());
			 	}); 
			}
		} else {
			console.error('Lounge.tryLoadingAreas: could not load areas. Maybe no activeSpot exits?');
		}

	},
	 /**
	 * Load all available areas for this location.
	 * @param {Function} callback
	 *   Executed on success when store finished loading with success
	 */
	 loadAreas: function(callback) {
		var me = this,
			 areaStore = Ext.StoreManager.lookup('areaStore'),
			 loungeview = this.getLoungeview(),
			 items;

			 if(!areaStore) {
				console.log('Lounge.loadAreas: could not optain area store');
				return;
			 }

			 if(!loungeview) {
				console.log('Lounge.loadAreas: no loungeview exists');
				return;            
			 }

			 console.log('Lounge.loadAreas');

			 areaStore.load({
				callback: function(records, operation, success) {
				  if(!operation.error) {
					 if(records.length > 0) {
						items = me.createItemsFromAreaStore(areaStore);
						loungeview.addNewItems(items);
					 }
					 callback();
				  } else {
				  me.getApplication().handleServerError({
								'error': operation.error, 
								'forceLogout': {403:true}
							 });
						}             

				}
			 });
	 },
	 /**
	 * @private
	 * traverses the areaStore and builds an area of items used to display in slide navigation
	 * @param {Ext.data.Store} areaStore
	 *   The store to create the items from.
	 */
	 createItemsFromAreaStore: function(areaStore) {
		  var me = this,
				items = [
				  {
					 title: i10n.translate('slidenav.header.areas'),
					 header: true,
					 dynamic: true
				  }
				],
				item;

		  areaStore.each(function(area) {
			 item = {};
			 item.leaf = true;
			 item.title = area.get('name');
			 item.dynamic = true;
			 item.handler = function() {
				me.switchArea(area);
			 };
			 item.areaId = area.get('id');
			 items.push(item);
		  });

		  return items;
	 },
	 /**
	 * Marks given Area active in slide navigation.
	 * @param {String|EatSense.modelArea} area or areaId
	 *   area to mark active
	 */
	 markSlideNavAreaActive: function(area, spot) {
		var me = this,
			 // areaStore = Ext.StoreManager.lookup('areaStore'),
			 areaId,
			 slideNavStore = this.getLoungeview().getList().getStore();

			 if(!area) {
				console.error('Lounge.markSlideNavAreaActive: no area given');
				return;
			 }

			 areaId = Ext.isNumber(area) ? area : area.get('id');

			 //deselect all items
			 slideNavStore.each(function(item) {
				if(item.get('areaId') == areaId) {
				  item.set('marked', true); 
				  item.set('subtitle', spot.get('name'));
				} else {
				  item.set('marked', false);
				  item.set('subtitle', '');
				}
			 });
	 },
	 /**
	 * Jumps back to dashboard and switches to new area.
	 */
	 switchArea: function(area) {
		var loungeview = this.getLoungeview();

		this.applyAreaNameToMenuTileButton(area);
		this.fireEvent('areaswitched', area);

		loungeview.selectByAction('show-clubdashboard');
	 },

	 /**
	 * @private
	 * Loads the dashboard configuration for active business.
	 * @param {Function} callback
	 *	Executed on success. Gets passed retrieved records
	 */
	 loadDashboardConfiguration: function(callback) {
	 	var me = this,
	 		store = Ext.StoreManager.lookup('ditemStore');

	 		if(!store) {
				console.log('Lounge.loadDashboardConfiguration: could not optain dashboarditem store');
				return;
			}

			console.log('Lounge.loadDashboardConfiguration');

			store.load({
				callback: function(records, operation, success) {
				  if(!operation.error) {
					 if(records.length > 0) {
					 	if(EatSense.util.Helper.isFunction(callback)) {
					 		callback(records);
					 	}
					 } else {
					 	console.log('Lounge.loadDashboardConfiguration: no configurations found');
					 }
				  } else {
				  me.getApplication().handleServerError({
							'error': operation.error, 
							'forceLogout': {403:true}
						 });
					}
				}
			});
	 },
	 /**
	 *	Creates the dynamic hotel dashboard by loading the configuration from 
	 * the server and afterwards creating the tiles.
	 */
	 buildDashboard: function() {
	 	var me = this,
	 		clubDashboard = this.getClubDashboard(),
	 		leftTileColum,
	 		rightTileColumn;

	 		leftTileColum = clubDashboard.down('#leftTileColumn');
	 		rightTileColumn = clubDashboard.down('#rightTileColumn');

	 		console.log('Lounge.buildDashboard');

	 		// me.on({
	 		// 	'delayeddashboarbuild' : doLoad,
	 		// 	single: true,
	 		// 	scope: this
	 		// });

	 		//mask carousels during creation
			EatSense.util.Helper.toggleMask('dashboard.loadingmsg', clubDashboard);

	 		//delay creation for better perceived performance
			// Ext.create('Ext.util.DelayedTask', function () {
	            // me.fireEvent('delayeddashboarbuild');
	        // }).delay(100);

	 		//load dashboard configuration
	 		// function doLoad() {
	 		// 	this.loadDashboardConfiguration(build);
	 		// }

	 		this.loadDashboardConfiguration(build);
	 		

	 		//build dashboard
	 		function build(dashboardItems) {
	 			console.log('Lounge.buildDashboard: build');

	 			Ext.Array.each(dashboardItems, function(dbItem, index) {
	 				//create item and add to tile panel
	 				tileConfig = me.getDashboardItemTpl(dbItem);
	 				if(tileConfig) {
	 					if((index % 2) == 0) {
		 					leftTileColum.add(tileConfig);
		 				} else {
							rightTileColumn.add(tileConfig);
		 				}
	 				} else {
						console.log('Lounge.buildDashboard: build no template found for type ' + dbItem.get('type'));	 					
	 				}	 				
	 			});

	 			EatSense.util.Helper.toggleMask(false, clubDashboard);
	 		}

	 },
	 /**
	 * @private
	 * Get the template assigned to this DashboardItem config.
	 * {@link EatSense.util.DashboardItemTemplates}
	 *
	 * @param {EatSense.model.DashboardItem} config
	 *	config item used to retrieve template
	 * @return
	 *	The template. Null if none was found
	 */
	 getDashboardItemTpl: function(config) {
	 	var tplMap,
	 		tpl = null;

	 	if(!config) {
	 		console.log('Lounge.getDashboardItemTpl: no config given');
	 		return;
	 	}

	 	if(!dItemTpl) {
	 		console.error('Lounge.getDashboardItemTpl: dashboard item templates dont exist');
	 		return;	
	 	}

	 	// console.log('Lounge.getDashboardItemTpl: type ' + config.get('type'));

		tpl = dItemTpl.getTemplate(config);

	 	return tpl;
	 },

	 /**
	 * Cleanup on checkout.
	 */
	 cleanup: function() {
		var areaStore = Ext.StoreManager.lookup('areaStore'),
			slideNavStore = this.getLoungeview().getList().getStore();
		
		try {
		  areaStore.clearFilter();
		  //as awlays be extra careful cleaning up sencha stores.
		  areaStore.each(function(area) {
			 area.destroy();
		  });
		  areaStore.removeAll(false);

		  //remove all dynamic items
		  slideNavStore.each(function(item) {
			 if(item.get('dynamic')) {
				slideNavStore.remove(item);
				item.destroy();
			 }
		  });
		  //reset area title
		  this.applyAreaNameToMenuTileButton();
		} catch(e) {
		  console.error('Lounge.cleanup: failed ' + e);
		}

	 }
});
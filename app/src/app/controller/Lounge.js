/**
* Controller manages the main view and the slide navigation.
* Also repsonsible for dynamic dashboard tiles and areas.
*/
Ext.define('EatSense.controller.Lounge', {
	extend: 'Ext.app.Controller',

  /**
	* @event areaswitched
	* Fires whenever the user selected a new area in the slidenavigation.
	* @param {EatSense.model.Area} the new area
	*/

	/**
	* @event showdashboard
	* Event fired on Ext.Viewport to show the dashboard.
	*/

	requires: ['EatSense.util.DashboardItemTemplates', 'EatSense.view.DashboardHelp'],
	config: {
		refs: {
			loungeview: 'lounge',
			dashboard: 'cloobsterarea dashboard',
			clubArea: 'clubarea',
			clubDashboard: 'clubarea clubdashboard',
			dashboardHeader: 'clubarea clubdashboard #header',
			descriptionPanel: 'clubarea clubdashboard #description',
			menuDashboardButton: 'clubarea clubdashboard button[action="show-menu"]',
			navButtons: 'lounge button[action=toggle-navigation]',
			homeButtons: 'lounge homebutton'
		},
		control: {
			menuDashboardButton : {
				tap: 'showMenu'
			},
			clubArea: {
			  activate: 'clubAreaActivated'
			},
			homeButtons: {
				tap: 'showDashboard'
			},
			loungeview: {
				show: 'navigationShow'
			}
		}
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
			  this.manageViewState('club');
			  this.initDashboard();
			  this.buildDashboard();

			  

			  me.getClubDashboard().on({
			  	'tilesrendered' : function(dashboard) {
			  		//initially only the area id exists so use areaName from spot
			  		this.applyAreaNameToMenuTileButtons(checkInCtr.getActiveSpot().get('areaName'));
			  		Ext.create('Ext.util.DelayedTask', function () {
                		appHelper.toggleMask(false, dashboard);
                	}).delay(400);			  		
			  	},
			  	single: true,
			  	scope: this
			  });

 			  this.getLoungeview().setWelcomeMode(checkInCtr.getActiveSpot().get('welcome'));
			  this.toggleSlidenavButtons(true);
			  // this.getLoungeview().on('containertoggle', this.containerStateBasedActions, this);
			  this.getLoungeview().on('containertoggle', this.disableTextFields, this);
			  

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
				this.registerSlideBezelTap(false);
				this.getLoungeview().setDisableDrag(false);
				this.cleanup();
			}
		 },
		 'basicmode' : function(basicMode) {
		 	this.manageBasicMode(basicMode);		 			 	
		 },
		 'businessloaded' : function(business) {
		 	this.manageFeatures(business);
		 	this.tryLoadingAreas(business);
		 },
		 scope: this
	  });

		Ext.Viewport.on({
			'showdashboard' : this.showDashboard,
			scope: this
		});
  },
  /**
  * Show event handler for navigation. 
  */
  navigationShow: function() {
  	console.log('Lounge.navigationShow');
	this.manageViewState('cloobster');
	this.registerSlideBezelTap();

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
	//TODO 1.3.2013 experimental, backbutton does not work like expected
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
  * Disables all text and textarea fields in the active container. 
  * This is due to a strange bug propagating the focus event to inputs, although 
  * the container is masked.
  * @param {String} containerState
  */
  disableTextFields: function(containerState) {
  	var textfields = this.getLoungeview().getContainer().getActiveItem().query('textfield');

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
			lounge.getList().getStore().data.removeFilters(['hideOnBasic']);
		  	// lounge.getList().getStore().clearFilter();
		}       
  },
  /**
  * Depending on location.features settings. Enables or disables app features.
  * @param {EatSense.model.Business} location
  */
  manageFeatures: function(location) {
  	var me = this,
  		lounge = this.getLoungeview(),
  		features,
  		listItem;


  	if(!location) {
  		console.error('Lounge.manageFeatures: no location given');
  		return;
  	}

  	if(!location.raw.features) {
  		console.error('Lounge.manageFeatures:  location contains no features');
  		return;
  	}

  	features = location.raw.features;

  	//if feature is disabled set viewstate to none, otherwise to club
  	// if(typeof features.products != 'undefined') {
		listItem = lounge.getItemByAction('show-menu');
		if(listItem) {
			listItem.set('viewState', location.isFeatureEnabled('products') ? 'club' : 'club-disabled');	
		}			
	// }

	// if(typeof features.infopages != 'undefined') {
		listItem = lounge.getItemByAction('show-infopage');
		if(listItem) {
			listItem.set('viewState', location.isFeatureEnabled('infopages') ? 'club' : 'club-disabled');	
		}			
	// }

	// if(typeof features.infopages != 'undefined') {
		listItem = lounge.getItemByAction('show-feedback');
		if(listItem) {
			listItem.set('viewState', location.isFeatureEnabled('feedback') ? 'club' : 'club-disabled');	
		}			
	// }

	// if(typeof features['requests-call'] != 'undefined') {
		listItem = lounge.getItemByAction('show-requests');
		if(listItem) {
			listItem.set('viewState', location.isFeatureEnabled('requests-call') ? 'club' : 'club-disabled');	
		}			
	// }

	// if(typeof features['contact'] != 'undefined') {
		listItem = lounge.getItemByAction('show-contactinfo');
		if(listItem) {
			listItem.set('viewState', location.isFeatureEnabled('contact') ? 'club' : 'club-disabled');	
		}			
	// }

  	//products, infopages, feedback, requests-call, facebook-post, contact
  },
  /**
  * Manages the slidenavigation menu based on given parameters.
  * @param state
  *   Hides all items not assigned to given view state.
  */
  manageViewState: function(state, reset) {
  		var lounge = this.getLoungeview(),
  			store,
  			disbaledIndex,
  			filters;

		if(!lounge) {
			 console.log('Lounge.manageViewState: no loungeview found!');
			 return;
		}

		if(!lounge.getList()) {
		  console.log('Lounge.manageViewState: loungeview contains no list with navigation items!');
			 return; 
		}

		if(!state) {
		  console.log('Lounge.manageViewState: no state given');
			 return; 
		}

		lounge.setViewState(state);
		store = lounge.getList().getStore();

		console.log('Lounge.manageViewState: state=' + state);

		//hide all elements with flag hideOnBasic
		if(state) {
			//remove filter for prev viewState			
			filters = lounge.getList().getStore().getFilters();
			if(filters && filters.length > 0) {
				Ext.Array.forEach(filters, function(f) {
					if(f.getId() == "viewStateFilter") {
						lounge.getList().getStore().data.removeFilters(f);	
					}
				});								
			}
			
			if(reset) {
				store.filter();
				store.each(function(record) {
					disabledIndex = record.get('viewState').indexOf('-disabled');
					if(disabledIndex > 0) {
						record.set('viewState', record.get('viewState').substring(0, disabledIndex));
					}
				});
			}
		  
		  lounge.getList().getStore().filter([
			 {	
			 	id: 'viewStateFilter',
		 		filterFn: viewStateFilter
			 }
		  ]);
		} else {
			lounge.getList().getStore().data.removeFilters(['viewState']);
		}

		//filterFn
		function viewStateFilter(item) {
			if(item.get('viewState') == state || item.get('viewState') == 'allways') {
				return true;
			}
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
		  	 //Ticket 573
		  	 // b.setHidden(!show);
			 b.setDisabled(!show);			 
		  });
  },
  clubAreaActivated: function(tab, options) {
		var androidCtr = this.getApplication().getController('Android'),
			clubDashboard = this.getClubDashboard(),
			scrollPanel = tab.down('#scrollPanel');

	  //always jump to dashboard on home tab pressed
	  tab.setActiveItem(0);
	  androidCtr.setExitOnBack(false); 

	  //scroll to top when activating the home menu
	  if(clubDashboard && clubDashboard.getScrollable()) {
		clubDashboard.getScrollable().getScroller().scrollToTop();
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
		lounge = this.getLoungeview();

	//always show dashboard first
	lounge.selectByAction('show-clubdashboard');
	this.getClubArea().setActiveItem(0);	

	if(checkInCtr.getActiveCheckIn()) {
		 nickname = checkInCtr.getActiveCheckIn().get('nickname');
		 business = checkInCtr.getActiveCheckIn().get('businessName');
		 spotName = checkInCtr.getActiveSpot().get('name');
	};

	descriptionPanel.setHtml(i10n.translate('clubdashboard.label.description', nickname || "", business, spotName));
		
	this.setCustomHeader();

  }, 

  /*
  * Set title of menu tiles in club dashboard to name of active area.
  * @param {EatSense.model.Area|String} area 
  *		Area whos name to display as title. If none provided resets to default.
  *		Can either be an area model or a string
  */
  applyAreaNameToMenuTileButtons: function(area) {
  	var dashboard = this.getClubDashboard(),
  		title,
  		menuTileButtons;

  		menuTileButtons = dashboard.query('tilebutton[action=show-menu]');

  		if(!menuTileButtons || menuTileButtons.length == 0) {
  			return;
  		}
  		  	if(area) {  
	  			if(typeof area == 'string') {
	  				title = area;
	  			} else {
	  				title = area.get('name')
	  			}	  		
	  		} else {
	  			title = i10n.translate('menuTab');
	  		}

  		Ext.Array.each(menuTileButtons, function(button) {
			button.setTitle(title);
  		});
  },
  /**
  * Draws custom business header in club dashboard if it exists.
  */
  setCustomHeader: function() {
	var checkInCtr = this.getApplication().getController('CheckIn'),
		headerUrl = null,
		clubDashboard = this.getClubDashboard(),
		tilePanel,
		innerPanel,
		//html for custom business header            
		headerImg = 'url("res/images/dashboard/cloobster-frau.jpg")';
		//TODO maybe load from business.images instead from spot
		//set header images
	 if(checkInCtr.getActiveSpot()) {
		headerUrl = checkInCtr.getActiveSpot().get('headerUrl');

		tilePanel = clubDashboard.down('#tilePanel');

		if(headerUrl) {
			 headerImg = 'url("'+headerUrl+'=s720")';
		};

		clubDashboard.setStyle({
			'background-image' : headerImg,
			'background-repeat' : 'no-repeat',
			'background-position' : 'center top',			
			'background-size' : '100% auto'
		});

		innerPanel = tilePanel.element.down('.x-panel-inner');

		if(innerPanel) {
			innerPanel.dom.style.backgroundColor = 'white';			
			// innerPanel.dom.style.boxShadow = 'inset 0px 5px 5px -5px gray';
		}
	 }
  },
	showMenu: function(button) {
		var lounge = this.getLoungeview();
	 	lounge.selectByAction('show-menu');
	},
	/**
	* Show dashboard by selecting it in slide navgiation.
	* Depending on current viewState either club- or cloobster dashboard is shown.
	*/
	showDashboard: function() {
		var lounge = this.getLoungeview(),
			 viewState;

		viewState = lounge.getViewState();
		//select correct home scree depending on view state
		if(viewState == "cloobster") {
			lounge.selectByAction('show-dashboard');
		} else {
			//viewstate = club but to be sure always show club dashboard as this is mostly the case
			lounge.selectByAction('show-clubdashboard');
		}	 	
	},	
	/**
	* @private
	* Tries to load areas. Areas can only be loaded after business and spot exist.
	*
	*/
	tryLoadingAreas: function(business) {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');

		if(checkInCtr.getActiveSpot() && business) {
			if(checkInCtr.getActiveSpot().get('welcome') == false && business.get('basic') == false) {
				// console.log('Lounge.tryLoadingAreas');
				if(business.raw.features && !business.raw.features.products) {
					//product feature disabled
					return;
				}

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
					 	console.log('Lounge.loadAreas: load success');

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
					 subtitle: i10n.translate('slidenav.header.areas.subtitle'),
					 header: true,
					 dynamic: true,
					 viewState: 'club'
				  }
				],
				item;

		  areaStore.each(function(area) {
			 item = {};
			 item.leaf = true;
			 item.title = area.get('name');
			 item.dynamic = true;
			 item.viewState = 'club';
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
			 slideNavStore = this.getLoungeview().getList().getStore(),
			 itemToSet;

			 if(!area) {
				console.error('Lounge.markSlideNavAreaActive: no area given');
				return;
			 }

			 areaId = Ext.isNumber(area) ? area : area.get('id');

			 //deselect all items
			 slideNavStore.each(function(item) {
			 	//remove mark state of current active area
			 	if(item.get('dynamic') == true && item.get('marked') == true) {
			 		item.set('marked', false);
				 	 item.set('subtitle', '');				 	 
			 	}

			 	if(item.get('areaId') == areaId) {
			 		//grab the active area
			 		itemToSet = item;
			 	}
			 });

			 //set active area
			 if(itemToSet) {
				itemToSet.set('marked', true); 
				itemToSet.set('subtitle', spot.get('name')); 	
			 } else {
			 	console.error('Lounge.markSlideNavAreaActive: no itemToSet');
			 }
			
	 },
	 /**
	 * Jumps back to dashboard and switches to new area.
	 */
	 switchArea: function(area) {
		var loungeview = this.getLoungeview();

		this.applyAreaNameToMenuTileButtons(area);
		this.fireEvent('areaswitched', area);

		loungeview.selectByAction('show-clubdashboard');
		appHelper.showNotificationBox(i10n.translate('area.switch.notification', area.get('name')), 2000);
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
					 	console.log('Lounge.loadDashboardConfiguration: load success');
					 	if(EatSense.util.Helper.isFunction(callback)) {
					 		callback(records);
					 	}
					 } else {
					 	console.log('Lounge.loadDashboardConfiguration: no configurations found');
					 	callback();
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
	 		clubArea = this.getClubArea(),
	 		leftTileColum,
	 		rightTileColumn;

	 		leftTileColum = clubDashboard.down('#leftTileColumn');
	 		rightTileColumn = clubDashboard.down('#rightTileColumn');

	 		console.log('Lounge.buildDashboard');

	 		//masking dashboard often breaks the whole App on Android after re-checkin, products and infopages won't be shown
	 		//mask dashboard during loading. no defer required since ajax already is async
			// EatSense.util.Helper.toggleMask('loadingMsg', clubArea);

	 		this.loadDashboardConfiguration(build);
	 		

	 		//build dashboard
	 		function build(dashboardItems) {
	 			console.log('Lounge.buildDashboard: build()');

	 			if(!dashboardItems) {
	 				//no items exist
	 				clubDashboard.fireEvent('tilesrendered', clubDashboard);
	 				return;
	 			}

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

	 			//prevent panel from having a wrong size
	 			Ext.Viewport.element.repaint();
	 			clubDashboard.fireEvent('tilesrendered', clubDashboard);
	 			// EatSense.util.Helper.toggleMask(false, clubArea);

	 			return;
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
	 * Removes all dashboard tiles and clears the dashboard item store.
	 */
	 removeDashboardTiles: function() {
	 	var dbItemStore = Ext.StoreManager.lookup('ditemStore'),
	 		clubDashboard = this.getClubDashboard(),
	 		leftTileColum,
	 		rightTileColumn;

	 		dbItemStore.each(function(item) {
	 			item.destroy()
	 		});

	 		dbItemStore.removeAll();

	 		leftTileColum = clubDashboard.down('#leftTileColumn');
	 		rightTileColumn = clubDashboard.down('#rightTileColumn');

	 		if(leftTileColum) {
	 			leftTileColum.removeAll(true);
	 		}

	 		if(rightTileColumn) {
	 			rightTileColumn.removeAll(true);
	 		}
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

			//remove all dynamic items. Do this before managing the viewState. Otherwise dynamic items will be filtered
			slideNavStore.each(function(item) {
			 if(item.get('dynamic')) {
				slideNavStore.remove(item);
				item.destroy();
			 }
			});
			//show dashboard
			this.manageViewState('cloobster', true);
			this.getLoungeview().selectByAction('show-dashboard');

			this.removeDashboardTiles();
		} catch(e) {
		  console.error('Lounge.cleanup: failed ' + e);
		}
	 }
});
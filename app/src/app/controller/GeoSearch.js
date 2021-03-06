/**
* Controller for location search based on users coordinates.
*
*/
Ext.define('EatSense.controller.GeoSearch', {
	extend: 'Ext.app.Controller',
	requires: [
		'EatSense.view.geosearch.List',
		'EatSense.view.geosearch.LocationDetail',
		'Ext.Picker'],
	config: {
		refs: {
			main: 'lounge',
			dashboardGeoSearchBt: 'dashboard button[action=show-locationsearch]',
			geoSearchViewContainer: 'menucontainer[action=show-locationsearch]'
		},
		control: {
			dashboardGeoSearchBt: {
				tap: 'dashboardGeoSearchBtTapHandler'
			},
			geoSearchViewContainer: {
				show: 'showGeosearch'
			}
		},
		/**
		* @accessor
		* Last time user performed a geosearch. Used to avoid multiple queries
		* in a short time.
		*/
		lastGeoSearchQueryTime: null,
		/**
		* @accessor
		* Selected distance from user.
		*/
		selectedDistance: 5000,
		/**
		* @accessor
		* Users last known position.
		*/
		lastPosition: null,
		/**
		* @accessor
		* Locations near user.
		*/
		locations: null,
		/**
		* @accessor
		* Distances available for search.
		*/
		distanceOptions: [
            {text: '5 km', value: 5000},
            {text: '10 km', value: 10000},
            {text: '15 km', value: 15000}
        ]
	},
	
	/**
	* Dashboard button tap handler. Shows location search.
	*/
	dashboardGeoSearchBtTapHandler: function(button) {
		var main = this.getMain();

		main.selectByAction('show-locationsearch');
	},

	showGeosearch: function(container) {
		var me = this,
			geoSearchList,
			homeButton,
			distanceSelect;

		geoSearchList = Ext.create('EatSense.view.geosearch.List');

		container.add(geoSearchList);
		geoSearchList.show();

		homeButton = geoSearchList.down('homebutton');
		distanceSelect = geoSearchList.down('button[action=select-radius]');

		 if(this.getSelectedDistance()) {
			this.setRadiusButtonText(distanceSelect, this.getSelectedDistance());
		}

		//load locations after distance was evaluated
		if(me.isNewSearchAllowed(me.getSelectedDistance())) {
			appHelper.toggleMask('gps.locate', geoSearchList);
			me.locateUser(function(success, position) {
				if(success) {					
					// appHelper.toggleMask('loadingMsg', geoSearchList);
					me.loadLocationsByDistance(me.getSelectedDistance(), position, function(success, records) {
						// geoSearchList.setData(records);
						appHelper.toggleMask(false, geoSearchList);
					});		
				} else {
					appHelper.toggleMask(false, geoSearchList);
				}
			});			
		} else if(me.getLocations()) {
			// a search has been performed and a new search is not possible
			// geoSearchList.setData(me.getLocations());
		}
		

		container.on({
			hide: cleanup,
			scope: this
		});

		geoSearchList.on({
			select: listSelectHandler,
			scope: this
		});

		distanceSelect.on({
			tap: distanceSelectTapHandler,
			scope: this
		});

		if(homeButton) {
			homeButton.on({
				tap: cleanup,
				scope: this
			});
		}

		function listSelectHandler(dataview, record) {
			this.showLocationDetail(container, record);
		}
		
		function changeRadius(newRadius) {
			if(me.isNewSearchAllowed(newRadius)) {
				appHelper.toggleMask('gps.locate', geoSearchList);
				me.locateUser(function(success, position) {
					if(success) {
						// appHelper.toggleMask('loadingMsg', geoSearchList);	
						me.loadLocationsByDistance(newRadius, position, function(success, records) {
							// geoSearchList.setData(records);
							appHelper.toggleMask(false, geoSearchList);
						});	
					} else {
						appHelper.toggleMask(false, geoSearchList);
					}									
				});
				
				me.setSelectedDistance(newRadius);
			}
		}

		//Show a picker where user can select the radius
		function distanceSelectTapHandler(button) {
			var me = this,
				slots, 
				picker; 

			slots = [{
	            name: 'radius',
	            align: 'center',
	            data: me.getDistanceOptions(),
	            itemCls: 'slot-item-cls'
	        }]; 
			
			picker = Ext.create('Ext.Picker', {
	            action: 'set-radius',
	            doneButton: i10n.translate('geosearch.radiuspicker.done'),
	            cancelButton: i10n.translate('cancel'),
	            'slots': slots,
	            height: '13em',
	            modal: true,
	            listeners: {
	                change: change,
	                cancel: function() {
	                	picker.hide();
	                	picker.destroy();
	                }
	            }
	        });

			Ext.Viewport.add(picker);
	        picker.show();

	        function change(picker, value) {
	        	me.setRadiusButtonText(button, value.radius);

	        	changeRadius(value.radius);

	        	picker.hide();
	        	picker.destroy();
	        }
		}

		function cleanup() {			

			container.un({
				hide: cleanup,
				scope: this
			});

			geoSearchList.un({
				select: listSelectHandler,
				scope: this
			});

			distanceSelect.un({
				tap: distanceSelectTapHandler,
				scope: this
			});

			if(homeButton) {
				homeButton.un({
					tap: cleanup,
					scope: this
				});
			}

			// Ext.Viewport.fireEvent('showdashboard');
			geoSearchList.destroy();
		}
	},

	isNewSearchAllowed: function(distance) {
		var me = this;

		//check if a search is needed
		if(distance != me.getSelectedDistance()) {
			//proceed
			return true;
		} else if(me.getLastPosition() && me.getLastGeoSearchQueryTime()) {
			var timeDiff = getTimeDiffInSec(me.getLastGeoSearchQueryTime());

			if(timeDiff !== false && timeDiff <= appConfig.getProp('geoSearchTimeout')) {
				//do nothing to prevent search to often	
				return false;
			}
			
		}

		return true;

		function getTimeDiffInSec(time) {
			var d = (new Date()).getTime(),
				diff;

			try {
				diff =	Math.round((d-time)/1000);
			} catch(e) {
				diff = false;
				console.error('GeoSearch: failed to calculate time diff. ' + e);
			}
			
			return diff;
		}
	},

	/**
	* Get users position.
	* @param {Function} callback
	*/
	locateUser: function(callback) {
		var me = this;

		console.log('GeoSearch.locateUser: get position');
        appHelper.getCurrentPosition(function(success, position) {        	
          if(success) {
          	console.log('GeoSearch.locateUser: found position');
          	currentPosition = position;
          	me.setLastPosition(currentPosition);
          	me.setLastGeoSearchQueryTime((new Date()).getTime());
          	if(appHelper.isFunction(callback)) {
				callback(true, currentPosition);
			}
          } else {
          	console.error('GeoSearch.locateUser: failed to get current position');
          	appHelper.showNotificationBox(i10n.translate('error.gps.position'), 2000);
          	if(appHelper.isFunction(callback)) {
				callback(false);
			}
          }                  
       });
	},

	/**
	* Load locations based on users gps coords and a distance.
	* @param {Number} distance (default=5000)
	*	In meters.
	* @param {GeoPos} position
	*	The geo position
	* @param {Function} callback (optional)
	*	Executed with params success and loaded records
	*/
	loadLocationsByDistance: function(distance, position, callback) {
		var me = this,
			distance = distance || 5000,
			locationsStore = Ext.StoreManager.lookup('locationSearchStore'),
			currentPosition = position;

		if(!position) {
			console.error('GeoSearch.loadLocationsByDistance: no position given');
			return;
		}

		if(!locationsStore) {
			console.error('GeoSearch.loadLocationsByDistance: no store exists');
			return;
		}

		//dont use a mask, otherwise rendering errors can occur
		// console.log('GeoSearch.loadLocationsByDistance: get position');
  //       appHelper.getposition(function(success, position) {        	
  //         if(success) {
  //         	console.log('GeoSearch.loadLocationsByDistance: found position');
  //         	currentPosition = position;
  //         	me.setLastPosition(currentPosition);
  //         	me.setLastGeoSearchQueryTime((new Date()).getTime());
  //         	doLoadLocations();
  //         } else {
  //         	console.error('GeoSearch.loadLocationsByDistance: failed to get current position');
  //         	appHelper.showNotificationBox(i10n.translate('error.gps.position'), 2000);
  //         	if(appHelper.isFunction(callback)) {
		// 		callback(false);
		// 	}
  //         }                  
  //      });
       	
        	
        	///c/businesses?geolat=49.877823&geolong=8.654780&distance=50000        
        	console.log('GeoSearch.loadLocationsByDistance: load location');
        	
    //     	Ext.Ajax.request({
    //     		url: appConfig.getProp('serviceUrl') + '/c/businesses',
    //     		method: 'GET',
    //     		scope: this,
    //     		params: {
				// 	'distance': distance,
				// 	'geolat': position.coords.latitude,
	   //              'geolong' : position.coords.longitude
				// },
    //     		success: function(response) {
    //     			var results = Ext.JSON.decode(response.responseText);

    //     			me.setLocations(results);

    //     			if(appHelper.isFunction(callback)) {
				// 		callback(true, results);
				// 	}
    //     		},
    //     		failure: function(response) {
    //     			if(appHelper.isFunction(callback)) {
				// 		callback(false);
				// 	}
    //     		}
    //     	});
			
			//empty store before reloading
        	appHelper.clearStore('locationSearchStore', true);
			locationsStore.load({
				params: {
					'distance': distance,
					'geolat': position.coords.latitude,
	                'geolong' : position.coords.longitude
				},
				callback: function(records, operation, success) {
					// if(success) { The bug in ST 2.1 when empty array is submitted
					if(!operation.error) {
						if(appHelper.isFunction(callback)) {
							callback(true, records);
						}
					} else {
						if(appHelper.isFunction(callback)) {
							callback(false);
						}
					}
			    },
				scope: this
			});
        

	},

	/**
	* Display location details.
	*
	*/
	showLocationDetail: function(container, record) {
		var me = this,
			detailView,
			showMapsBt,
			backBt,
			checkInBt,
			content;

		// detailView = Ext.create('EatSense.view.geosearch.LocationDetail');
		detailView = Ext.create('EatSense.view.geosearch.LocationDetail', {
			location: record,
			backButton: true
		});		

		//add backbutton and logic 
		//add checkin and favorit buttons

		container.add(detailView);
		container.setActiveItem(1);
		detailView.show();
		
		showMapsBt = detailView.down('button[action=show-maps]');
		backBt = detailView.down('backbutton');
		checkInBt = detailView.down('button[action=checkin]');
		favoritBt = detailView.down('button[action=save-favorit]');	
		// this.showLocationProfilePictures(record, detailView);	

		container.on({
			hide: cleanup,
			scope: this
		});

		if(checkInBt) {
			checkInBt.on({
				tap: checkInBtHandler,
				scope: this
			});
		}

		if(favoritBt) {
			favoritBt.on({
				tap: favoriteBtHandler,
				scope: this
			});
		}

		if(showMapsBt) {
			showMapsBt.on({
				tap: showMapsBtHandler,
				scope: this
			});
		}

		if(backBt) {
			backBt.on({
				tap: backBtHandler,
				scope: this
			});
		}

		function checkInBtHandler() {
			 appHelper.toggleMask('loadingMsg' ,detailView);
             this.loadWelcomeSpotOfBusiness(record.get('id'), function(success, spot) {
               appHelper.toggleMask(false, detailView);
               if(success && spot) {
                  cleanup();
                  //TODO find a better way to jump to dashboard
                  //Or show the nickname view on demand!
                  Ext.Viewport.fireEvent('showdashboard');
                  Ext.Viewport.fireEvent('checkinwithspot', spot);
               }
             });
		}

		function favoriteBtHandler() {
			Ext.Viewport.fireEvent('addlocationastovisit', record, function(success) {
				if(success) {
					backBtHandler();
					appHelper.showNotificationBox(i10n.translate('tovisit.saved.success'), 2000);
				}
			});
		}

		function showMapsBtHandler() {
			Ext.Viewport.fireEvent('showmapforlocation', container, 2, record);
		}

		function backBtHandler() {
			container.setActiveItem(0);
			cleanup();
		}

		function cleanup() {

			container.un({
				hide: cleanup,
				scope: this
			});

			if(checkInBt) {
				checkInBt.un({
					tap: checkInBtHandler,
					scope: this
				});
			}

			if(favoritBt) {
				favoritBt.un({
					tap: favoriteBtHandler,
					scope: this
				});
			}

			if(showMapsBt) {
				showMapsBt.un({
					tap: showMapsBtHandler,
					scope: this
				});
			}

			if(backBt) {
				backBt.un({
					tap: backBtHandler,
					scope: this
				});
			}

			detailView.destroy();

		}
	},

 /**
  * Load welcome spot of given business.
  * @param {String} businessId
  *   id of business
  * @param {Function} callback
  *   Passed true|false depending on success and spot.
  *
  */
  loadWelcomeSpotOfBusiness: function(businessId, callback) {
    var me = this,
        spot,
        spotModel;

      if(!businessId || businessId.length == 0) {
        console.error('GeoSearch.loadWelcomeSpotOfBusiness: no businessId given');
        callback(false);
        return;
      } 

      Ext.Ajax.request({
        url: appConfig.serviceUrl + '/spots/welcome/',
        method: 'GET',
        params: {
          'locationId' : businessId
        },
        success: function(response) {
         //array
         spot = Ext.JSON.decode(response.responseText);
         if(Ext.isArray(spot)) {
            spot = spot[0];
         }

         spotModel = Ext.create('EatSense.model.Spot', spot);

         callback(true, spotModel);  

        },
        failure: function(response) {
         callback(false);
          me.getApplication().handleServerError({
            'error': response
          });
        },
        scope: me
      });
  },

  	/**
  	* Set radius on button in geosearch list.
  	*
  	*/
	setRadiusButtonText: function(button, radius) {
		Ext.Array.each(this.getDistanceOptions(), function(distance, index) {
			if(distance.value == radius) {
				button.setText(distance.text + ' ' + i10n.translate('geosearch.radius'));	
			}	        		
		});	
	}
});
/**
* Handles the geosearch for locations.
*
*/
Ext.define('EatSense.controller.GeoSearch', {
	extend: 'Ext.app.Controller',
	requires: [
		'EatSense.view.geosearch.List',
		'EatSense.view.geosearch.LocationDetail', 
		'EatSense.view.ContactInfo'],
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
		selectedDistance: null
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
		distanceSelect = geoSearchList.down('selectfield');

		if(this.getSelectedDistance()) {
			distanceSelect.setValue(this.getSelectedDistance());
		}
		//load locations after distance was evaluated
		this.loadLocationsByDistance(distanceSelect.getValue());

		container.on({
			hide: cleanup,
			scope: this
		});

		geoSearchList.on({
			select: listSelectHandler,
			scope: this
		});

		distanceSelect.on({
			change: distanceSelectChangeHandler,
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
		
		function distanceSelectChangeHandler(select, newVal, oldVal) {
			if(newVal != oldVal) {
				this.loadLocationsByDistance(newVal);				
				this.setSelectedDistance(newVal);
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
				change: distanceSelectChangeHandler,
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

	/**
	* Load locations based on users gps coords and a distance.
	* @param {Number} distance
	*	In meters.
	* @param {Function} callback (optional)
	*	Executed with params success and loaded records
	*/
	loadLocationsByDistance: function(distance, callback) {
		var locationsStore,
			distance = distance || 2000,
			currentPosition;

		locationsStore = Ext.StoreManager.lookup('locationSearchStore');

		if(!locationsStore) {
			console.error('GeoSearch.loadLocationsByDistance: no store found');
			return;
		}

		//dont use a mask, otherwise rendering errors can occur
        appHelper.getCurrentPosition(function(success, position) {
          if(success) {
          	currentPosition = position;
          	doLoadLocations();
          } else {
          	console.error('GeoSearch.loadLocationsByDistance: failed to get current position');
          	if(appHelper.isFunction(callback)) {
				callback(false);
			}
          }                  
       });

        function doLoadLocations() {
        	//empty store before reloading
        	appHelper.clearStore('locationSearchStore', true);
        	///c/businesses?geolat=49.877823&geolong=8.654780&distance=50000        
			locationsStore.load({
				params: {
					'distance': distance,
					'geolat': currentPosition.coords.latitude,
	                'geolong' : currentPosition.coords.longitude
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
        }

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
		// detailView.down('#actions').setHidden(false);
		checkInBt = detailView.down('button[action=checkin]');
		favoritBt = detailView.down('button[action=save-favorit]');
		// content = detailView.down('#content');
      	// imageLabel = detailView.down('#image');

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
					appHelper.showNotificationBox(i10n.translate('geosearch.tovisit.saved'), 2000);
				}
			});

			//TODO on success return to list and display a notification
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
  }
});
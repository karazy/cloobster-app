/**
* Handles the geosearch for locations.
*
*/
Ext.define('EatSense.controller.GeoSearch', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.geosearch.List', 'EatSense.view.geosearch.LocationDetail', 'EatSense.view.ContactInfo'],
	config: {
		refs: {
			main: 'lounge',
			dashboardGeoSearchBt: 'dashboard button[action=geosearch]',
			geoSearchViewContainer: 'menucontainer[action=show-geosearch]'
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

	dashboardGeoSearchBtTapHandler: function(button) {
		var main = this.getMain();

		main.selectByAction('show-geosearch');
	},

	showGeosearch: function(container) {
		var me = this,
			geoSearchList,
			backButton,
			distanceSelect;

		geoSearchList = Ext.create('EatSense.view.geosearch.List');

		container.add(geoSearchList);
		geoSearchList.show();

		backButton = geoSearchList.down('homebutton');
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

		if(backButton) {
			backButton.on({
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

			if(backButton) {
				backButton.un({
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

		locationsStore = Ext.StoreManager.lookup('businessStore');

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
          	if(appHelper.isFunction(callback)) {
				callback(false);
			}
          }                  
       });

        function doLoadLocations() {
			locationsStore.load({
				params: {
					'distance': distance,
					'lat': currentPosition.coords.latitude,
	                'long' : currentPosition.coords.longitude
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
			backBt,
			checkInBt,
			content;

		// detailView = Ext.create('EatSense.view.geosearch.LocationDetail');
		detailView = Ext.create('EatSense.view.ContactInfo', {
			location: record,
			backButton: true
			// items: [
			// 	{
			// 		backButton: true
			// 	}
			// ]
		});

		//add backbutton and logic 
		//add checkin and favorit buttons

		container.add(detailView);
		container.setActiveItem(1);
		detailView.show();
		

		// backBt = detailView.down('backbutton');
		detailView.down('#actions').setHidden(false);
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
				tap: favoritBtHandler,
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

		function favoritBtHandler() {
			Ext.Viewport.fireEvent('addlocationastovisit', record);
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
					tap: favoritBtHandler,
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
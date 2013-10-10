/**
* Handles the geosearch for locations.
*
*/
Ext.define('EatSense.controller.GeoSearch', {
	extend: 'Ext.app.Controller',
	requires: [],
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
			select: this.showLocationDetail,
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
				select: this.showLocationDetail,
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

	showLocationDetail: function(dataview, record) {
		var me = this;


		function cleanup() {

		}
	}
});
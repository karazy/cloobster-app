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
		lastGeoSearchQueryTime: null
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

	loadLocationsByDistance: function(distance, callback) {
		var locationsStore,
			distance = distance || 2000;

		locationsStore = Ext.StoreManager.lookup('businessStore');

		if(!locationsStore) {
			console.error('GeoSearch.loadLocationsByDistance: no store found');
			return;
		}

		locationsStore.load({
			params: {
				'distance': distance
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

	showLocationDetail: function(dataview, record) {
		var me = this;


		function cleanup() {

		}
	}
});
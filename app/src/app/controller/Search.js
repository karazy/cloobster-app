Ext.define('EatSense.controller.Search', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.locationsearch.Search'],
	config: {
		refs: {
			lounge: 'lounge',
			locationSearchView: 'locationsearch',
			dashboardLocationButton: 'dashboard button[action=show-locationsearch]'
		},
		control: {
			locationSearchView: {
				show: 'showLocationSearch',
				hide: 'hideLocationSearch'
			},
			dashboardLocationButton: {
				tap: 'dashboardLocationButtonTap'
			}
		},

	},
	showLocationSearch: function(panel) {
		this.searchLocations();
	},

	hideLocationSearch: function(panel) {
	},

	dashboardLocationButtonTap: function() {
		if(this.getLounge()) {
			this.getLounge().selectByAction('show-locationsearch');	
		}		
	},

	searchLocations: function() {
		var store = Ext.StoreManager.lookup('locationSearchStore');

		appHelper.getCurrentPosition(loadLocations);

		if(!store) {
			console.error('Search: no store found');
			return;
		}

		//TODO temporary solution
		//Add pull to refresh?!
		appHelper.clearStore('locationSearchStore', false);

		function loadLocations(success, geoPos) {
			//http://127.0.0.1:8888/c/businesses?geolat=49.877823&geolong=8.654780&distance=50000
			store.load({
				params: {
					'geolat': geoPos.coords.latitude,
					'geolong': geoPos.coords.longitude
				},
				success: function(records) {
					
				}
			});
		}
	}
});
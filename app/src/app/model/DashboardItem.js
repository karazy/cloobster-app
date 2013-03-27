/**
* Represents a service area.
*/
Ext.define('EatSense.model.DashboardItem', {
	extend: 'Ext.data.Model',
	requires: [],
	config: {
		fields: [
			'id',
			'type'
		],	
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses/{pathId}/dashboarditems',
	 		reader: {
	 			type: 'json'
	 		}
		}
	}
});
/**
* Represents a service area.
*/
Ext.define('EatSense.model.Area', {
	extend: 'Ext.data.Model',
	requires: [],
	config: {
		fields: [
			'id',
			'name',
			'description',
			'welcome',
			'barcodeRequired'
		],	
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses/{pathId}/areas',
	 		reader: {
	 			type: 'json'
	 		}
		}
	}
});
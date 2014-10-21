Ext.define('EatSense.store.LocationSearch', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Business'],
	config: {
		storeId: 'locationSearchStore',
		model: 'EatSense.model.Business',
		// pageSize: 15,
		// syncRemovedRecords: false
	}
});
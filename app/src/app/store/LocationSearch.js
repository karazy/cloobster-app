Ext.define('EatSense.store.LocationSearch', {
	extend: 'EatSense.override.AssociationsStore',
	requires: ['EatSense.model.LocationLight'],
	config: {
		storeId: 'locationSearchStore',
		model: 'EatSense.model.LocationLight',
		syncRemovedRecords: false,
		assocations: 'images'
	}
});	
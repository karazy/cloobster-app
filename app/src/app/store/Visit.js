Ext.define('EatSense.store.Visit', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Visit'],
	config: {
		storeId: 'visitStore',
		model: 'EatSense.model.Visit',
		pageSize: 15	
	}
})
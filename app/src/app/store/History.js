Ext.define('EatSense.store.History', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.History'],
	config: {
		storeId: 'historyStore',
		model: 'EatSense.model.History',
		pageSize: 15
	}
})
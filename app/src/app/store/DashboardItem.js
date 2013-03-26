Ext.define('EatSense.store.DashboardItem', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.DashboardItem'],
	config: {
		storeId: 'areaStore',
		model: 'EatSense.model.DashboardItem',
		syncRemovedRecords: false
	}
});
Ext.define('EatSense.store.DashboardItem', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.DashboardItem'],
	config: {
		storeId: 'ditemStore',
		model: 'EatSense.model.DashboardItem',
		syncRemovedRecords: false,
        sorters: [
      {
          property : "name",
          direction: "ASC"
      }
    ]
	}
});
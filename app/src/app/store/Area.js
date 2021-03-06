Ext.define('EatSense.store.Area', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Area'],
	config: {
		storeId: 'areaStore',
		model: 'EatSense.model.Area',
		syncRemovedRecords: false,
        sorters: [
      {
          property : "name",
          direction: "ASC"
      }
    ]
	}
});
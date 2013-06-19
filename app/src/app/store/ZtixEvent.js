Ext.define('EatSense.store.ZtixEvent', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.ZtixEvent'],
	config: {
		storeId: 'ztixEventsStore',
		model: 'EatSense.model.ZtixEvent',
		syncRemovedRecords: false,
        sorters: [
	      // {
	      //     property : "name",
	      //     direction: "ASC"
	      // }
    	]
	}
});
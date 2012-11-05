Ext.define('EatSense.store.InfoPage', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.InfoPage'],
	config: {
		storeId: 'infopageStore',
		model: 'EatSense.model.InfoPage',,
		grouper: {
            groupFn: function(record) {
                return record.get('title').substr(0, 1);
            },
            sortProperty: 'title'
        }
	}
})
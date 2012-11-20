Ext.define('EatSense.store.InfoPage', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.InfoPage'],
	config: {
		storeId: 'infopageStore',
		model: 'EatSense.model.InfoPage',
		grouper: {
            groupFn: function(record) {
            	var title = record.get('title') || '';

            	if(title) {
            		title = title.substr(0, 1)
            	}

                return title;
            },
            sortProperty: 'title'
    },
    sorters: [
      {
          property : "title",
          direction: "ASC"
      }
    ]
	}
});
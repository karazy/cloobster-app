Ext.define('EatSense.store.InfoPage', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.InfoPage'],
	config: {
		storeId: 'infopageStore',
		model: 'EatSense.model.InfoPage',
		// grouper: {
  //           groupFn: function(record) {
  //           	var type = record.get('type') || '';

  //           	if(type.toUpperCase() == 'LINK') {
  //           		type = "Links";
  //           	} else {
  //               type = "A-Z"
  //             }

  //               return type;
  //           },
  //           sortProperty: 'type'
  //   },
    sorters: [
      {
          property : "title",
          direction: "ASC"
      }
    ]
	}
});
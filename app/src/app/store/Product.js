Ext.define('EatSense.store.Product', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Product'],
	config: {
		storeId: 'productStore',
		model: 'EatSense.model.Product',
		sorters: [
		    {
		    	property: 'order',
                direction: 'ASC'
            }
		],
		// filters: [
  //       	{
  //       	    property: 'special',
  //           	value   : true
  // 	      }
  //   	]
	}
});
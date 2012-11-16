Ext.define('EatSense.store.Order', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Order'],
	config: {
		storeId: 'orderStore',
		model: 'EatSense.model.Order',
		syncRemovedRecords: false,
		filters: [
			{ 
				filterFn: function(record, id) {
					return (record.get('status') == appConstants.Order.PLACED 
						|| record.get('status') == appConstants.Order.RECEIVED
						|| record.get('status') == appConstants.Order.CANCELED);
	 			}
	 		}
	 	],
	 	grouper: {
            groupFn: function(record) {
                return record.get('status');
            }
        },
          sorters: [
        {
            property : "orderTime",
            direction: "DESC"
        }
    ]
	}
})
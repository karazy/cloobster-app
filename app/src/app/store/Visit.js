Ext.define('EatSense.store.Visit', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.Visit'],
	config: {
		storeId: 'visitStore',
		model: 'EatSense.model.Visit',
		pageSize: 15,
		syncRemovedRecords: false,
		// grouper: {
  //           groupFn: function(record) {
  //           	var date = record.get('visitDate'),
  //           		year;
  //           	if(date) {
  //           		year = date.getFullYear();
  //           		console.log('YEAR ' + year + "loca " + record.get('locationName'));
  //           		return year;
  //           	} else {
  //           		console.log("loca" + record.get('locationName'));
  //           		return i10n.translate('tovisit.grouper.undefined');
  //           	}
  //           }
  //       }
	}
});
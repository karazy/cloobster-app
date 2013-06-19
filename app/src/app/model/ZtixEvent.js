Ext.define('EatSense.model.ZtixEvent', {
	extend: 'Ext.data.Model',
	requires: ['Ext.data.reader.Xml'],
	config: {
		idProperty: 'evid',
		fields: [
		{
			name: 'evid'
		},
		{
			name: 'title'
		},
		{
			name: 'date',
			type : 'date',
			dateFormat: 'Y-m-d'
		},
		{
			name: 'location'
		}
		],
		proxy : {
			type: 'ajax',
	        url : 'http://88.198.11.203/xmlExport/index.php/main/getEvents/001',
	        enablePagingParams: false,
	        reader: {
	        	    type: 'xml',
	            	record: 'event',
	            	rootProperty: 'events'
	    	    }
			}
	}
});
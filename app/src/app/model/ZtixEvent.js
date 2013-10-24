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
			name: 'time'
		},
		{
			name: 'leting'
		},
		{
			name: 'location'
		},
		{
			name: 'locationCommon'
		},
		{
			name: 'locationStreet'
		},
		{
			name: 'locationZip'
		},
		{
			name: 'locationCity'
		},
		{
			name: 'locationAppendix'
		},
		{
			name: 'link'
		},
		{
			name: 'infpic'
		}	,
		{
			name: 'subtitle'
		},
		{
			name: 'info'
		},
		{
			name: 'isFree',
			type: 'boolean'
		}
		],
		proxy : {
			type: 'ajax',
	        // url : 'http://88.198.11.203/xmlExport/index.php/main/getEvents/{pathId}',
	        enablePagingParams: false,
	        reader: {
	        	    type: 'xml',
	            	record: 'event',
	            	rootProperty: 'events'
	    	    }
			}
	}
});
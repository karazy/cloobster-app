/**
* This class overrides the getRecordData method to enable saving
* of nested objects. 
* Solution source: http://www.sencha.com/forum/showthread.php?124362-Nested-loading-nested-saving-in-new-data-package
*/
Ext.define('EatSense.override.CustomJsonWriter', {
	extend: 'Ext.data.writer.Json',

	getRecordData: function(record) { 
		var _data = this.callParent([record]);
		//call original getRecord method, to ignore fields marked as persist = false
		Ext.apply(_data, record.getAssociatedData());
		return _data; 
	}
});
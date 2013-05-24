/**
* An Image model.
*/
Ext.define('EatSense.model.Image', {
	extend: 'Ext.data.Model',
	requires: [],
	config: {
		fields: [
			{
				name: 'id'
			},
			{
				name: 'blobKey'
			},
			{
				name: 'url'
			}
		]
	}
});
/**
* An Image model.
*/
Ext.define('EatSense.model.Image', {
	extend: 'Ext.data.Model',
	requires: [],
	config: {
		idProperty: 'fakeId',
		fields: [
			{
				name: 'fakeId',
				persist: false
			},
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
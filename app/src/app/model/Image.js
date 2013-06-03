/**
* An Image model.
*/
Ext.define('EatSense.model.Image', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'blobKey',
		identifier: {
			type: 'none'
		},
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
		],
		proxy: {
			//add dummy proxy to prevent error messages
		}
	}
});
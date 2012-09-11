Ext.define('EatSense.model.Profile', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{
				name: 'id'
			},
			{
				name: 'nickname'
			}
		],
		proxy: {
			type: 'rest',
			url: '/c/profiles',
			enablePagingParams: false
		}
	}
});
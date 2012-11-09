Ext.define('EatSense.model.Profile', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{
				name: 'id'
			},
			{
				name: 'nickname'
			},
			{	//id of account profile
				name: 'profileId',
				persist: false
			}
		],
		proxy: {
			type: 'rest',
			url: '/c/profiles',
			enablePagingParams: false
		}
	}
});
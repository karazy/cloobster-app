Ext.define('EatSense.model.Account', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
		{
			name: 'id'
		},
		{
			name: 'login'
		},
		{
			name: 'password'
		},
		{
			name: 'email'
		},
		{
			name: 'accessToken'
		},
		{
			name: 'role'
		},
		{	
			name: 'accessToken'
		},
		{	//the active customer checkin, used during signup to link a checkin 
			name: 'checkInId'
		},
		{	//id of account profile
			name: 'profileId'
		}
		],
		validations: [
		 	{type: 'presence',  field: 'email'},
            {type: 'email', field: 'email'},
            {type: 'format',    field: 'password', matcher: /^(?=[!-~]*$)(?=.*([^A-Za-z0-9]|\d))(?=.*[a-zA-Z]).*$/}
        ],
        associations: [
            { 
            	type: 'hasOne', 
            	model: 'EatSense.model.Profile', 
            	foreignKey: 'profileId' 
            }
        ],
		proxy : {
			type : 'rest',
			enablePagingParams: false,
			url : '/c/accounts/',
			reader : {
				type : 'json',
			}
		}
	}
});
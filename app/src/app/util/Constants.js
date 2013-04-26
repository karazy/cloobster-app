Ext.define('EatSense.util.Constants', {
	alternateClassName: ['appConstants'],
	statics : {
		//check in status
		INTENT : 'INTENT',
		CHECKEDIN : 'CHECKEDIN',
		ORDER_PLACED : 'ORDER_PLACED',
		PAYMENT_REQUEST : 'PAYMENT_REQUEST',
		COMPLETE : 'COMPLETE',
		CANCEL_ALL : 'CANCEL_ALL',
		WAS_INACTIVE : 'WAS_INACTIVE',
		Order : {
			CART : 'CART',
			PLACED : 'PLACED',
			RECEIVED: 'RECEIVED',
			CANCELED : 'CANCELED',
			COMPLETE : 'COMPLETE'
		},
		Request : {
			CALL_WAITER : 'CALL_WAITER'
		},
		//regular expressions for different currencies
		Currency : {
			EUR: '$1,$2 €',
			USD: '\$ $1.$2'
		},
		//general date time format
		DateTimeFormat : {
			'DE' : 'd.m.Y H:i',
			'EN' : 'm/d/Y H:i'
		},
		//general date format
		DateFormat : {
			'DE' : 'd.m.Y',
			'EN' : 'm/d/Y'
		},
		//Client side 
		FORCE_LOGOUT : 'FORCE_LOGOUT',
		USER_LOGGED_IN : 'USER_LOGGED_IN',
		USER_LOGGED_OUT : 'USER_LOGGED_OUT'
	}
});


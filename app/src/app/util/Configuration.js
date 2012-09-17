Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		currencyFormat: 'EURO',
		version: "1.3-beta2",
		//true means caching is disabled
		disableCaching: false,
		language: 'DE',
		channelReconnectTimeout: 10000,
		channelReconnectTries: 20,
		heartbeatInterval: 10000
	}
});
Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		//default format is EUR, can be changed during runtime depending on business
		currencyFormat: 'EUR',
		version: 'v1.5-13-gb01a409',
		//true means caching is disabled
		disableCaching: false,
		//contains the language during runtime used througout the application
		language: null,
		defaultLanguage: 'EN',
		channelReconnectTimeout: 10000,
		channelReconnectTries: 20,
		heartbeatInterval: 10000,
		// Interval for channel ping messages.
		channelPingInterval: 120000,
		// Amount of time in ms to wait for a channel message after ping.
		channelMessageTimeout: 40000
	}
});
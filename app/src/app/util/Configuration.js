Ext.define('EatSense.util.Configuration', {
	alternateClassName: ['appConfig'],
	statics: {
		serviceUrl : '',
		msgboxHideTimeout: 1000,
		msgboxHideLongTimeout: 1500,
		//default format is EUR, can be changed during runtime depending on business
		currencyFormat: 'EUR',
		version: 'v1.5-10-g5d35219',
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
		channelMessageTimeout: 40000,
		//version indicator of the backend api, will be increased when the api changes
		//in such a way that an old cloobster version is not compatible anymore
		cloobsterApi: 2,
		/**
		* @cfg {String}
		* Use '_blank' to open urls in ChildBrowser, use '_systen' to open in
		* system browser.
		*/
		urlBrowserMode: '_system',
		/**
		* Configuration for ztix service
		*/
		'de-ztix' : {
			baseUrl: 'http://88.198.11.203/xmlExport/index.php/main/getCloobsterEvents/'
		},
		/**
		* Returns value of a property.
		* @param {String} property
		* @return 
		*	False if property not found. Otherwise value.
		*/
		getProp: function(property) {
			var _props = property.split('.'),
				_temp = this;

			if(!property) {
				return false;
			}

			for (var i = 0; i < _props.length; i++) {
				if(!_temp.hasOwnProperty(_props[i])) {
					return false;
				}

				_temp = _temp[_props[i]];
			};

			return _temp;
		}

	}
});
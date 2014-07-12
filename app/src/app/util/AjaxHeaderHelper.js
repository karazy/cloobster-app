/**
* Provides helper methods to deal with ajax default headers.
*
*/
Ext.define('EatSense.util.AjaxHeaderHelper', {
	alternateClassName: ['headerUtil'],
	requires: ['Ext.Ajax'],
	singleton: true,

	config: {

	},

	/**
	* Wipes all Ajax Headers and sets an empty object.
	*
	*/
	clearAll: function() {
		Ext.Ajax.setDefaultHeaders({});
	},
	/**
	* Deletes given header values.
	* @param properties
	*	String array with header values to delete
	*/
	resetHeaders: function(properties) {
		var defaultHeaders = Ext.Ajax.getDefaultHeaders();

		//skip if no headers exists
		if(defaultHeaders) {
			try {
				Ext.Array.each(properties, function(prop) {
					delete defaultHeaders[prop];
				});			
			} catch(e) {
				console.log("AjaxHeaderHelper.resetHeaders: " + e);
			}
		};
	},
	/**
	* Adds given headers to ajax default headers.
	* @param headerValues
	*	Object which gets applied to existing headers. E.g. {'pathId' : 'abc123'}
	*/
	addHeaders: function(headerValues) {
		var defaultHeaders = Ext.Ajax.getDefaultHeaders() || {};

		Ext.apply(defaultHeaders, headerValues);

		if(!Ext.Ajax.getDefaultHeaders()) {
			Ext.Ajax.setDefaultHeaders(defaultHeaders);
		}
	},
	/**
	* Shorthand function for @see EatSense.util.AjaxHeaderHelper.addHeaders
	*/
	addHeader: function(prop, value) {
		var config = {};

		config[prop] = value;

		this.addHeaders(config);
	},
	/**
	* Returns value of requestes header property.
	* @prop
	*	Property to return value for.
	* @return null if nothing was found or headers don't exist or prop is null. Value otherwise.
	*/
	getHeaderValue: function(prop) {
		var value;

		if(!prop) {
			return null;
		}

		if(!this.getHeaders()) {
			return null;
		}

		value = this.getHeaders()[prop];

		return value;

	},
	/**
	* Returns Ajax headers. Shorthand for @see Ext.Ajax.getDefaultHeaders
	*/
	getHeaders: function() {
		return Ext.Ajax.getDefaultHeaders();
	}

});
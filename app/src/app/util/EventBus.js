/**
* 
*
*/
Ext.define('EatSense.util.EventBus', {
	alternateClassName: ['appEventBus'],
	requires: [],
	singleton: true,

	broadcastEvent: function(eventName) {
		this.fireEvent(eventName, arguments.slice(1, arguments.length));
	}
});
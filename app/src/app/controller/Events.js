/**
* Loads and handles events data from ztix API and displays it.
* All relevant information from {@link EatSense.model.ZtixEvent} is displayed her.
*/
Ext.define('EatSense.controller.Events', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
			refs: {
				eventsArea : 'eventsarea'
			},
		control: {
			eventsArea: {
				show: 'showEventsArea'
			}
		}
	},
	showEventsArea: function(area) {
		var store = Ext.StoreManager.lookup('ztixEventsStore');

		store.load();
	}
});
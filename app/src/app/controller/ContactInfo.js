/**
* 
* 
*/
Ext.define('EatSense.controller.ContactInfo', {
	extend: 'Ext.app.Controller',
	requires: [],
	refs: {
		contactInfoView : 'contactinfo'
	},
	control: {
		contactInfoView: {
			show: 'showContactInfo'
		}
	},

	showContactInfo: function(panel) {
		var location = this.getApplication().getController('CheckIn').getBusiness();
		console.log('ContactInfo.showContactInfo');

		if(location) {
			panel.setLocation(location);
		}
	}
});
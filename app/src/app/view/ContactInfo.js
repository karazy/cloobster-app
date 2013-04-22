/**
* Shows contact information of a location.
* If adress exists shows a google map of the location.
*/
Ext.define('EatSense.view.ContactInfo', {
	extend: 'Ext.Panel',
	xtype: 'contactinfo',
	config: {
		layout: 'vbox',
		scrollable: 'vertical',
		/**
		* @cfg location
		* The record displayed on this page. Must be of type @see{EatSense.model.Business}
		*/
		location: null,
		items: [
			{
				xtype: 'label',
				itemId: 'content',
				tpl: new Ext.XTemplate(
					'<div class="">',
						'<div>{name}</div>',
						'<div>{slogan}</div>',
						'<div>{description}</div>',
						'<div>{url}</div>',
						'<div>{address}</div>',
						'<div>{postcode}</div>',
						'<div>{phone}</div>',
					'</div>'
				)
			}
		]
	},

	updateLocation: function(newValue, oldValue) {
		var content,
			tpl;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			console.log('EatSense.view.ContactInfo.updateLocation');

			if(content) {
				console.log('EatSense.view.ContactInfo.updateLocation: Render info for location ' + newValue.get('name'));
				tpl = content.getTpl();

				tpl.overwrite(content.element, newValue.getData());
			}
		} else {
			//no location given
			tpl.overwrite(content.element, '');
		}
	}
});

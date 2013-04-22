/**
* Shows contact information of a location.
* If adress exists shows a google map of the location.
*/
Ext.define('EatSense.view.ContactInfo', {
	extend: 'Ext.Panel',
	requires: ['Ext.Map'],
	xtype: 'contactinfo',
	config: {		
		/**
		* @cfg location
		* The record displayed on this page. Must be of type @see{EatSense.model.Business}
		*/
		location: null,
		layout: 'card',
		activeItem: 0,
		items: [			
			{
				xtype: 'backbuttonpanel',
				homeButton: true,
				layout: {
					type: 'vbox',
					pack: 'start',
					align: 'start'
				},
				scrollable: 'vertical',
				padding: 5,
				items: [
					{
						xtype: 'titlebar',
						title: i10n.translate('contactinfo.title'),
						docked: 'top',
						items: [
						]
					},
					{
						xtype: 'label',
						itemId: 'content',
						// cls: 'contactinfo-main-data',
						// flex: 1,
						tpl: new Ext.XTemplate(
							'<div class="contactinfo-main-data">',
								'<div class="name">{name}</div>',
								'<div class="slogan">{slogan}</div>',
								'<div class="description">{description}</div>',
								// '<div>{postcode} | {address}</div>',
							'</div>'
						)
					},
					// {
					// 	xtype: 'label',
					// 	html: i10n.translate('contactinfo.address'),
					// 	margin: '7 0 0 0'
					// },
					// {
					// 	xtype: 'label',
					// 	html: i10n.translate('contactinfo.website'),
					// 	margin: '7 0 0 0'
					// },
					{
						xtype: 'fixedbutton',
						action: 'open-link',
						text: i10n.translate('contactinfo.location.url'),
						iconCls: 'look',
						iconMask: true,
						hidden: true,
						ui: 'action',
						margin: '7 0 5 0',
						width: '50%'
					},
					// {
					// 	xtype: 'label',
					// 	margin: '7 0 0 0',
					// 	html: i10n.translate('contactinfo.phonenumbers')
					// },
					{
						xtype: 'fixedbutton',
						action: 'call-location',
						text: i10n.translate('contactinfo.location.phone'),
						iconCls: 'phone1',
						iconMask: true,
						hidden: true,
						ui: 'action',
						margin: '7 0 5 0',
						width: '50%'
					},
					{
						xtype: 'label',
						itemId: 'address',
						margin: '7 0 5 0',
						cls: 'general-text',
						tpl: new Ext.XTemplate(
							'<div class="">',
								'<div>{address} | {postcode} | {city}</div>',
							'</div>'
						)
					},
					{
						xtype: 'map',
						margin: '7 0 0 0',
						useCurrentLocation: true,						
						width: '100%',
						height: '300px',
						// flex: 1
					}
				]
			}			
		]
	},

	updateLocation: function(newValue, oldValue) {
		var content,
			address,
			tpl,
			openLocationUrlBt,
			callLocationBt;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			address = this.down('#address');
			console.log('EatSense.view.ContactInfo.updateLocation');

			callLocationBt = this.down('button[action=call-location]');
			openLocationUrlBt = this.down('button[action=open-link]');

			if(content) {
				console.log('EatSense.view.ContactInfo.updateLocation: Render info for location ' + newValue.get('name'));
				tpl = content.getTpl();

				tpl.overwrite(content.element, newValue.getData());
			}

			if(content) {
				address.getTpl().overwrite(address.element, newValue.getData());
			}

			if(callLocationBt) {
				if(newValue.get('phone')) {
					callLocationBt.setHidden(false);
					callLocationBt.on({
						tap: function() {
							window.location.href= 'tel:' + newValue.get('phone');
						},
						scope: this
					})	
				} else {
					callLocationBt.setHidden(true);
				}			
			}

			if(openLocationUrlBt) {
				if(newValue.get('url')) {
					openLocationUrlBt.setHidden(false);
					openLocationUrlBt.on({
						tap: function() {
							window.open(encodeURI('http://' + newValue.get('url')), '_blank');
						},
						scope: this
					})	
				} else {
					openLocationUrlBt.setHidden(true);
				}			
			}

		} else {
			//no location given
			tpl.overwrite(content.element, '');
		}
	}
});

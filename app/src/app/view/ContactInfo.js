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
				padding: '10px 15px',
				defaults: {
					width: '100%'
				},
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
						margin: '0 0 20 0',
						tpl: new Ext.XTemplate(
							'<div class="contactinfo-main-data">',
								'<div class="name">{name}</div>',
								'<div class="description">{description}</div>',
							'</div>'
						)
					},			
					{
						xtype: 'panel',
						itemId: 'mainPhone',
						margin: '3 0',
						layout: {
							type: 'hbox',
							align: 'start'
						},
						items: [
							{
								xtype: 'label',
								cls: 'general-text',
								flex: 2
							},
							{
								xtype: 'fixedbutton',
								action: 'call-location',
								text: i10n.translate('contactinfo.location.phone'),
								iconCls: 'phone1',
								iconMask: true,
								hidden: true,
								ui: 'action',
								flex: 1
							}
						]
					},
					{
						xtype: 'panel',
						margin: '3 0',
						layout: {
							type: 'hbox',
							align: 'start'
						},
						items: [
							{
								xtype: 'label',
								itemId: 'address',
								cls: 'general-text',
								tpl: new Ext.XTemplate(
									'<div class="">',
										'<div>{address} | {postcode} | {city}</div>',
									'</div>'
								),
								flex: 2
							},					
							{
								xtype: 'fixedbutton',
								action: 'show-maps',
								text: i10n.translate('contactinfo.map.title'),
								iconCls: 'globe2',
								iconMask: true,
								ui: 'action',
								flex: 1
							}	
						]
					},
					{
						xtype: 'panel',
						itemId: 'mainUrl',
						margin: '3 0',
						layout: {
							type: 'hbox',
							align: 'start'
						},
						items: [
							{
								xtype: 'label',
								cls: 'general-text',
								flex: 2
							},
							{
								xtype: 'fixedbutton',
								action: 'open-link',
								text: i10n.translate('contactinfo.location.url'),
								iconCls: 'look',
								iconMask: true,
								hidden: true,
								ui: 'action',
								flex: 1
							}
						]
					},	
					{
						xtype: 'label',
						itemId: 'slogan',
						margin: '20px 0 10px 0',
						tpl: new Ext.XTemplate(
							'<div class="contactinfo-main-data">',
								'<div class="slogan">{slogan}</div>',
							'</div>'
						)
					},
					{
						xtype: 'panel',
						itemId: 'profilePictures'
					}
					
				]
			},
			{
				xtype: 'backbuttonpanel',
				backButton: true,
				layout: {
					type: 'fit'
				},
				items: [
					{
						xtype: 'titlebar',
						title: i10n.translate('contactinfo.map.title'),
						docked: 'top',
						items: [
							{
								xtype: 'fixedbutton',
								action: 'open-maps',
								text: i10n.translate('contactinfo.location.maps'),
								iconCls: 'globe2',
								iconMask: true,
								hidden: true,
								ui: 'action',
								align: 'right'
							}
						]
					}
					//add map dynamically to further reduce load times
					// {
					// 	xtype: 'map',
					// 	mapOptions: {
					// 		draggable: true,
					// 		disableDefaultUI: false
					// 	}
					// }
				]
			}	
		]
	},

	updateLocation: function(newValue, oldValue) {
		var content,
			slogan,
			address,
			tpl,
			urlPanel,
			openLocationUrlBt,
			callLocationBt,
			gmap,
			mapsMarker,
			phonePanel;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			slogan = this.down('#slogan');
			address = this.down('#address');
			console.log('EatSense.view.ContactInfo.updateLocation');

			gmap = this.down('map');

			phonePanel = this.down('#mainPhone');
			callLocationBt = this.down('button[action=call-location]');

			urlPanel = this.down('#mainUrl');
			openLocationUrlBt = this.down('button[action=open-link]');

			if(content) {
				// console.log('EatSense.view.ContactInfo.updateLocation: Render info for location ' + newValue.get('name'));
				tpl = content.getTpl();

				tpl.overwrite(content.element, newValue.getData());
			}

			if(slogan) {
				slogan.getTpl().overwrite(slogan.element, newValue.getData());
			}

			if(address) {
				address.getTpl().overwrite(address.element, newValue.getData());
			}

			if(phonePanel) {
				phonePanel.down('label').setHtml(newValue.get('phone'));
			}

			if(callLocationBt) {
				if(newValue.get('phone')) {
					callLocationBt.setHidden(false);
					callLocationBt.on({
						tap: function() {
							window.location.href = 'tel:' + newValue.get('phone');
						},
						scope: this
					})	;
				} else {
					callLocationBt.setHidden(true);
				}			
			}
			
			if(urlPanel) {
				urlPanel.down('label').setHtml(newValue.get('url'));
			}

			if(openLocationUrlBt) {
				if(newValue.get('url')) {
					openLocationUrlBt.setHidden(false);
					openLocationUrlBt.on({
						tap: function() {
							window.open(encodeURI('http://' + newValue.get('url')), '_blank');
						},
						scope: this
					});
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

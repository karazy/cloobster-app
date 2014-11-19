/**
* Displays details of a location accessed by geosearch.
*
*/
Ext.define('EatSense.view.geosearch.LocationDetail', {
	extend: 'Ext.Panel',
	xtype: 'locationdetail',
	requires: ['Ext.Map'],
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
				homeButton: false,
				backButton: true,
				layout: {
					type: 'vbox',
					pack: 'start',
					align: 'stretch'
				},
				scrollable: 'vertical',
				padding: '10px 30px 8px 30px',
				items: [
					{
						xtype: 'titlebar',
						// title: i10n.translate('contactinfo.title'),
						docked: 'top',
						items: [
						]
					},
					{
						xtype: 'panel',
						docked: 'bottom',
						layout: {
							type: 'hbox',
							align: 'start'
						},
						margin: '0 0 8 0',
						items: [					
							{
								xtype: 'fixedbutton',
								action: 'checkin',
							    text: i10n.translate('tovisit.detail.sneakinbutton'),
							    ui: 'action',
							    margin: '7 7 0 30',
							    flex: 1,
							    baseCls: 'dashboard-button',
							    cls: ['dashboard-button-checkin', 'right'],								
								pressedCls: 'dashboard-button-pressed',
								labelCls: 'dashboard-button-label'
							},
							{
								xtype: 'fixedbutton',
								ui: 'action',
								action: 'save-favorit',
								margin: '7 30 0 7',
								flex: 1,
								text: i10n.translate('save'),
								baseCls: 'dashboard-button',
								cls: ['dashboard-button-checkin', 'right'],								
								pressedCls: 'dashboard-button-pressed',
								labelCls: 'dashboard-button-label'
							}
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
						layout: {
							type: 'hbox',
							align: 'start'
						},
						style: {
							'word-break' : 'break-word'
						},
						items: [
							{
								xtype: 'label',
								cls: 'general-text',
								flex: 3,
								margin: '0'
							},
							{
								xtype: 'fixedbutton',
								action: 'call-location',
								// text: i10n.translate('contactinfo.location.phone'),
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
						margin: '10 0 0 0',
						layout: {
							type: 'hbox',
							align: 'start'
						},
						style: {
							'word-break' : 'break-word'
						},
						items: [
							{
								xtype: 'label',
								itemId: 'address',
								cls: 'general-text',
								flex: 3,
								margin: '0'
							},
							{
								xtype: 'fixedbutton',
								action: 'show-maps',
								// text: i10n.translate('contactinfo.map.title'),
								iconCls: 'globe2',
								iconMask: true,
								hidden: true,
								ui: 'action',
								flex: 1
							}	
						]
					},
					{
						xtype: 'fixedbutton',
						action: 'open-link',
						text: i10n.translate('contactinfo.location.url'),
						iconCls: 'look',
						iconMask: true,
						hidden: true,
						ui: 'action',
						margin: '10 0 0 0'
					},
					{
						xtype: 'fixedbutton',
						action: 'open-fburl',
						text: i10n.translate('contactinfo.fburl'),
						iconCls: 'fb-signup',
						iconMask: true,
						hidden: true,
						ui: 'action',
						margin: '10 0 0 0'
					},
					{
						xtype: 'label',
						itemId: 'slogan',
						margin: '20 0 0 0'
					},
					{
						xtype: 'panel',
						itemId: 'profilePictures',
						margin: '20 0 0 0'
					}
					
				]
			}
		],
		//configuration for maps view
		// mapsViewTemplate: {
		// 	xtype: 'backbuttonpanel',
		// 	itemId: 'mapsPanel',
		// 	backButton: true,
		// 	layout: {
		// 		type: 'fit'
		// 	},
		// 	items: [
		// 		{
		// 			xtype: 'titlebar',
		// 			title: i10n.translate('contactinfo.map.title'),
		// 			docked: 'top',
		// 			items: [
		// 				{
		// 					xtype: 'fixedbutton',
		// 					action: 'open-maps',
		// 					text: i10n.translate('contactinfo.location.maps'),
		// 					iconCls: 'globe2',
		// 					iconMask: true,
		// 					hidden: true,
		// 					ui: 'action',
		// 					align: 'right'
		// 				}
		// 			]
		// 		}
		// 	]
		// }
	},

	updateLocation: function(newValue, oldValue) {
		var content,
			slogan,
			address,
			tpl,
			urlPanel,
			openLocationUrlBt,
			callLocationBt,
			showMapsBt,
			gmap,
			mapsMarker,
			phonePanel,
			fbPanel,
			fbBt;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			slogan = this.down('#slogan');
			address = this.down('#address');
			fbPanel = this.down('#fbUrl');
			showMapsBt = this.down('button[action=show-maps]');			
			console.log('EatSense.view.ContactInfo.updateLocation');

			gmap = this.down('map');

			phonePanel = this.down('#mainPhone');
			callLocationBt = this.down('button[action=call-location]');

			urlPanel = this.down('#mainUrl');
			openLocationUrlBt = this.down('button[action=open-link]');	
			fbBt = this.down('button[action="open-fburl"]');		

			if(content) {
				tpl = content.getTpl();

				tpl.overwrite(content.element, newValue.getData());
			}

			if(slogan) {
				slogan.setHtml(newValue.get('slogan'));
			}

			if(address) {				
				address.setHtml(appHelper.formatBusinessAddress(newValue.getData()));
			}

			// if(fbPanel) {
			// 	fbPanel.down('label').setHtml(newValue.get('fbUrl'));
			// }

			if(showMapsBt) {
				if(newValue.get('address') || newValue.get('city') || newValue.get('postcode')) {
					showMapsBt.setHidden(false);	
				} else {
					showMapsBt.setHidden(true);
				}
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
			
			// if(urlPanel) {
			// 	urlPanel.down('label').setHtml(newValue.get('url'));
			// }

			if(openLocationUrlBt) {
				if(newValue.get('url')) {
					openLocationUrlBt.setHidden(false);
					openLocationUrlBt.on({
						tap: function() {
							window.open(encodeURI(appHelper.createValidUrl(newValue.get('url'))), appConfig.urlBrowserMode);
						},
						scope: this
					});
				} else {
					openLocationUrlBt.setHidden(true);
				}
			}

			if(fbBt) {
				if(newValue.get('fbUrl')) {
					fbBt.setHidden(false);
					fbBt.on({
						tap: function() {
							window.open(encodeURI(appHelper.createValidUrl(newValue.get('fbUrl'))), appConfig.urlBrowserMode);
						},
						scope: this
					});
				} else {
					fbBt.setHidden(true);
				}
			}	

		} else {
			//no location given
			tpl.overwrite(content.element, '');
		}
	}
});

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
								// '<div class="description">{description}</div>',
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
						xtype: 'fixedbutton',
						action: 'show-maps',
						text: i10n.translate('contactinfo.map.title'),
						iconCls: 'globe2',
						iconMask: true,
						ui: 'action',
						margin: '7 0 5 0',
						width: '50%'
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
					},
					{
						xtype: 'map',
						mapOptions: {
							draggable: true,
							disableDefaultUI: false
						}
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
			callLocationBt,
			openMapsBt,
			gmap,
			mapsMarker;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			address = this.down('#address');
			console.log('EatSense.view.ContactInfo.updateLocation');

			gmap = this.down('map');
			callLocationBt = this.down('button[action=call-location]');
			openLocationUrlBt = this.down('button[action=open-link]');
			openMapsBt = this.down('button[action=open-maps]');

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
							window.location.href = 'tel:' + newValue.get('phone');
						},
						scope: this
					})	;
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
					});
				} else {
					openLocationUrlBt.setHidden(true);
				}			
			}

			if(google && google.maps) {

				//draw the google map based on given address
				function codeAddress() {
				  var address = newValue.get('address') + ' ' + newValue.get('postcode') + ' ' + newValue.get('city'),
				  	  myLatlng,
				  	  mapsAddress;
				  geocoder = new google.maps.Geocoder();
				  geocoder.geocode( { 'address': address}, function(results, status) {				  	
				    if (status == google.maps.GeocoderStatus.OK) {
				    	// myLatlng = results[0].geometry.location;
				    	// myLatlng = new google.maps.LatLng(50.935420, 6.965394);


				    	gmap.setHidden(false);
				    	gmap.getMap().setZoom(14);
				    	gmap.getMap().setCenter(results[0].geometry.location);				      	

				      	var marker = new google.maps.Marker({
				          	map: gmap.getMap(),
				          	position: results[0].geometry.location
				      	});

				      	

						//android maps calls http://developer.android.com/guide/appendix/g-app-intents.html		
						//ios maps calls									
						openMapsBt.setHidden(false);
						openMapsBt.on({
							tap: function() {
								//use address search instead of coords, otherwise no marker is shown
								if(Ext.os.is.Android) {
									mapsAddress = encodeURI('geo:0,0?q=' + newValue.get('address') + '+' + newValue.get('postcode') + '+' + newValue.get('city'));
								} else if(Ext.os.is.iOS) { 
									mapsAddress = encodeURI('maps:?q=' + newValue.get('address') + '+' + newValue.get('postcode') + '+' + newValue.get('city'));
								}
								if(mapsAddress) {
									window.location.href = mapsAddress;	
								}
								
								// window.location.href = encodeURI('geo:' + myLatlng.lat() + ',' + myLatlng.lng());
							},
							scope: this
						});

				    } else {
				    	console.log('EatSense.view.ContactInfo: Geocode was not successful for the following reason ' + status);
				    	gmap.setHidden(true);
				    	openMapsBt.setHidden(true);
				    }
				  });
				}

				Ext.create('Ext.util.DelayedTask', function () {
					codeAddress();
        		}).delay(300);
			}			

		} else {
			//no location given
			tpl.overwrite(content.element, '');
		}
	}
});

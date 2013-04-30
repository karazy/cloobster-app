/**
* Shows basic information about the checked in location.
* All relevant information from {@link EatSense.model.Business} is displayed her.
*/
Ext.define('EatSense.controller.ContactInfo', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
			refs: {
			contactInfoView : 'contactinfo',
			contactInfoShowMapsBt: 'contactinfo button[action=show-maps]',
			contactInfoMapsBackBt: 'contactinfo button[action=back]'
		},
		control: {
			contactInfoView: {
				show: 'showContactInfo'
			},
			contactInfoShowMapsBt: {
				tap: 'showMaps'
			},
			contactInfoMapsBackBt: {
				tap: 'backToContactInfo'
			}
		}	
	},
	

	showContactInfo: function(panel) {
		var location = this.getApplication().getController('CheckIn').getActiveBusiness();
		console.log('ContactInfo.showContactInfo');

		panel.setActiveItem(0);
		//delay data setup
		Ext.create('Ext.util.DelayedTask', function () {
			if(location) {
				panel.setLocation(location);
				this.showLocationProfilePictures(location);
			}
		}, this).delay(300);	
	},
	/**
	* Back button tap event. Return to contact view from map view.
	*/
	backToContactInfo: function() {
		var contactInfoView = this.getContactInfoView();

		if(contactInfoView) {
			contactInfoView.setActiveItem(0);
		}
	},
	/**
	* Display the map based on the address of current location.
	*/
	showMaps: function() {
		var contactInfoView = this.getContactInfoView(),
			location = this.getApplication().getController('CheckIn').getActiveBusiness(),
			openMapsBt,
			gmap;

		if(contactInfoView) {
			contactInfoView.setActiveItem(1);

			if(google && google.maps) {
				
				openMapsBt = contactInfoView.down('button[action=open-maps]');
				gmap = contactInfoView.down('map');

				if(!gmap) {
					//create only on demand because this is costly
					gmap = Ext.create('Ext.Map', {
						mapOptions: {
							draggable: true,
							disableDefaultUI: false
						}
					});
					contactInfoView.getActiveItem().add(gmap);
				}

				//draw the google map based on given address
				function codeAddress() {
				  var address = location.get('address') + ' ' + location.get('postcode') + ' ' + location.get('city'),
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
									mapsAddress = encodeURI('geo:0,0?q=' + location.get('address') + '+' + location.get('postcode') + '+' + location.get('city'));
								} else if(Ext.os.is.iOS) { 
									//Apple Docs http://developer.apple.com/library/ios/#featuredarticles/iPhoneURLScheme_Reference/Articles/MapLinks.html only open in Safari
									//however http://stackoverflow.com/questions/14503551/phonegap-open-navigation-directions-in-apple-maps-app works
									mapsAddress = encodeURI('http://maps.apple.com/?q=' + location.get('address') + '+' + location.get('postcode') + '+' + location.get('city'));
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

		}
	},
	/**
	* Show location profile pictures in contact details.
	* @param {EatSense.model.Business} business
	*	Contains the profile information.
	*/
	showLocationProfilePictures: function(business) {
		var contactInfoView = this.getContactInfoView(),
			infoHeader,
			tpl,
			html,
			imagePanel,
			scaleFactor = '=s720',
			profilePicturesExist;	

			if(!business) {
				console.error('InfoPage.showHotelInfoHeader: no business given');
				return;	
			}		

			renderProfilePics(contactInfoView);
		

			function renderProfilePics(panel) {

				profilePictures = panel.down('#profilePictures');

				//show profile pictures in infopageoverview
				if(business && business.raw && business.raw.images) {
					//check for pictures
					profilePicturesExist = business.raw.images.picture1 || business.raw.images.picture2 || business.raw.images.picture3;
				}

				if(profilePicturesExist) {
					profilePictures.removeAll();
					profilePictures.setHidden(false);									

					if(business.raw.images.picture3) {
						
						imagePanel = Ext.create('Ext.Panel', {
							width: '100%',
							height: 150,
							margin: '5 0 5 0',
							style: {
								'background-image': 'url(' + business.raw.images.picture3.url + scaleFactor + ')',
								'background-size' : 'cover',
								'background-position' : 'center'
							}
						});

						// panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture1.url + scaleFactor);

						profilePictures.add(imagePanel);
					}

					if(business.raw.images.picture2) {
						
						imagePanel = Ext.create('Ext.Panel', {
							width: '100%',
							height: 150,
							margin: '5 0 5 0',
							style: {
								'background-image': 'url(' + business.raw.images.picture2.url + scaleFactor + ')',
								'background-size' : 'cover',
								'background-position' : 'center'					
							}
						});

						// panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture2.url + scaleFactor);

						profilePictures.add(imagePanel);
					}

					if(business.raw.images.picture1) {				
						imagePanel = Ext.create('Ext.Panel', {
							width: '100%',
							height: 150,
							margin: '5 0 5 0',
							style: {
								'background-image': 'url(' + business.raw.images.picture1.url + scaleFactor + ')',
								'background-size' : 'cover',
								'background-position' : 'center'
							}
						});

						// panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture3.url + scaleFactor);

						profilePictures.add(imagePanel);
					}
					// profilePictures.setActiveItem(0);
				} else {
					profilePictures.removeAll();
					profilePictures.setHidden(true);
				}
			}
	}

});
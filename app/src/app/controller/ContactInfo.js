/**
* Shows basic information about the checked in location.
* All relevant information from {@link EatSense.model.Business} is displayed her.
*/
Ext.define('EatSense.controller.ContactInfo', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.contactinfo.Map'],
	config: {
			refs: {
			contactInfoView : 'contactinfo',
			contactInfoShowMapsBt: 'contactinfo button[action=show-maps]',
			contactInfoMapsBackBt: 'contactinfo button[action=back]'
		},
		control: {
			contactInfoView: {
				show: 'showContactInfo',
				hide: 'hideContactInfo'
			}, 
			contactInfoShowMapsBt: {
				tap: 'showMapsBtTapHandler'
			},
			contactInfoMapsBackBt: {
				tap: 'backToContactInfo'
			}
		},
		//the location to display
		location: null,
		mapCreated: false,
		mapMarker: null,
		coords: null
	},

	launch: function() {
		Ext.Viewport.on({
			'showmapforlocation' : this.showMaps,
			scope: this
		});
	},
	
	/**
	* Show event handler for {@link EatSense.view.ContactInfo}.
	* @param {Ext.Component} panel
	*/
	showContactInfo: function(panel) {
		var location = this.getApplication().getController('CheckIn').getActiveBusiness();
		console.log('ContactInfo.showContactInfo');

		panel.setActiveItem(0);

		//delay data setup
		Ext.create('Ext.util.DelayedTask', function () {
			//only refresh when this is a new location
			if(location && location != this.getLocation()) {
				this.setCoords(null);
				this.setMapCreated(false);
				this.setMapMarker(null);
				this.setLocation(location);
				panel.setLocation(location);
				this.showLocationProfilePictures(location);
				if(this.getLocation().get('geoLat') && this.getLocation().get('geoLong')) {
					this.setCoords(new google.maps.LatLng(this.getLocation().get('geoLat'), this.getLocation().get('geoLong')));					
				}
			}
		}, this).delay(300);	
	},

	hideContactInfo: function(panel) {
		var mapPanel = panel.down('#mapsPanel');

		if(mapPanel) {
			panel.remove(mapPanel, true);	
		}
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
	* Tap event handler for contactInfoShowMapsBt.
	*/
	showMapsBtTapHandler: function(button) {
		var contactInfoView = this.getContactInfoView(),
			location = this.getApplication().getController('CheckIn').getActiveBusiness();

		this.showMaps(contactInfoView, 1, location);
	},
	/**
	* Display the map based on the address of current location.
	*/
	showMaps: function(container, indexToAdd, location) {
		var me = this,
			// contactInfoView = this.getContactInfoView(),
			// location = this.getApplication().getController('CheckIn').getActiveBusiness(),
			coords,
			openMapsBt,
			gmap,
			mapsAddress;

		if(!container) {
			console.error('ContactInfo.showMaps: no container');
			return;
		}

		if(!indexToAdd) {
			console.error('ContactInfo.showMaps: no indexToAdd');
			return;
		}

		if(!location) {
			console.error('ContactInfo.showMaps: no location');
			return;
		}

		if(location.get('geoLat') && location.get('geoLong')) {
			coords = new google.maps.LatLng(location.get('geoLat'), location.get('geoLong'));
		}

			// if(!container.down('#mapsPanel')) {
			// 	container.add(container.getMapsViewTemplate());					
			// }
			container.add(Ext.create('EatSense.view.contactinfo.Map'));
			
			container.setActiveItem(indexToAdd);			
			
			//container, index, location, coords

			console.log('ContactInfo.showMaps: create map');


			//only proceed if google maps is included
			if(google && google.maps) {
				//TODO correct?
				openMapsBt = contactInfoView.down('button[action=open-maps]');
				gmap = contactInfoView.down('map');
				
				contactInfoView.getAt(indexToAdd).on({
					hide: cleanup,
					scope: this
				});				

				if(!gmap) {
					//create only on demand because this is costly
					gmap = Ext.create('Ext.Map', {
						mapOptions: {
							draggable: true,
							disableDefaultUI: true
						}
					});

					container.getActiveItem().add(gmap);

					gmap.on({
						'painted': function(panel) {
							Ext.create('Ext.util.DelayedTask', function () {
						        appHelper.redirectUrls(panel);							
						    }, this).delay(2000);     							
						},
						single: true,
						scope: this
					});
				}

				//currently not working on ios
				if(!Ext.os.is.iOS) {					
					openMapsBt.setHidden(false);
					openMapsBt.on({
						tap: openNativeMaps,
						scope: this
					});					
				}

				//map already rendered, reset center and return
				if(coords) {
					Ext.create('Ext.util.DelayedTask', function () {
						var marker = 
						appHelper.setMapMarker({
		                	latitude : coords.lat(),
		                	longitude : coords.lng()
		            	}, gmap, this.getMapMarker());

		            	this.setMapMarker(marker);  	
				    }, this).delay(300);
				    return;  						
				}							

				Ext.create('Ext.util.DelayedTask', function () {
					codeAddress();
        		}).delay(300);

        		this.setMapCreated(true);
			}

			//draw the google map based on given address
			function codeAddress() {
			  var address = location.get('address') + ' ' + location.get('postcode') + ' ' + location.get('city'),
			  	  myLatlng;

			  geocoder = new google.maps.Geocoder();
			  geocoder.geocode( { 'address': address}, function(results, status) {				  	
			    if (status == google.maps.GeocoderStatus.OK) {
			    	// myLatlng = results[0].geometry.location;
			    	// myLatlng = new google.maps.LatLng(50.935420, 6.965394);
			    	coords = results[0].geometry.location;
			    	// me.setCoords(results[0].geometry.location);

			    	gmap.setHidden(false);
			    	// gmap.getMap().setZoom(16);
			    	// gmap.getMap().setCenter(results[0].geometry.location);	      	

			     //  	var marker = new google.maps.Marker({
			     //      	map: gmap.getMap(),
			     //      	position: results[0].geometry.location
			     //  	});

			      	var marker = 
						appHelper.setMapMarker({
		                	latitude : results[0].geometry.location.lat(),
		                	longitude : results[0].geometry.location.lng()
		            	}, gmap);

			      	me.setMapMarker(marker);	    
					

			    } else {
			    	console.log('ContactInfo: Geocode was not successful for the following reason ' + status);
			    	gmap.setHidden(true);
			    	openMapsBt.setHidden(true);
			    	Ext.Msg.alert('', i10n.translate('tovisit.map.nogeodata'));
			    }
			  });
			}

			function openNativeMaps()  {
				//android maps calls http://developer.android.com/guide/appendix/g-app-intents.html		
				//ios maps calls
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
			}

			function cleanup() {
				if(openMapsBt) {
					openMapsBt.un({
						tap: openNativeMaps,
						scope: this
					});
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
				console.error('InfoPage.showLocationProfilePictures: no business given');
				return;	
			}			

			renderProfilePics(contactInfoView);
		

			function renderProfilePics(panel) {
				console.log('InfoPage.showLocationProfilePictures: renderProfilePics');

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
							margin: '10 0 0 0',
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
							margin: '10 0 0 0',
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
							margin: '10 0 0 0',
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
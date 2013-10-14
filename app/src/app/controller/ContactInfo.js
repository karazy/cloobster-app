/**
* Shows basic information about the checked in location.
* All relevant information from {@link EatSense.model.Business} is displayed her.
*/
Ext.define('EatSense.controller.ContactInfo', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.contactinfo.Info', 'EatSense.view.contactinfo.Map'],
	config: {
		refs: {
			contactInfoViewContainer: 'menucontainer[action=show-contactinfo]',
			contactInfoView : 'contactinfo',
			// contactInfoShowMapsBt: 'contactinfo button[action=show-maps]',
			// contactInfoMapsBackBt: 'contactinfo button[action=back]'
		},
		control: {
			contactInfoViewContainer: {
				show: 'showContactInfoViewContainer'
			},
			contactInfoView: {
				// show: 'showContactInfo',
				// hide: 'hideContactInfo'
			},
			// contactInfoShowMapsBt: {
			// 	tap: 'showMaps'
			// },
			// contactInfoMapsBackBt: {
			// 	tap: 'backToContactInfo'
			// }
		},
		//the location to display
		location: null,
		mapCreated: false,
		mapMarker: null,
		coords: null
	},

	/**
	*
	*
	*/
	showContactInfoViewContainer: function(container) {
		var contactInfoView;

		contactInfoView = Ext.create('EatSense.view.contactinfo.Info');

		container.add(contactInfoView);
		container.setActiveItem(0);
		contactInfoView.show();

		this.showContactInfo(contactInfoView, container);

		// container.on({
		// 	hide: cleanup,
		// 	scope: this
		// });

		// function cleanup() {
		// 	container.un({
		// 		hide: cleanup,
		// 		scope: this
		// 	});

		// 	contactInfoView.destroy();
		// }
	},
	
	/**
	* Show event handler for ContactInfo
	* @param {EatSense.view.ContactInfo} panel
	*/
	showContactInfo: function(panel, container, cardIndex) {
		var me = this,
			location = panel.getLocation() || this.getApplication().getController('CheckIn').getActiveBusiness(),
			showMapsBt,
			activeItemIndex = cardIndex || 0,
			backBt;

		container.setActiveItem(cardIndex);

		showMapsBt = panel.down('button[action=show-maps]');
		backBt = panel.down('backbutton');


		container.on({
			hide: cleanup,
			scope: this
		});

		showMapsBt.on({
			tap: doShowMaps,
			scope: this
		});

		if(backBt) {
			backBt.on({
				tap: backBtHandler,
				scope: this
			});
		}

		//delay data setup
		Ext.create('Ext.util.DelayedTask', function () {
			//only refresh when this is a new location
			//20131008 since we delete the view on hide we have to refresh
			if(location) {
				this.setCoords(null);
				this.setMapCreated(false);
				this.setMapMarker(null);
				this.setLocation(location);
				panel.setLocation(location);
				this.showLocationProfilePictures(location, panel);
				if(this.getLocation().get('geoLat') && this.getLocation().get('geoLong')) {
					this.setCoords(new google.maps.LatLng(this.getLocation().get('geoLat'), this.getLocation().get('geoLong')));					
				}
			}
		}, this).delay(300);

		function backBtHandler(button) {
			container.setActiveItem(cardIndex);
		}

		function doShowMaps(button) {
			me.showMaps(container);
		}

		function cleanup() {
			showMapsBt.un({
				tap: doShowMaps,
				scope: this
			});

			if(backBt) {
				backBt.un({
					tap: backBtHandler,
					scope: this
				});
			}

			container.un({
				hide: cleanup,
				scope: this
			});

			panel.destroy();

		}
	},

	// hideContactInfo: function(panel) {
	// 	var mapPanel = panel.down('#mapsPanel');

	// 	if(mapPanel) {
	// 		panel.remove(mapPanel, true);	
	// 	}		
	// },
	/**
	* Back button tap event. Return to contact view from map view.
	*/
	// backToContactInfo: function() {
	// 	var contactInfoView = this.getContactInfoView();

	// 	if(contactInfoView) {
	// 		contactInfoView.setActiveItem(0);
	// 	}
	// },

	/**
	* Display the map based on the address of current location.
	* @param {Ext.Panel} container
	* View where to add the map as panel.
	*/
	showMaps: function(container) {
		var me = this,
			mapView,
			location = this.getApplication().getController('CheckIn').getActiveBusiness(),
			openMapsBt,
			backBt,
			gmap,
			mapsAddress,
			activeItemIndex;

		if(container) {
			activeItemIndex = container.getInnerItems().indexOf(container.getActiveItem()) + 1;
			
			if(container.down('contactinfomap')) {
				container.setActiveItem(activeItemIndex);
				return;				
			}
			// if(!container.down('contactinfomap')) {
			mapView = Ext.create('EatSense.view.contactinfo.Map');
			container.add(mapView);					
			// }			
			
			container.setActiveItem(activeItemIndex);

			backBt = mapView.down('backbutton');
			
			if(backBt) {
				backBt.on({
					tap: backBtHandler,
					scope: this
				});
			}

			console.log('ContactInfo.showMaps: create map');


			//only proceed if google maps is included
			if(google && google.maps) {
				
				openMapsBt = mapView.down('button[action=open-maps]');

				gmap = mapView.down('map');
				
				container.on({
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
				if(this.getCoords()) {
					Ext.create('Ext.util.DelayedTask', function () {
						var marker = 
						appHelper.setMapMarker({
		                	latitude : this.getCoords().lat(),
		                	longitude : this.getCoords().lng()
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
			    	me.setCoords(results[0].geometry.location);

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

			function backBtHandler() {
				container.setActiveItem(activeItemIndex - 1);
			}

			function cleanup() {
				if(openMapsBt) {
					openMapsBt.un({
						tap: openNativeMaps,
						scope: this
					});
				}

				if(backBt) {
					backBt.un({
						tap: backBtHandler,
						scope: this
					});
				}

				container.un({
					hide: cleanup,
					scope: this
				});	

				mapView.destroy();
			}

		}
	},
	/**
	* Show location profile pictures in contact details.
	* @param {EatSense.model.Business} business
	*	Contains the profile information.
	* @param {EatSense.view.components.Info} contactInfoView
	* 	ContactInfo view where pictures get rendered.
	*/
	showLocationProfilePictures: function(business, contactInfoView) {
		var infoHeader,
			tpl,
			html,
			imagePanel,
			scaleFactor = '=s720',
			profilePicturesExist;	

			if(!business) {
				console.error('InfoPage.showLocationProfilePictures: no business given');
				return;	
			}	

			if(!contactInfoView) {
				console.error('InfoPage.showLocationProfilePictures: no contactInfoView given');
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
/**
* 
* 
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
		},	
	},
	

	showContactInfo: function(panel) {
		var location = this.getApplication().getController('CheckIn').getActiveBusiness();
		console.log('ContactInfo.showContactInfo');

		panel.setActiveItem(0);

		if(location) {
			panel.setLocation(location);
		}
	},

	backToContactInfo: function() {
		var contactInfoView = this.getContactInfoView();

		if(contactInfoView) {
			contactInfoView.setActiveItem(0);
		}
	},

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
									mapsAddress = encodeURI('maps:?q=' + location.get('address') + '+' + location.get('postcode') + '+' + location.get('city'));
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
	}

});
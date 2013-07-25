/**
* Controller handles ToVisit and old CheckIns.
* 
*/
Ext.define('EatSense.controller.History', {
	extend: 'Ext.app.Controller',

    /**
     * @event addtovisit
     * Add a to visit based on given qr code.
     * Fires on Ext.Viewport.
     * @param {String} qrCode
     *  Code of a spot which sould be used to optain location info.
     */ 

     /**
     * @event addactivebusinessastovisit   
     * Use active CheckIn to create a ToVisit.
     * Fires on Ext.Viewport.
     */
     

	requires: ['EatSense.view.History', 'EatSense.view.VisitNew', 'EatSense.view.VisitDetail', 'EatSense.view.NoLocation'],
	config: {
		refs: {
			mainView : 'lounge',
         placesOverview: 'placesoverview',
         cloobsterArea: 'cloobsterarea',
			dashboard : 'lounge dashboard',
			historyView : 'lounge history',
			historyList : 'lounge history list',
			backDetailButton : 'historydetail button[action=back]',
         toVisitButton: 'dashboard button[action=tovisit]',
         toVisitList: 'dashboard list',
			historyDetailView: 'lounge historydetail',
			historyDetailOrderList : 'historydetail #historyOrders',
         toVisitNewView: {
            selector: 'visitnew',
            xtype: 'visitnew',
            autoCreate: true
         }
		},
		control: {
         toVisitButton: {
            tap: function(button) {
               this.checkForToVisitAction();
            },
            scope: this
         },
         toVisitList: {
            select: 'showToVisitDetail'
         },
			backDetailButton: {
				tap: 'backToHistory'
			},
			historyList : {
				itemtap : 'showHistoryDetail'
			},
         placesOverview: {
            show: 'showHistory',
            hide: 'hidePlaces'
         }
		},
      toVisitImageStyle: {
         'background-size' : '100% auto',
         'background-position' : 'center',
         'background-repeat' : 'no-repeat',
         'height' : '300px',
         'margin' : '5px'
      }
	},	
   launch: function() {

      Ext.Viewport.on({
         'userlogin': function(account) {
            Ext.create('Ext.util.DelayedTask', function () {
                  this.loadVisits();
            }, this).delay(100);
         },
         'userlogout' : function() {
            this.clearVisits();
         },
         'addtovisit' : function(qrCode) {
            this.checkForToVisitAction(qrCode);
         },
         'addactivebusinessastovisit' : function() {
            //TODO would be cleaner without controller call
            var _activeBusiness = this.getApplication().getController('CheckIn').getActiveBusiness();
            this.checkForToVisitAction(null, _activeBusiness);
         },
         scope: this
      });
   },
	/**
	* Event handler for history button.
	* Shows the history view.
	*/
	showHistory: function(button) {
		var me = this,
          placesOverview,
			 historyView = this.getHistoryView(),
          loggedIn = this.getApplication().getController('Account').isLoggedIn();

         // show history view    
         placesOverview = this.getPlacesOverview();
         if(!placesOverview) {
            console.error('History.showHistory: placesOverview does not exist, maybe has not been created?');
            return;
         }

         placesOverview.switchTo(historyView);

         //if user has no account or is not logged in show alert window
         //this already gets handled before
         if(!loggedIn) {
            Ext.Msg.show({
               message: i10n.translate('account.required'),
               buttons: [{
                  text: i10n.translate('ok'),
                  itemId: 'yes',
                  ui: 'action'
               }],
               scope: this
            });
         } 
         else {    
            //delay for faster rendering and prevent android from not showing the list on first access
            Ext.create('Ext.util.DelayedTask', function () {
               me.loadHistory();
            }).delay(300);                          
            
         }
	},

   /**
   * Hide event handler.
   * @param {Ext.Panel} placesOverview
   *  placesOverview throwing the hide event.
   */
   hidePlaces: function(placesOverview) {
      var historyList;

      if(!placesOverview) {
         console.error('History.hidePlaces: no placesOverview given');
         return;
      }

      historyList = placesOverview.down('history list');

      if(!historyList) {
         console.error('History.hidePlaces: no historyList not found');
         return;  
      }

       historyList.deselectAll();
   },

   /**
   * Loads the history for logged in user.
   * History will be stored in historyStore.
   */
   loadHistory: function() {
   		var me = this,
             historyStore = Ext.StoreManager.lookup('historyStore'),
   			 historyList = this.getHistoryList(),
             descPanel = this.getHistoryView().down('#historyListDescPanel');

   		historyStore.loadPage(1, {
   			callback: function(records, operation, success) {
   				if(operation.error) {
   					me.getApplication().handleServerError({
							'error': operation.error,
							//accessToken invalid
							'userLogout': {403: true}
					   });

                  if(operation.error.status == 403) {
                     me.showDashboard();
                  }
   				} else {
                  if(records.length == 0) {
                     //show description when empty
                     descPanel.setHidden(false);
                     historyList.setHidden(true);
                  } else {
                     descPanel.setHidden(true);
                     historyList.setHidden(false);
                     historyList.refresh();               
                     
                  }
               }
   			}
   		});   		

   },

   //start history detail
   /**
   * Tap event handler for history list.
   * Loads all orders assigned to selected history element and shows them in a detail view.
   */
   showHistoryDetail: function(view, index, htmlElement, history) {
   		var me = this,
             placesOverview = this.getPlacesOverview(),
   			 historyDetailView,
   			 header,
   			 footer;

         historyDetailView = placesOverview.down('historydetail');

         if(!historyDetailView) {
            console.error('History.showHistoryDetail: historyDetailView not found');
            return;
         }

         header = historyDetailView.down('#header');
         footer = historyDetailView.down('#footer');

   		header.getTpl().overwrite(header.element, history.getData());
   		footer.getTpl().overwrite(footer.element, history.getData());

   		this.loadHistoryOrders(history);


   		placesOverview.switchTo(historyDetailView, 'left');
   },
   /**
   * Event handler for back button tap in history detail view.
   */
   backToHistoryButton: function(button) {
      this.backToHistory();
   },
   /**
   * Jump back to history overview.
   */
   backToHistory: function() {
   	var placesOverview = this.getPlacesOverview(),
   		 historyView = this.getHistoryView();

   	placesOverview.switchTo(historyView, 'right');      
   },
   /**
   * Loads all orders for given history.
   * @param history
   *	History to load orders for.
   */
   loadHistoryOrders: function(history) {
   		var me = this,
   			 list = this.getHistoryDetailOrderList();

         if(!history) {
            console.error('History.loadHistoryOrders: no history given');
            return;
         }

   		list.getStore().removeAll();

   		list.getStore().load({
   			params: {
   				'pathId' : history.get('businessId'),
   				'checkInId' : history.getId(),
   				'status' : appConstants.Order.COMPLETE
   			},
   			callback: function(records, operation, success) {
   				if(success) {
   					Ext.Array.each(records, function(order) {
   						order.calculate();
   					});
   					list.refresh();
   				} else {
   					me.getApplication().handleServerError({
							'error': operation.error,
							//accessToken invalid
							'userLogout': {403: true}
					   });

                  if(operation.error.status == 403) {
                     me.showDashboard();
                  }
   				}
   			}
   		});
   },

   //end history detail

   /**
   * Checks if user is logged in an then shows toVisistNewView.
   * @param {String} qrCode (optional)
   *  If given gets passed to {@see EatSense.controller.History#showToVisitNewView} and directly loads a cloobster location.
   * @param {EatSense.model.Business} business (optional)
   */
   checkForToVisitAction: function(qrCode, business) {
      var me = this;
      
      Ext.Viewport.fireEvent('accountrequired', loginCallback);

      function loginCallback(success) {

         if(success) {
            me.showToVisitNewView({
               'qrCode' : qrCode,
               'business' : business
            });
         }
      }    
   },

   /**
   * Shows a to view to create a new to visit
   * @param {Object} options
   * In options -->
   * @param {EatSense.model.Visit} existingToVisit (optional)
   *  If given, updates an exisiting toVisit instead of creating a new one.
   * @param {Funcion} callback (optional)
   * @param {String} qrCode (optional)
   *     Used to directly load a business and prefill toVisit.
   * @param {EatSense.model.Business} business (optional)
   *     Used given business to save toVisit.
   */
   showToVisitNewView: function(options) {
      var me = this,
          //extract parameters
          options = options || {},
          existingToVisit = options.existingToVisit,
          toVisit = options.existingToVisit || Ext.create('EatSense.model.Visit'),
          callback = options.callback,
          qrCode = options.qrCode,
          location = 
          lounge =  this.getMainView(),
          view = this.getToVisitNewView(),
          form,
          backBt,
          createBt,
          business = options.business,
          datePickerField,
          scanBt,
          clearDateBt,
          cameraBt,
          deletePictureBt,
          imageLabel,
          gmap,
          noMapHintLabel,
          titlebar,
          values,          
          locationNameField,
          locationNameLabel,
          geoPos;

      Ext.Viewport.add(view);
      view.show();

      form = view.down('formpanel');
      backBt = view.down('backbutton');
      createBt = view.down('button[action=create]');
      scanBt = view.down('button[action=scan]');
      cameraBt = view.down('button[action=capture-photo]');
      locationNameField = form.down('textfield[name=locationName]');
      locationNameLabel = form.down('#locationNameLabel');
      commentField = form.down('textfield[name=comment]');
      datePickerField = form.down('datepickerfield');
      clearDateBt = form.down('button[action=delete-visitdate]');      
      deletePictureBt = form.down('button[action=delete-photo]');      
      imageLabel = form.down('#image');
      noMapHintLabel = form.down('#noMapHint');
      titlebar = view.down('titlebar');
      
      if(!existingToVisit && !qrCode && !business) {
         setupMap();         
      }

      if(!toVisit.get('locationId') && !business) {
         //if this is not a cloobster location
         scanBt.setHidden(false);
      }

      if(existingToVisit) {
         setFormFields(existingToVisit);
         //currently does not use a title
         // titlebar.setTitle(i10n.translate('tovisit.title.existing'));
         if(existingToVisit.getImage()) {
            // console.log('History.showToVisitNewView: set imageTransient false');
            existingToVisit.set('imageTransient', false);
            existingToVisit.setImageBackup(existingToVisit.getImage().getData(true));
         }         
      }


      
      if(business) {
         //if called with business use it and get the data
         business = business.getData(true);
         scanCallback(true, business);
      }
      else if(qrCode) {
         //if called with a qrCode, directly loads corresponding business
            Ext.create('Ext.util.DelayedTask', function () {
               doLoadBusiness(qrCode);
            }, this).delay(300);
      }

      backBt.on({
         tap: backBtTap,
         scope: this
      });

      createBt.on({
         tap: saveOrUpdateToVisit,
         scope: this
      });

      scanBt.on({
         tap: scanBtTap,
         scope: this
      });

      cameraBt.on({
         tap: cameraBtTap,
         scope: this
      });

      deletePictureBt.on({
         tap: deletePictureBtTap,
         scope: this
      });


      if(Ext.os.is.Android) {
         //Bugfix for #589
         doFireSkipKeyBoardEvent(true);

         // form.down('textareafield').on({
         //    // order: 'before',
         //    blur: this.doFireSkipKeyBoardEvent,
         //    scope: this
         // });
         // datePickerField.getComponent().setUseMask(false);

         datePickerField.on({
            // order: 'before',
            focus: function(picker) {
               picker.getPicker().fireAction('tap');
            },
            delay:500,
            scope: this
         });

         // datePickerField.on('focus', function() {
         //       this.doFireSkipKeyBoardEvent();
         //    },
         //    this, {
         //       // delay: 1000
         //    }, 'before'
         //    );
         
      }

      Ext.Viewport.fireEvent('addbackhandler', cleanup);
      

      //TEST start
      // var img = Ext.create('EatSense.model.Image',{
      //    id: 'toVisitImage',
      //    blobKey: 'ASDSAGAHNA§FN$TANVAIBDSfsdfue4bf',
      //    url: 'http://robohash.org/Fred'
      // });
      // toVisit.setImage(img);
      // imageLabel.setHidden(false);
      // imageLabel.setStyle(
      //    Ext.Object.merge({}, me.getToVisitImageStyle(), {'background-image': 'url('+toVisit.getImage().get('url')+')' })
      // );
      // deletePictureBt.setDisabled(false);
      //TEST end

      function saveOrUpdateToVisit() {
         values = form.getValues();

         if(!values.locationName || values.locationName.trim().length == 0) {
            Ext.Msg.alert('', i10n.translate('tovisit.form.locationname.required'));
            return;
         }

         toVisit.set('locationName', values.locationName);
         toVisit.set('comment', values.comment);
         
         if(geoPos) {
            toVisit.set('geoLong', geoPos.coords.longitude);
            toVisit.set('geoLat', geoPos.coords.latitude);
         }

         if(values.visitDate) {
            //FR ST2-1 Bug in Writer.js with a null pointer in L.92, explicitly set time
            toVisit.set('visitDate', values.visitDate.getTime());
            toVisit.fields.getByKey('visitDate').setPersist(true);
         } else {
            //disable persistance when no date is set
            toVisit.fields.getByKey('visitDate').setPersist(false);
         }

         appHelper.debugObject(toVisit.getData(true));
         if(toVisit.getImage()) {
            appHelper.debugObject(toVisit.getImage().getData());
         }         

         appHelper.toggleMask('save', view);

         toVisit.save({

            success: function(record, operation) {               
               appHelper.toggleMask(false, view);
               cleanup();
               //refresh to visits
               me.loadVisits();
               if(appHelper.isFunction(callback)) {
                  callback(true, record);
               }
            },
            failure: function(record, operation) {
               appHelper.toggleMask(false, view);
               if(appHelper.isFunction(callback)) {
                  callback(false);
               }
               me.getApplication().handleServerError({
                  'error': operation.error,
                  'forceLogout': {403: true}
               });
            },
            scope: this
         });
      }

      function backBtTap() {         
         // if((!toVisit.get('id') && toVisit.getData(true).image) || (toVisit.get('id') && toVisit.get('imageTransient'))) {
         if(toVisit.get('imageTransient')) {
            //we cant directly call toVisit.getImage() since it tries to load it server side
            //resulting in a this model doesn't have a proxy specified error!
            //a photo was already taken, but toVisit has not been saved
            //don't handle errors. Doesn't matter for user if the server side gets cleaned up.
            me.deleteImage(toVisit.getImage().get('blobKey'));
         }

         //restore old image data
         if(existingToVisit && existingToVisit.getImageBackup()) {
            existingToVisit.setImage(Ext.create('EatSense.model.Image', {
               id: existingToVisit.getImageBackup().id,
               url: existingToVisit.getImageBackup().url,
               blobKey: existingToVisit.getImageBackup().blobKey
            })); 
            existingToVisit.setImageBackup(null);
         }

         cleanup();

         if(appHelper.isFunction(callback)) {
                  callback(false, existingToVisit);
         }
      }

      function scanBtTap() {
         appHelper.scanBarcode(doLoadBusiness);         
      }

      function doLoadBusiness(barcode) {
         if(barcode) {
            appHelper.toggleMask('loadingMsg', view);
            me.loadBusiness(barcode, scanCallback);   
         }
      }

      function scanCallback(success, record) {
         var formattedAddress;

         appHelper.toggleMask(false, view);

         if(success) {
            business = record;
            //scanned cloobster location, prefill fields
            toVisit = Ext.create('EatSense.model.Visit');
            toVisit.set('locationName', business.name);
            if(business.images && business.images.logo) {
               toVisit.set('imageUrl', business.images.logo);
            }
            toVisit.set('locationId', business.id);

            formattedAddress = appHelper.formatBusinessAddress(business);

            toVisit.set('locationCity', formattedAddress);
            toVisit.set('geoLat', business.geoLat);
            toVisit.set('geoLong', business.geoLong);

            setFormFields(toVisit);            
         } else {
            Ext.Msg.alert('', i10n.translate('checkInErrorBarcode'));
         }         
      }

      //set fields based on given tovisit
      function setFormFields(record) {
         //cloobster location, disable name field
         if(record.get('locationId')) {
            locationNameField.setHidden(true);
            locationNameField.setDisabled(true);
            locationNameLabel.setHidden(false);
            locationNameLabel.setHtml(toVisit.get('locationName'));            
         
         } 
         
         locationNameField.setValue(toVisit.get('locationName'));
         commentField.setValue(record.get('comment'));
         datePickerField.setValue(record.get('visitDate'));

         if(record.getImage() && record.getImage().get('url')) {
            imageLabel.setHidden(false);
            imageLabel.setStyle(
               Ext.Object.merge({}, me.getToVisitImageStyle(), {'background-image': 'url('+record.getImage().get('url')+')' })
            );

            deletePictureBt.setDisabled(false);
            deletePictureBt.setHidden(false);   
         }

          if(record.get('geoLat') && record.get('geoLong')) {
            noMapHintLabel.hide();
            if(gmap) {
               gmap.show();
            }
            setupMap({ coords : {
               latitude : record.get('geoLat'),
               longitude : record.get('geoLong')
            }});
         } else {
            geoPos = null; 
            //don't show map when
            if(gmap) {
               gmap.hide();
            }
            noMapHintLabel.show();
         }  
      }

      function setupMap(position) {
         //delay for quicker reactions on phone
         Ext.create('Ext.util.DelayedTask', function () {

            if(!gmap) {
               gmap = Ext.create('Ext.Map', {
                     mapOptions: {
                        draggable: false,
                        disableDefaultUI: true
                     },
                     height: '200px',
                     margin: '12 15 5 15'
                  }
               );
               view.add(gmap);

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
                        
            if(!position) {
               appHelper.toggleMask('loadingMsg', gmap);
                Ext.create('Ext.util.DelayedTask', function () {
                    me.getCurrentPosition(function(success, position) {
                      appHelper.toggleMask(false, gmap);
                      if(success) {
                         processPosition(true, position);
                         geocodePositon(position);
                         noMapHintLabel.hide();
                      } else {
                         noMapHintLabel.show();
                         gmap.hide();
                      }                  
                   });             
                }, this).delay(200);
               
            } else {
               Ext.create('Ext.util.DelayedTask', function () {
                  processPosition(true, position);
               }, this).delay(400); 
            }
            
         }, this).delay(200); 
      }

      function processPosition(success, position) {         
         if(success) {
            geoPos = position;
            var myLatlng = new google.maps.LatLng(geoPos.coords.latitude, geoPos.coords.longitude);

            gmap.getMap().setZoom(16);
            gmap.getMap().setCenter(myLatlng);            

            var marker = new google.maps.Marker({
               map: gmap.getMap(),
               position: myLatlng
            });   
         } else {
            //error, position may contain error information
            gmap.setHidden(true);
            geoPos = null;
            Ext.Msg.alert('', i10n.translate('error.gps.position'));
         }
      }

      function geocodePositon(position) {
         var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                _typeArr,
                fAddr,
                city,
                geocoder;

            geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'location': myLatlng}, function(results, status) {              
            if (status == google.maps.GeocoderStatus.OK) {
               fAddr = results[0].formatted_address;
               if(fAddr.lastIndexOf(',') > 0) {
                  fAddr = fAddr.substring(0, fAddr.lastIndexOf(','));   
               }
               
               toVisit.set('locationCity', fAddr);  
               //code to only grab city
               // Ext.Array.each(results, function(result) {
               //    if(!Ext.isArray(result.types)) {
               //       _typeArr = [result.types];
               //    } else {
               //       _typeArr = result.types;
               //    }

               //    Ext.Array.each(_typeArr, function(type) {
               //       if(type == 'locality') {
               //          city = result.address_components[0].long_name;
               //          console.log('History.showToVisitNewView: geocodePositon found city ' + city);
               //          toVisit.set('locationCity', city);                        
               //       }
               //    });
               // });
            } else {
               console.log('History.showToVisitNewView: geocodePositon Geocode was not successful for the following reason ' + status);
            }
           });
      }

      function clearDateBtTap() {
         datePickerField.setValue('');
      }

      function cameraBtTap() {
         appHelper.takePicture(function(success, imageUri) {
            if(success && imageUri) {
               //if only success user canceled taking a phot
               submitPicture(imageUri);
            } else if(!success) {
               Ext.Msg.alert('', i10n.translate('error.takepicture'));
            }
         });
      }

      function submitPicture(imageUri) {
         var image;

         // console.log('History.showToVisitNewView: submitPicture uri ' + imageUri);
         
         //no mask toggle since label doesn't support masking

         //1. mask screen
         //2. check for old ones and delete them
         //3. upload picture
         //4. show picture
         //5. delete local file
         
         appHelper.toggleMask('general.processing', form);

         // if((!toVisit.get('id') && toVisit.getData(true).image) || (toVisit.get('id') && toVisit.get('imageTransient'))) {
         if(toVisit.get('imageTransient')) {
            //we cant directly call toVisit.getImage() since it tries to load it server side
            //resulting in a this model doesn't have a proxy specified error!
            // console.log('History.showToVisitNewView: submitPicture delete old picture case 1');
            //a photo was already taken, but toVisit has not been saved, we have to directly delete it
            //if toVisit already exists, serverside will take care of deleting the image
            me.deleteImage(toVisit.getImage().get('blobKey'), function(success) {
               if(success) {
                  doSubmitPicture();
               } else {
                  appHelper.toggleMask(false, form);   
               }
            });
         } else {
            doSubmitPicture();
         }

         function doSubmitPicture() {
            appHelper.uploadImage(imageUri, 'tovisit', function(success, imageObj) {
               appHelper.toggleMask(false, form);

               if(success) {
                  imageLabel.setHidden(false);
                  imageLabel.setStyle(
                     Ext.Object.merge({}, me.getToVisitImageStyle(), {'background-image': 'url('+imageObj[0].url+')' })
                  );
                  
                  image = Ext.create('EatSense.model.Image', {
                     id: 'toVisitImage',
                     url: imageObj[0].url,
                     blobKey: imageObj[0].blobKey
                  });

                  toVisit.setImage(image);
                  toVisit.set('imageTransient', true);

                  if(deletePictureBt) {
                     deletePictureBt.setDisabled(false);   
                     deletePictureBt.setHidden(false);   
                  } else {
                     console.error('History.showToVisitNewView: submitPicture deletePictureBt not found');
                  }
                  
               }  else {
                  console.error('History.showToVisitNewView: submitPicture failed');
               }

               //delete local picture
               appHelper.deleteFile(imageUri, function(success) {
                  if(!success) {
                     Ext.Msg.alert('', i10n.translate('error.localfile.delete.failed'));
                  }
               });
            });
         }

      }

      function deletePictureBtTap(button) {               
         if(toVisit.get('imageTransient')) {            
            // console.log('History.showToVisitNewView: deletePictureBtTap delete non persistent toVisit image');
            button.setDisabled(true);
            button.setHidden(true);   
            imageLabel.setHidden(true);  
            //delete by blobkey since picture is not attached to a toVisit
            me.deleteImage(toVisit.getImage().get('blobKey'), function(success) {
               if(!success) {
                  button.setDisabled(false);
                  button.setHidden(false);   
                  imageLabel.setHidden(false);                  
               } else {
                  // toVisit.getImage().erase();
                  toVisit.setImage(Ext.create('EatSense.model.Image'));          
                  // delete toVisit.getData().image;
                  imageLabel.setStyle({});
                  toVisit.set('imageTransient', false);
               }
            });
         } else {
            // console.log('History.showToVisitNewView: deletePictureBtTap delete image');
            //only delete image on toVisit, will be deleted server side when sending an empty image object
            button.setDisabled(true);
            button.setHidden(true);   
            imageLabel.setHidden(true);
            toVisit.setImage(Ext.create('EatSense.model.Image'));
            imageLabel.setStyle({}); 
            toVisit.set('imageTransient', false);
         }
      }

      function doFireSkipKeyBoardEvent(skip) {
         //Bugfix for #589, only needed for Android
         Ext.Viewport.fireEvent('skiphidekeyboardevent', skip);
      }

      function cleanup() {
         backBt.un({
            tap: backBtTap,
            scope: this
         });  

         createBt.un({
            tap: saveOrUpdateToVisit,
            scope: this
         });

         scanBt.un({
            tap: scanBtTap,
            scope: this
         });  

         deletePictureBt.un({
            tap: deletePictureBtTap,
            scope: this
         });

         if(Ext.os.is.Android) {
            doFireSkipKeyBoardEvent(false);
         }

         
         Ext.Viewport.fireEvent('removebackhandler', cleanup);

         //remove and destroy view
         Ext.Viewport.remove(view, true);
      }

   },
   /**
   * Load visits for logged in user.
   */
   loadVisits: function(account) {
      var me = this,
          visitStore = Ext.StoreManager.lookup('visitStore'),
          list = this.getToVisitList();

      //TODO error handling
      if(visitStore) {
         visitStore.loadPage(1, {
            callback: function(records, operation, success) {
               if(!operation.error) {
                  if(list) {
                     list.refresh();
                  }
               } else {
                  me.getApplication().handleServerError({
                     'error': operation.error,
                     //accessToken invalid
                     'userLogout': {403: true}
                  });
               }
            }
         }); 
      }

   },
   /**
   * Removes all visits.
   *
   */
   clearVisits: function() {
      var visitStore = Ext.StoreManager.lookup('visitStore'),
          list = this.getToVisitList();

      if(visitStore) {
         visitStore.removeAll();
         list.refresh();
      }
   },

   /**
   * Get current coords. Async function.
   * @see http://docs.phonegap.com/en/2.7.0/cordova_geolocation_geolocation.md.html#Geolocation
   * @param {Function} callback
   *  Called with true and position on success, false and error otherwise.
   */
   getCurrentPosition: function(callback) {
      if(!appHelper.isFunction(callback)) {
         console.error('History.getCurrentPosition: no callback provided');
         return;
      }

      // onSuccess Callback
      //   This method accepts a `Position` object, which contains
      //   the current GPS coordinates
      //
      function onSuccess(position) {
         callback(true, position);
      }

      // onError Callback receives a PositionError object
      function onError(error) {     
         callback(false, error);
      }

      if(navigator && navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(onSuccess, onError,
            {maximumAge: Infinity, timeout: 20000, enableHighAccuracy:true});   
      } else {
         callback(false);
         console.error('History.getCurrentPosition: no navigator.geolocation exists');
      }      
   },
   /**
   * Load a business based on given barcode.
   * @param {String} barcode
   *  Spot barcode to load business for.
   * @param {Function} callback
   *  Callback to execute. Gets passed success and business if found.
   */
   loadBusiness: function(barcode, callback) {
      var me = this,
          business,
          toVisit;

      if(barcode) {
         //load business
         Ext.Ajax.request({
           url: appConfig.serviceUrl + '/c/businesses/',
           method: 'GET',
           params: {
             'spotCode' : barcode
           },
           success: function(response) {
            //array
            business = Ext.JSON.decode(response.responseText);
            //if 0 no business found if more then one there is an backend error
            if(business.length == 1) { 
               callback(true, business[0]);  
            } else {
               callback(false);
            }
           },
           failure: function(response) {
            callback(false);
             me.getApplication().handleServerError({
               'error': response
             });
           },
           scope: me
         });
      }
   },

   showToVisitDetail: function(dataview, record) {
      var me = this,
          cloobsterArea = this.getCloobsterArea(),
          detailView,
          backBt,
          editBt,
          deleteBt,
          checkInBt,
          content,
          imageLabel,
          visitStore = Ext.StoreManager.lookup('visitStore'),
          gmap,
          gmapMarker;

      if(!cloobsterArea) {
         console.error('History.showToVisitDetail: cloobsterArea does not exist');
         return;
      }

      //20130523 add the view dynamically and destroy it afterwards instead of placing it in the card container.
      //New approach to keep the DOM smaller.
      detailView = Ext.create('EatSense.view.VisitDetail');

      cloobsterArea.add(detailView);
      cloobsterArea.switchTo(detailView);

      backBt = detailView.down('backbutton');
      editBt = detailView.down('button[action=edit]');
      deleteBt = detailView.down('button[action=delete]');
      checkInBt = detailView.down('button[action=checkin]');
      content = detailView.down('#content');
      // gmap = detailView.down('map'); 
      imageLabel = detailView.down('#image');

      // if(record.get('locationId')) {
         //this is cloobster location, show checkIn Button
         // checkInBt.setHidden(false);
      // }

      //wire up events
      backBt.on({
         tap: cleanup,
         scope: this
      });

      checkInBt.on({
         tap: doCheckIn,
         scope: this
      });

      deleteBt.on({
         tap: doDelete,
         scope: this
      });

      editBt.on({
         tap: doEdit,
         scope: this
      });

      cloobsterArea.on({
         hide: cleanup,
         scope: this
      });

      renderContent();
      setupMap();

      function renderContent() {

         //display content
         content.getTpl().overwrite(content.element, record.getData());

         if(record.getImage() && record.getImage().get('url')) {
            if(!imageLabel) {
               console.error('History.showToVisitDetail: renderContent imageLabel does not exist');
            }
            imageLabel.setHidden(false);            
            imageLabel.setStyle(
               Ext.Object.merge({}, me.getToVisitImageStyle(), {'background-image': 'url('+record.getImage().get('url')+')' })
            );
         } else {
            imageLabel.setHidden(true);
            imageLabel.setStyle({});
         }    
      }

      function setupMap() {
         //delay for quicker reactions on phone

         if(!record.get('geoLat') && !record.get('geoLong')) {
            console.log('History.showToVisitDetail: setupMap cancel no coords');
            return;
         }

         Ext.create('Ext.util.DelayedTask', function () {

            gmap = Ext.create('Ext.Map', {
             mapOptions: {
                  draggable: false,
                  disableDefaultUI: true
               },
               height: '200px',
               margin: '0 15 5 15'
            });

            detailView.add(gmap);

            gmap.on({
            'painted': function(panel) {
                Ext.create('Ext.util.DelayedTask', function () {
                      appHelper.redirectUrls(panel);              
                  }, this).delay(2000);
              },
              single: true,
              scope: this
            });

            //Delay to prevent setting of wrong center
            Ext.create('Ext.util.DelayedTask', function () {
               gmapMarker = appHelper.setMapMarker({
                  latitude : record.get('geoLat'),
                  longitude : record.get('geoLong')
               }, gmap);
            }, this).delay(300);

            
         }, this).delay(300); 
      }

      function doDelete() {
         Ext.Msg.show({
            message: i10n.translate('tovisit.delete'),
            buttons: [{
               text: i10n.translate('yes'),
               itemId: 'yes',
               ui: 'action'
            }, {
               text:  i10n.translate('no'),
               itemId: 'no',
               ui: 'action'
            }],
            scope: this,
            fn: function(btnId, value, opt) {
            if(btnId=='yes') {
                  this.deleteToVisit(record, function(success) {
                  if(success) {
                     visitStore.remove(record);
                  }
                  else {
                     Ext.Msg.alert('', i10n.translate('error.tovisit.delete'));
                  }
               });
                  //directly jump back and don't wait for callback
                  cleanup();                  
               }
            }
         });            
      }

      function doCheckIn() {
         var noLocationPanel;

         if(record.get('locationId')) {
            appHelper.toggleMask('loadingMsg' ,detailView);
             this.loadWelcomeSpotOfBusiness(record.get('locationId'), function(success, spot) {
               appHelper.toggleMask(false, detailView);
               if(success && spot) {
                  cleanup();
                  Ext.Viewport.fireEvent('checkinwithspot', spot);
               }
             });
         } else {
            noLocationPanel = Ext.create('EatSense.view.NoLocation');

            Ext.Viewport.add(noLocationPanel);
            noLocationPanel.show();
         }
      }

      function doEdit() {
         this.showToVisitNewView(
            {
               'existingToVisit': record,
               'callback' : function(saved, updatedRecord) {
                  //always refresh the view
                  if(updatedRecord) {
                     record = updatedRecord;
                     Ext.create('Ext.util.DelayedTask', function () {
                        renderContent();
                     }, this).delay(150);

                     gmapMarker = appHelper.setMapMarker({
                        latitude : record.get('geoLat'),
                        longitude : record.get('geoLong')
                     }, gmap, gmapMarker);
                  }
               }   
            });
      }

      function cleanup() {
         backBt.un({
            tap: cleanup,
            scope: this
         });

         checkInBt.un({
            tap: doCheckIn,
            scope: this
         });

         deleteBt.un({
            tap: doDelete,
            scope: this
         });

         cloobsterArea.un({
            hide: cleanup,
            scope: this
         });

         editBt.un({
            tap: doEdit,
            scope: this
         });

         cloobsterArea.switchTo(0);
         //remove and destroy view 
         cloobsterArea.remove(detailView, true);
         // detailView.destroy();
      }
   },

   /**
   * Deletes a to visit.
   * @param {EatSense.model.Visit} toVisit
   *  Visit to delete
   * @param {Function} callback
   *     Passed true or false, based on successful operation.
   */
   deleteToVisit: function(toVisit, callback) {
      var me = this;

      if(!toVisit) {
         console.error('History.deleteToVisit: no toVisit given');
         return;
      }

      //TODO Bug from sencha with nullpointer in writer class
      toVisit.set('visitDate', new Date());

      toVisit.erase({
        success: function() {
          callback(true);
        },
        failure: function(response, operation) {
          me.getApplication().handleServerError({
            'error': operation.error,
            'forceLogout': {403: true}
          });
          callback(false);
        }
      });
   },
   /**
   * @DEPRECATED gets handled server side
   * Delete Image of an existing toVisit.
   * @param {EatSense.model.ToVisit} toVisit
   * @param {Function} callback (optional)
   */
   deleteToVisitImage: function(toVisit, callback) {
      var me = this,
          hasCallback = appHelper.isFunction(callback);

      if(!toVisit) {
         console.error('History.deleteToVisitImage: no toVisit given');
         return;
      }

      Ext.Ajax.request({
         url: appConfig.serviceUrl + '/c/visits/' + toVisit.get('id') + '/image',
         method: 'DELETE',
         success: function(response, operation) {
            if(hasCallback) {
               callback(true);   
            }
         }, 
         failure: function(response, operation) {
            if(hasCallback) {
               callback(false);   
            }            
            me.getApplication().handleServerError({
               'error': response
            });
         },
         scope: this
      });
   },
   /**
   * Delete an image based on its blobKey.
   * @param {String} blobKey
   *  Identifier for image
   * @param {Function} callback (optional)
   *  true|false based on success
   */
   deleteImage: function(blobKey, callback) {
      var me = this;

      if(!blobKey) {
         console.error('History.deleteImage: no blobKey given');
         return;
      }      

      Ext.Ajax.request({
        url: appConfig.serviceUrl + '/uploads/images/' + blobKey,
        method: 'DELETE',
        success: function(response) {
         
         if(appHelper.isFunction(callback)) {
            callback(true);     
         }

        },
        failure: function(response) {
         
         if(appHelper.isFunction(callback)) {
            callback(false);
         }

          me.getApplication().handleServerError({
            'error': response,
            forceLogout: {403:true}
          });
        },
        scope: me
      });
   },
 /**
  * Load welcome spot of given business.
  * @param {String} businessId
  *   id of business
  * @param {Function} callback
  *   Passed true|false depending on success and spot.
  *
  */
  loadWelcomeSpotOfBusiness: function(businessId, callback) {
    var me = this,
        spot,
        spotModel;

      if(!businessId || businessId.length == 0) {
         console.error('History.deleteToVisit: no toVisit given');
        return;
      } 

      Ext.Ajax.request({
        url: appConfig.serviceUrl + '/spots/welcome/',
        method: 'GET',
        params: {
          'locationId' : businessId
        },
        success: function(response) {
         //array
         spot = Ext.JSON.decode(response.responseText);
         if(Ext.isArray(spot)) {
            spot = spot[0];
         }

         spotModel = Ext.create('EatSense.model.Spot', spot);

         callback(true, spotModel);  

        },
        failure: function(response) {
         callback(false);
          me.getApplication().handleServerError({
            'error': response
          });
        },
        scope: me
      });
  }

});
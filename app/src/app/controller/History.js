/**
* Controller handles ToVisit and old CheckIns.
* 
*/
Ext.define('EatSense.controller.History', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.History', 'EatSense.view.VisitNew', 'EatSense.view.VisitDetail'],
	config: {
		refs: {
			mainView : 'lounge',
         placesOverview: 'placesoverview',
         cloobsterArea: 'cloobsterarea',
			dashboard : 'lounge dashboard',
			historyView : 'lounge history',
			historyList : 'lounge history list',
			backDetailButton : 'historydetail button[action=back]',
			// showHistoryButton: 'dashboard button[action=history]',
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
			// showHistoryButton : {
			// 	tap: 'showHistoryButtonHandler'
			// },
         toVisitButton: {
            tap: 'checkForToVisitAction'
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
		}
	},	
   launch: function() {

      Ext.Viewport.on('userlogin', function(account) {
         Ext.create('Ext.util.DelayedTask', function () {
               this.loadVisits();
         }, this).delay(300);             
      }, this);

      //ToDo clear list on logout
   },
   /**
   * Tap eventhandler for show places button.
   * @param {Ext.Button} button
   *  Button from tap event
   */
   // showHistoryButtonHandler: function(button) {
   //    var mainView = this.getMainView();

   //    mainView.selectByAction('show-places');
   // },   
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
	* Jump back to dashboard.
	*/
   // showDashboard: function(options) {
	  //  var mainView = this.getMainView(),
   //        historyList = this.getHistoryList();

   //       mainView.selectByAction('show-dashboard');

   //       historyList.deselectAll();
   // },
   /**
   * Loads the history for logged in user.
   * History will be stored in historyStore.
   */
   loadHistory: function() {
   		var me = this,
             historyStore = Ext.StoreManager.lookup('historyStore'),
   			 historyList = this.getHistoryList(),
             descPanel = this.getHistoryView().down('#historyListDescPanel');

         console.log('History.loadHistory');

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
            console.log('History.showHistoryDetail: historyDetailView not found');
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
   *
   */
   checkForToVisitAction: function() {
      var me = this;
      
      Ext.Viewport.fireEvent('accountrequired', loginCallback);

      function loginCallback(success) {

         if(success) {
            me.showToVisitNewView();
         }
      }    
   },

   /**
   * Shows a to view to create a new to visit
   * @param {EatSense.model.Visit} existingToVisit (optional)
   *  If given, updates an exisiting toVisit instead of creating a new one.
   * @param {Funcion} callback (optional)
   */
   showToVisitNewView: function(existingToVisit, callback) {
      var me = this,
          lounge =  this.getMainView(),
          view = this.getToVisitNewView(),
          form,
          backBt,
          createBt,
          business,
          datePickerField,
          scanBt,
          clearDateBt,
          cameraBt,
          imageLabel,
          gmap,
          values,
          toVisit = existingToVisit || Ext.create('EatSense.model.Visit'),
          locationNameField,
          locationNameLabel,
          geoPos;          

      Ext.Viewport.add(view);
      // lounge.getContainer().add(view);
      view.show();

      form = view.down('formpanel');
      backBt = view.down('backbutton');
      createBt = view.down('button[action=create]');
      scanBt = view.down('button[action=scan]');
      locationNameField = form.down('textfield[name=locationName]');
      locationNameLabel = form.down('#locationNameLabel');
      commentField = form.down('textfield[name=comment]');
      datePickerField = form.down('datepickerfield');
      clearDateBt = form.down('button[action=delete-visitdate]');
      cameraBt = form.down('button[action=capture-photo]');
      imageLabel = form.down('#image');      

      //delay for quicker reactions on phone
      Ext.create('Ext.util.DelayedTask', function () {

         gmap = Ext.create('Ext.Map', {
          mapOptions: {
                     draggable: false,
                     disableDefaultUI: true
                  },
                  height: '300px'
         });
         form.add(gmap);
         appHelper.toggleMask('loadingMsg', gmap);
         this.getCurrentPosition(processPosition);
      }, this).delay(300); 
      



      if(!toVisit.get('locationId')) {
         //if this is not a cloobster location
         scanBt.setHidden(false);
      }

      if(existingToVisit) {
         setFormFields(existingToVisit);
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

      clearDateBt.on({
         tap: clearDateBtTap,
         scope: this
      });

      cameraBt.on({
         tap: cameraBtTap,
         scope: this
      });

      Ext.Viewport.fireEvent('addbackhandler', cleanup);

      function saveOrUpdateToVisit() {
         values = form.getValues();

         //validate when manual creation and not updating existing checkin
         // if(!business && !existingToVisit) {

            

         //     toVisit = Ext.create('EatSense.model.Visit', values);

         // }

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
         } else {
            //disable persistance when no date is set
            toVisit.fields.getByKey('visitDate').setPersist(false);
         }

         appHelper.toggleMask('save', view);

         //TEST start
         // var img = Ext.create('EatSense.model.Image',{
         //    id: 'toVisitImage',
         //    blobKey: 'ASDSAGAHNA§FN$TANVAIBDSfsdfue4bf',
         //    url: 'http://robohash.org/Fred'
         // });
         // toVisit.setImage(img);
         //TEST end

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
               me.getApplication().handleServerError({
                  'error': operation.error,
                  'forceLogout': {403: true}
               });
            },
            scope: this
         });
      }

      function backBtTap() {
         cleanup();
         if(appHelper.isFunction(callback)) {
                  callback(false);
         }

         //TODO if picture was captured delete it
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

            setFormFields(toVisit);            
         } else {
            Ext.Msg.alert('', i10n.translate('checkInErrorBarcode'));
         }         
      }

      //set fields based on given record
      function setFormFields(record) {
         //cloobster location, disable name field
         if(record.get('locationId')) {
            locationNameField.setHidden(true);
            locationNameField.setDisabled(true);
            locationNameLabel.setHidden(false);
            locationNameLabel.setHtml(toVisit.get('locationName'));
            //TODO get coords from cloobster location
            gmap.setHidden(true);
            geoPos = null;
         } else {
            //TODO map does not exist in this moment, FIX
            processPosition(true, { coords : {
               latitude : record.get('geoLat'),
               longitude : record.get('geoLong')
            }});
         }
         
         locationNameField.setValue(toVisit.get('locationName'));
         commentField.setValue(record.get('comment'));
         datePickerField.setValue(record.get('visitDate'));
      }

      function processPosition(success, position) {
         appHelper.toggleMask(false, gmap);
         if(success) {
            geoPos = position;
            var myLatlng = new google.maps.LatLng(geoPos.coords.latitude, geoPos.coords.longitude),
                _typeArr,
                city;

            geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'location': myLatlng}, function(results, status) {              
            if (status == google.maps.GeocoderStatus.OK) {
               //TODO implement a more stable version by checking types field and null value checks
               Ext.Array.each(results, function(result) {
                  if(!Ext.isArray(result.types)) {
                     _typeArr = [result.types];
                  } else {
                     _typeArr = result.types;
                  }
                  Ext.Array.each(_typeArr, function(type) {
                     if(type == 'locality') {
                        city = result.address_components[0].long_name;
                        console.log('History: found city ' + city);
                        toVisit.set('locationCity', city);                        
                     }
                  });
               });
            } else {
               console.log('History: Geocode was not successful for the following reason ' + status);
            }
           });

            gmap.getMap().setZoom(14);
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

      function clearDateBtTap() {
         datePickerField.setValue('');
      }

      function cameraBtTap() {
         appHelper.takePicture(function(success, imageUri) {
            if(success) {
               submitPicture(imageUri);
            } else {
               Ext.Msg.alert('', i10n.translate('error.takepicture'));
            }
         });
      }

      function submitPicture(imageUri) {
         var image;

         console.log('History.showToVisitNewView: submitPicture uri ' + imageUri);
         imageLabel.setHidden(false);
         imageLabel.setStyle({
            'background-image': 'url('+imageUri+')',
            'background-size' : '100% auto',
            'background-position' : 'center',
            'background-repeat' : 'no-repeat',
            'width' : '100%',
            'height' : '300px'
         });

         // appHelper.toggleMask('uploading', imageLabel);

         //1. show picture
         //2. upload
         //3. save to album and let user delete manually later, saves some logic

         appHelper.uploadImage(imageUri, function(success, imageObj) {
            // appHelper.toggleMask(false, imageLabel);            
            
            if(success) {
               // toVisit.set('imageUrl', uri);   
               image = Ext.create('EatSense.model.Image', {
                  id: 'toVisitImage',
                  url: imageObj.imageUrl,
                  blobKey: imageObj.blobkey
               });

               toVisit.setImage(image);
            }            
         });

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

         clearDateBt.un({
            tap: clearDateBtTap,
            scope: this
         });

         Ext.Viewport.fireEvent('removebackhandler', cleanup);

         view.destroy();    
      }

   },
   /**
   * Load visits for logged in user.
   */
   loadVisits: function(account) {
      var visitStore = Ext.StoreManager.lookup('visitStore');

      //TODO error handling
      if(visitStore) {
         visitStore.load(); 
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
         navigator.geolocation.getCurrentPosition(onSuccess, onError);   
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
          visitStore = Ext.StoreManager.lookup('visitStore'),
          gmap;

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
      gmap = detailView.down('map'); 

      if(record.get('locationId')) {
         //this is cloobster location, show checkIn Button
         checkInBt.setHidden(false);
      }

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

      function renderContent() {
         //display content
         content.getTpl().overwrite(content.element, record.getData());
      }

      function doDelete() {
         Ext.Msg.show({
            message: i10n.translate('tovisit.prompt.delete'),
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
                     cleanup();
                     visitStore.remove(record);
                  } else {

                  }
               });
                  //directly jump back or wait for callback?
                  // cleanup();
                  // visitStore.remove(record);
               }
            }
         });            
      }

      function doCheckIn() {
         appHelper.toggleMask('loadingMsg' ,detailView);
          this.loadWelcomeSpotOfBusiness(record.get('locationId'), function(success, spot) {
            appHelper.toggleMask(false, detailView);
            if(success && spot) {
               cleanup();
               Ext.Viewport.fireEvent('checkinwithspot', spot);
            }
          });
      }

      function doEdit() {
         this.showToVisitNewView(record, function(saved, record) {
            if(saved) {
               renderContent();   
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
         cloobsterArea.remove(detailView);
         detailView.destroy();
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
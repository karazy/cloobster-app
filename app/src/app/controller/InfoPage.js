	/**
* Controller for infopages.
* Manages loading, showing and navigation for infopages.
*/
Ext.define('EatSense.controller.InfoPage', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.InfoPageDetail', 'EatSense.util.Helper'],
	config: {
		refs: {
			lounge: 'lounge',
			clubArea: 'clubarea',
			infoPageOverview: 'infopageoverview',
			infoPageCarousel: 'infopageoverview infopagecarousel',
			showInfoPageButton: 'clubarea clubdashboard button[action=show-infopage]',
			infoPageCarouselBackButton: 'infopageoverview infopagecarousel button[action=back]',
			infoPageList: 'infopageoverview list',
			infoPageSearchField: 'infopageoverview #searchPanel searchfield',
			infoPageTeaser: 'clubdashboard dashboardteaser'	
		},
		control: {
			showInfoPageButton: {
				tap: 'showInfoPageButtonHandler'
			},
			infoPageList: {
				select: 'showInfoPageDetail'
			},
			infoPageOverview: {
				show: 'infoPageOverviewShowHandler'
			},
			'dashboardteaser' : {
				'teasertapped.infopages' : 'teaserTapHandler'
			},
			'clubarea clubdashboard' : {
				'tilesrendered' : 'initInfoPageDashboardTiles'
			}
		},
		//true when all carousel panels have been created
		panelsCreated: false,
		currentFilterValue: null,
		//indicates when a user is typing in searchfield
		userTypes: false
	},

	launch: function() {		
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn'),
			lounge;

		console.log('Infopage.launch: setup');

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.setPanelsCreated(false);
				this.loadInfoPages();
				
				// on first show make sure to create info page panels
				me.getLounge().on({
					delegate: 'infopageoverview',
					show: infoPageOverviewShown,
					single: true,
					scope: me
				});

				function infoPageOverviewShown() {

					me.getInfoPageSearchField().on({
						keyup: this.infoPageSearchFieldHandler,
						clearicontap: this.clearInfoPageFilter,
						scope: this
					});

					me.getInfoPageList().on({
						'painted' : {
							single: true,
							fn: me.refreshInfoPageList,
							scope: me
						}
					});		

					// me.createCarouselPanels();
				}

				// me.getInfoPageOverview().on({
				// 	show: me.createCarouselPanels,
				// 	single: true,
				// 	scope: me
				// });
				//25.03.2013 wiring events in control not working
				// me.getLounge().on({
				// 	delegate: 'infopageoverview #searchPanel searchfield',
				// 	keyup: this.infoPageSearchFieldHandler,
				// 	clearicontap: this.clearInfoPageFilter,
				// 	scope: this
				// });
				

				// me.getInfoPageSearchField().on({
				// 	keyup: this.infoPageSearchFieldHandler,
				// 	clearicontap: this.clearInfoPageFilter,
				// 	scope: this
				// });
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();				
			}
		}, this);

		checkInCtr.on('businessloaded', this.showHotelInfoHeader, this);		    	
	},
	/**
	* @private
	* Show event handler for infopage overview card container.
	*/
	infoPageOverviewShowHandler: function(panel) {
		this.resetInfoPageOverview();
	},

	/**
	* @private
	* Calls refresh on infopage list and masks infopageoverview.
	*/
	refreshInfoPageList: function() {
		var me = this,
			list = this.getInfoPageList();

		console.log('InfoPage.refreshInfoPageList');

		if(list) {
			list.on({
				'refresh' : function() {
					//delay creation for better perceived performance
					//and to provide enough time for createCarouselPanels to complete
					Ext.create('Ext.util.DelayedTask', function () {
						EatSense.util.Helper.toggleMask(false, list);
	        		}).delay(300);
				},
				single: true,
				scope: this
			});

			//mask carousels during creation
			EatSense.util.Helper.toggleMask('loadingMsg', list);			
			Ext.create('Ext.util.DelayedTask', function () {				
				list.refresh();
    		}).delay(200);
		}
	},

	/**
	* Init the infopage dashboard tile, after tiles have been rendered.
	*/
	initInfoPageDashboardTiles: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		this.setImageForInfoButtons(checkInCtr.getActiveSpot());
	},

	/**
	* @private
	* Typ eventhandler for dashboard teasers displaying info pages.
	*/
	teaserTapHandler: function(page) {
		var me = this;
			// clubArea = this.getClubArea(),
			// teaser = clubArea.down('dashboardteaser[type=info]');

		me.showInfoPageDetail(null, page, true);

		// if(!me.getPanelsCreated()) {
		// 	// me.on({
		// 	// 	'carouselpanelscreated': doShowInfoPage,
		// 	// 	single: true,
		// 	// 	scope: this
		// 	// });

		// 	me.getLounge().selectByAction('show-infopage');
		// 	me.getInfoPageOverview().setActiveItem(me.getInfoPageCarousel());
		// } else {
		// 	// doShowInfoPage();
		// }

		// doShowInfoPage();

		// function doShowInfoPage() {
		// 	//null is the dataview, it gets not used inside method!
		// 	me.showInfoPageDetail(null, page, true);
		// }
	},
	/**
	* Load infopages into infopageStore.
	*/
	loadInfoPages: function() {
		var me = this,
			store = Ext.StoreManager.lookup('infopageStore'),
			infoPageList = this.getInfoPageList();

		console.log('InfoPage.loadInfoPages');
		this.setCurrentFilterValue(null);
		store.clearFilter();

		//make sure that store is empty!
		store.removeAll();
		store.load({
				callback: function(records, operation, success) {
			    	if(operation.error) {
		    			me.getApplication().handleServerError({
                    		'error': operation.error, 
                    		'forceLogout': {403:true}
                    	});
	                }
			    }
		});		
	},
	/**
	* Show hotel profile pictures above info page items in overview.
	* @param {EatSense.model.Business} business
	*	Contains the profile information.
	*/
	showHotelInfoHeader: function(business) {
		var lounge = this.getLounge(),
			infopageoverview = this.getInfoPageOverview(),
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

			if(!infopageoverview) {
				console.log('InfoPage.showHotelInfoHeader: infopageoverview not yet created');
				lounge.on({
					delegate: 'infopageoverview',
					show: renderHeader,
					single: true,
					scope: this
				});
			} else {
				renderHeader(infopageoverview);
			}			

			function renderHeader(panel) {

			profilePictures = panel.down('#profilePictures');

			//show profile pictures in infopageoverview
			if(business && business.raw && business.raw.images) {
				//check for pictures
				profilePicturesExist = business.raw.images.picture1 || business.raw.images.picture2 || business.raw.images.picture3;
			}

			if(profilePicturesExist) {
				profilePictures.removeAll();
				profilePictures.setHidden(false);									

				if(business.raw.images.picture1) {
					
					imagePanel = Ext.create('Ext.Panel', {
						style: {
							'background-image': 'url(' + business.raw.images.picture1.url + scaleFactor + ')',
							'background-size' : 'cover',
							'background-position' : 'center'
						}
					});

					panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture1.url + scaleFactor);

					profilePictures.add(imagePanel);
				}

				if(business.raw.images.picture2) {
					
					imagePanel = Ext.create('Ext.Panel', {
						style: {
							'background-image': 'url(' + business.raw.images.picture2.url + scaleFactor + ')',
							'background-size' : 'cover',
							'background-position' : 'center'					
						}
					});

					panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture2.url + scaleFactor);

					profilePictures.add(imagePanel);
				}

				if(business.raw.images.picture3) {				
					imagePanel = Ext.create('Ext.Panel', {
						style: {
							'background-image': 'url(' + business.raw.images.picture3.url + scaleFactor + ')',
							'background-size' : 'cover',
							'background-position' : 'center'
						}
					});

					panel.registerImageZoomTap(imagePanel.element, business.raw.images.picture3.url + scaleFactor);

					profilePictures.add(imagePanel);
				}
				profilePictures.setActiveItem(0);
			} else {
				profilePictures.removeAll();
				profilePictures.setHidden(true);
			}
			}
	},
	/**
	* Create a panel for each entry in infoPageStore.
	*/
	createCarouselPanels: function() {
		var me = this,
			store = Ext.StoreManager.lookup('infopageStore'),
			filters,
			infoPageOverview = this.getInfoPageOverview(),
			infoPageCarousel = this.getInfoPageCarousel(),
			carousel = infoPageCarousel.down('carousel'),
			html;

			// console.log('Infopage.createCarouselPanels: before check');
			//skip if panels already exist
			if(this.getPanelsCreated()) {
				return;
			}

			// console.log('Infopage.createCarouselPanels: after check');

			this.setPanelsCreated(true);

			me.on({
				'infopagedelayedshow' : createPanels,
				single: true,
				scope: this
			});

			//mask carousels during creation
			EatSense.util.Helper.toggleMask('loadingMsg', carousel);

			//do cleanup. Just for safety! Normally a cleanup is performed upon status change.
			//clear carousel
			carousel.removeAll();

			//delay creation for better perceived performance
			Ext.create('Ext.util.DelayedTask', function () {
	            me.fireEvent('infopagedelayedshow');
	        }).delay(500);

	        function createPanels() {
	        	var storeCount;

				console.log('InfoPage.createCarouselPanels: initial creation of info detail panels');
				try {
					//clear filters to always generate all pages!!!
					filters = store.getFilters();
					store.clearFilter(true);

					storeCount = store.getCount();
					
					store.each(function(record, index) {
						carousel.add(me.createInfoPageDetail(record, index, storeCount));		
					});

					store.setFilters(filters);	

					//private method of carousel
					//TODO test use of refreshCarouselItems()
					carousel.refreshCarouselItems();

					//unmask carousel
					EatSense.util.Helper.toggleMask(false, carousel);

					//notify observers that panel creation finished
					me.fireEvent('carouselpanelscreated');
										
				} catch(e) {
					this.setPanelsCreated(false);
					console.error('InfoPage.createCarouselPanels: failed to create panels ' + e);
				}				
	        }
	},
	/**
	* @private
	* Creates an InfoPageDetail panel based on the given record.
	* @param page
	*	InfoPage record
	* @return
	*	created panel
	*/
	createInfoPageDetail: function(page, index, pageCount) {
		var panel = Ext.create('EatSense.view.InfoPageDetail'),
			html;

			if(!page) {
				console.error('InfoPage.createInfoPageDetail: no page given');
				return;
			}

			panel = Ext.create('EatSense.view.InfoPageDetail');

			//hide arrows on first and last page
			if(index === 0) {
				panel.down('#help_arrow_left').setHidden(true);	
			} else if(index === (pageCount - 1)) {
				panel.down('#help_arrow_right').setHidden(true);
			}

			panel.setIpRecord(page);

			return panel;
	},
	/**
	* Removes all panels from info page carousel.
	*/
	removeInfoPageDetailPanels: function() {
		var infoPageCarousel = this.getInfoPageCarousel()

		if(infoPageCarousel) {
			 infoPageCarousel.down('carousel').removeAll();		
		}
	},
	/**
 	* Select event handler of infoPageList.
	* Shows details for selected InfoPage element.
	* @param {Ext.dataview.List} list
	* @param {EatSense.model.InfoPage} infopage
	*	InfoPage to show detail for.
	* @param {Boolean} direct (optional)
	*	true if this is direct call and not from list itself
  	*/
	showInfoPageDetail: function(dataview, record, direct) {
		var me = this,
			infoPageOverview,
			ipcarousel,
			lounge = this.getLounge(),
			carousel,
			infoPageList = this.getInfoPageList(),
			infoPage,
			store = Ext.StoreManager.lookup('infopageStore'),
			filters = store.getFilters(),
			index,
			windowRef,
			recordUrl,
			backButton;

		//TODO maybe use itemtap (me, index, target, record, e)?

		//must be called before setActiveItem, because a reset is triggered
		//that sets activeItem to 0! currently reset is only triggered if item is not already selected.
		//this may change in future implementation and should be reviewed later
		lounge.selectByAction('show-infopage');
		//setup up variables after selectByAction, because on first start view is not yet created

		infoPageOverview = this.getInfoPageOverview();

		infoPageOverview.setActiveItem(1);

		ipcarousel = this.getInfoPageCarousel();
		carousel = ipcarousel.down('carousel');
		
		
		if(!me.getPanelsCreated()) {
			me.on({
				'carouselpanelscreated': doShowInfoPage,
				single: true,
				scope: this
			});

			me.createCarouselPanels();
		} else {
			doShowInfoPage();
		}


		function doShowInfoPage() {

			//clear filters to get the real index
			store.clearFilter(true);
			index = store.indexOf(record);
			store.setFilters(filters);

			infoPage = carousel.getAt(index);

			if(index < 0) {
				console.error('InfoPage.showInfoPageDetail: no infoPage exists at ' + index);
				return;
			}

			//2013.03.20 BUG? when using infopage index 0 it is the load mask
			carousel.setActiveItem(index);

			backButton = ipcarousel.down('backbutton');		

			//wire up listeners


			infoPageOverview.on({
				hide: cleanup,
				scope: this
			});

			carousel.on({
				delegate: 'infopagedetail fixedbutton[action=open-link]',
				tap: openUrl,
				scope: this
			});

			backButton.on({
				tap: cleanup,
				scope: this
			});



			function openUrl(button) {
				var record,
					recordUrl;

				if(!button) {
					return;
				}

				//get hold of infopagedetail containing the record
				record = button.getParent().getParent().getIpRecord();

				recordUrl = record.get('url');
				if(recordUrl && recordUrl.trim().length > 0) {
					//if url does not start with http or https add it
					if(recordUrl.indexOf('http://')  < 0 && recordUrl.indexOf('https://') < 0) {
						recordUrl = 'http://' + recordUrl;
					}

					windowRef = window.open(encodeURI(recordUrl), '_blank');
					windowRef.addEventListener('exit', inAppBrowserClose);
				}
			}

			function registerImageZoomBackButton(imagePanel) {
				this.getApplication().getController('Android').addBackFn(function() {
					imagePanel.hide();
				});
			}

			function unRegisterImageZoomBackButton(imagePanel) {
				this.getApplication().getController('Android').removeBackFn();
			}

			function inAppBrowserClose() {
				console.log('InfoPage.showInfoPageDetail: in app browser closed');
				windowRef.removeEventListener('exit', inAppBrowserClose);
			}
			
			function cleanup() {
				//remove listeners...
				// console.log('Infopage.showInfoPageDetail: cleanup');

				infoPageOverview.un({
					hide: cleanup,
					scope: this
				});

				carousel.un({
					delegate: 'infopagedetail fixedbutton[action=open-link]',
					tap: openUrl,
					scope: this
				});


				backButton.un({
					tap: cleanup,
					scope: this
				});

				me.backToOverview();

			}
		}
	},
	/**
	* @deprecated
	* @private
	* Event handler for activeitemchange of carousel. Sets the selected item in infoPageList
	* based on the current selected carousel item.
	*/
	setListIndex: function(container, newIndex, oldIndex) {
		var infoPageList = this.getInfoPageList(),
			store = Ext.StoreManager.lookup('infopageStore');

		if(newIndex != oldIndex) {
			infoPageList.select(store.getAt(container.getActiveIndex()), false, true);
		}	
	},

	/**
	* Tap event handler for showInfoPagesButton.
	*/
	showInfoPageButtonHandler: function(button) {
		var lounge = this.getLounge();

		//execute select on list and let it handle the rest
		lounge.selectByAction('show-infopage');	
	},
	/**
	* @private
	* Reset infopageoverview by clearing the searchfield and all filters.
	* Also set activeItem to 0;
	*/
	resetInfoPageOverview: function() {
		var me = this,
			infopageOverview = this.getInfoPageOverview(),
			lounge = this.getLounge(),
			store = Ext.StoreManager.lookup('infopageStore'),
			searchfield = this.getInfoPageSearchField(),
			list = this.getInfoPageList();		

		infopageOverview.setActiveItem(0);

		//reset search field
		searchfield.setValue("");
		store.clearFilter();
		
		list.deselectAll();
		list.refresh();
	},
	/**
	* Tap event handler for infoPageBackButton.
	*/
	infoPageBackButtonHandler: function(button) {
		this.backToDashboard();
	},
	/**
	* Tap event handler for infoPageCarouselBackButton.
	*/
	infoPageCarouselBackButtonHandler: function(button) {
		this.backToOverview();
	},

	/**
    * Return to dashboard view.
    */
    backToDashboard: function(button) {
    	var me = this,
			clubArea = this.getClubArea(),
			list = this.getInfoPageList();

		list.deselectAll();
		clubArea.setActiveItem(0);
		// clubArea.animateActiveItem(0, {type: 'slide', direction: 'right'});
    },

    /**
    * Return to infopage overview.
    */
    backToOverview: function(button) {
    	var me = this,
    		infopageOverview = this.getInfoPageOverview(),
    		carousel = this.getInfoPageCarousel().down('carousel'),
			list = this.getInfoPageList();
		

		// carousel.un('activeitemchange', this.setListIndex, this);
		infopageOverview.setActiveItem(0);	

		//TEST
		//scroll to selected element
		// var store = Ext.StoreManager.lookup('infopageStore'),
	    //      selected = list.getSelection()[0],
	    //      idx = store.indexOf(selected),
	    //      els = list.container.getViewItems(),
	    //      el = els[idx],
	    //      offset = Ext.get(el).dom.offsetTop;
	    //     list.getScrollable().getScroller().scrollTo(0, offset-25);	
    },

    /**
    * Keyup event handler for search field.
    */
    infoPageSearchFieldHandler: function(field) {
    	var timeout;

    	if(this.getUserTypes()) {
    		window.clearTimeout(this.getUserTypes());
    	}
    	

    	timeout = Ext.defer(function() {
    		this.setUserTypes(null);
    		this.filterInfoPages(field.getValue());	
    	}, 50, this);

    	this.setUserTypes(timeout);
    },

    /**
    * Filters the info pages based on the value of textfield.
    *
    */
    filterInfoPages: function(filterValue) {
    	var store = Ext.StoreManager.lookup('infopageStore'),    		
    		filterExists = (filterValue) ? true : false,
    		searchfield = this.getInfoPageSearchField(),
    		list = this.getInfoPageList();

    		console.log('InfoPage.filterInfoPages');

    		if(this.getCurrentFilterValue() == filterValue) {
    			//nothing changed
    			return;
    		}

    		this.setCurrentFilterValue(filterValue);

    		store.clearFilter(filterExists);
    		if(filterExists) {
    			list.getScrollable().getScroller().scrollToTop();
    			// store.filter(filter);	
    			store.filterBy(function(record) {
    				var title = record.get('title'),
    					shortText = record.get('shortText'),
    					//removed "^"+
    					regEx = new RegExp(filterValue, 'i');

    				if(title && title.match(regEx)) {
    					return true;
    				}

    				regEx = new RegExp(filterValue, 'i');

    				if(shortText && shortText.match(regEx)) {
    					return true;
    				}

    				return false;
    			});
    		}

    		list.refresh();    		
    },
    /**
    * Remove filters from infoPageStore.
    */
    clearInfoPageFilter: function() {
    	var store = Ext.StoreManager.lookup('infopageStore'),
    		list = this.getInfoPageList();

    	this.setCurrentFilterValue(null);
    	store.clearFilter();
    	list.refresh();
    },
    /**
    * @Deprecated
    * Show/hide InfoPageTeaser.
    */
    toggleInfoPageTeasers: function(hide) {
    	var me = this,
			clubArea = this.getClubArea(),
			teaser = clubArea.down('dashboardteaser[type=info]');

		console.log('InfoPage.toggleInfoPageTeasers: hide=' + hide);
		if(teaser) {
			teaser.setState({'basicMode' : hide});
		} else {
			console.log('InfoPage.toggleInfoPageTeasers:  no teaser found');
		}
    },
    /**
    * Set hotel logo on InfoPages button.
    * @param {EatSense.model.Spot} spot
    *	contains logo url
    */
    setImageForInfoButtons: function(spot) {
    	var clubArea = this.getClubArea(),
    		buttons;

    	var button = this.getShowInfoPageButton();

    	buttons = clubArea.query('clubdashboard button[action=show-infopage]');

    	if(!buttons) {
    		console.log('InfoPage.setImageForInfoButtons: no buttons found');
    		return;
    	}
    	//DEBUG
    	// if(spot) {
    	// 	spot.set('logoUrl', 'http://lh4.ggpht.com/8M0z_I9aSu7S3jNFjrVQ_HV9f1-qx09VzkkU8WNNFWoBL1F3D5vhKPn4gfKoe38AN4WdzUqcnnlqhX1C6ldDswfjUsexpI4W');	
    	// }

    	Ext.Array.each(buttons, function(button) {
    		//a custom logo exists
	    	if(spot && spot.get('logoUrl')) {
	    		// console.log('InfoPage.setImageForInfoButtons: found logo ' + spot.get('logoUrl'));
	    		//=s360 we load from google blob store and define a maximum logo size
	    		button.setIcon(spot.get('logoUrl')+'=s360');
	    		button.setExpandIcon(true);
	    	} else {
	    		console.log('InfoPage.setImageForInfoButtons: no logo in spot');
	    		//reset image
	    		button.setIcon('');
	    		button.setExpandIcon(false);
	    		//private button method
	    		button.showIconElement();
	    	}
    	});

    },
    /**
    * Cleanup on checkout.
    */
    cleanup: function() {
    	var store = Ext.StoreManager.lookup('infopageStore'),
			infoPageOverview = this.getInfoPageOverview(),
			profilePictures,
			infoPageList = this.getInfoPageList();		

		try {
			store.clearFilter();
			this.setPanelsCreated(false);
			this.removeInfoPageDetailPanels();
			store.removeAll();

			if(infoPageList) {
				infoPageList.refresh();	
			}			

			if(infoPageOverview) {
				infoPageOverview.un({
					show: this.createCarouselPanels,
					scope: this
				});	

				profilePictures = infoPageOverview.down('#profilePictures');				

			}

			if(profilePictures) {
				profilePictures.removeAll();
			}	

			if(this.getInfoPageSearchField()) {
				this.getInfoPageSearchField().un({
					keyup: this.infoPageSearchFieldHandler,
					clearicontap: this.clearInfoPageFilter,
					scope: this
				});	
			}
		} catch(e) {
			console.error('InfoPage.cleanup: failed ' + e);
		}
    }
});
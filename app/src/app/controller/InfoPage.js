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
			infoPageSearchField: 'infopageoverview searchfield'
		},
		control: {
			showInfoPageButton: {
				tap: 'showInfoPageButtonHandler'
			},
			infoPageList: {
				select: 'showInfoPageDetail'
			},
			infoPageSearchField: {
				keyup: 'infoPageSearchFieldHandler',
				clearicontap: 'clearInfoPageFilter'
			},
			infoPageCarouselBackButton: {
				tap: 'infoPageCarouselBackButtonHandler'
			},
			infoPageOverview: {
				show: 'infoPageOverviewShowHandler',
				// hide: 'infoPageOverviewHideHandler',
				'infopagedelayedshow': 'createCarouselPanels'
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

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.setPanelsCreated(false);
				this.loadInfoPages();
				this.setImageForInfoButton(checkInCtr.getActiveSpot());
				// lounge = this.getLounge();
				// if(lounge) {
				// 	lounge.getList().on({
				// 		select: me.loungeListSelect,
				// 		scope: me
				// 	});
				// }
				//on first show make sure to create info page panels
				me.getInfoPageOverview().on({
					show: me.createCarouselPanels,
					single: true,
					scope: me
				});
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();				
			}
		}, this);

		checkInCtr.on('businessloaded', this.showHotelInfoHeader, this);

		// always show teaser
		//this.getApplication().getController('CheckIn').on('basicmode', this.toggleInfoPageTeasers, this);		    
	},
	/**
	* @private
	* Show event handler for infopage overview card container.
	*/
	infoPageOverviewShowHandler: function(panel) {

		this.resetInfoPageOverview();
		// this.createCarouselPanels();

		// if(!this.getPanelsCreated()) {
		// 	list.on({
		// 		painted: function() {					
		// 			appHelper.toggleMask('infopage.loadingmsg', list);
		// 			// detail.setMasked({
		// 			// 		xtype: 'loadmask',
		// 			// 		message: i10n.translate('menu.product.detail.loading')
		// 			// 	});
		// 			Ext.create('Ext.util.DelayedTask', function () {
		// 	            panel.fireEvent('infopagedelayedshow');
		// 	        }).delay(2500);
		// 		},
		// 		single: true,
		// 		scope: this
		// 	});
		// }
	},

	/**
	* @private
	* Calls refresh on infopage list.
	*/
	refreshInfoPageList: function() {
		var list = this.getInfoPageList();
		console.log('InfoPage.refreshInfoPageList');
		if(list) {
			list.refresh();
		}
	},
	/**
	* Register tap on infopageteaser.
	*/
	registerInfoPageTeaser: function() {
		var me = this,
			clubArea = this.getClubArea(),
			teaser = clubArea.down('dashboardteaser[type=info]');
			// androidCtr = this.getApplication().getController('Android');

		if(teaser) {
			//unregister old listener
			teaser.un('teasertapped', tapFunction);
			teaser.on('teasertapped', tapFunction);
		}

		function tapFunction(page) {			

			if(!me.getPanelsCreated()) {
				me.on({
					'carouselpanelscreated': doShowInfoPage,
					single: true,
					scope: this
				});

				me.getLounge().selectByAction('show-infopage');
				me.getInfoPageOverview().setActiveItem(me.getInfoPageCarousel());
				// me.createCarouselPanels(doShowInfoPage);
			} else {
				doShowInfoPage();
			}

			function doShowInfoPage() {
				//null is the dataview, it gets not used inside method!
				me.showInfoPageDetail(null, page, true);
			}
		}
	},
	/**
	* @deprecated
	* @private
	* Listens for slide navigation list select event.
	* When item with action show-infopage is selected, 
	* check if pages have been created.
	*
	*/
	// loungeListSelect: function(list, record) {

	// 	if(record.get('action') == 'show-infopage') {
	// 		//creates carousels on first access
	// 		this.createCarouselPanels();				
	// 		this.resetInfoPageOverview();
	// 	}       
	// },
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
			    	if(!operation.error) {
			    		me.refreshInfoPageList();
			    		me.registerInfoPageTeaser();
			    		try {
							me.getInfoPageList().on({
								'painted' : {
									single: true,
									fn: me.refreshInfoPageList,
									scope: me
								}								
							});
						} catch(e) {
							console.log('InfoPage.loadInfoPages: failed to attach painted listener ' + e);
						}
			    	}
			    	else {
		    			me.getApplication().handleServerError({
                    		'error': operation.error, 
                    		'forceLogout': {403:true}
                    	});
	                }
			    }
		});		
	},
	/**
	* Show hotel information above info page items in overview.
	*/
	showHotelInfoHeader: function() {
		var infopageoverview = this.getInfoPageOverview(),
			business = this.getApplication().getController('CheckIn').getActiveBusiness(),
			infoHeader,
			tpl,
			html,
			imageUrl;

			//get the label
			infoHeader = infopageoverview.down('#hotelInfo');

			if(business && business.raw && business.raw.images && business.raw.images.fbwallpost) {
				imageUrl = business.raw.images.fbwallpost.url || '';
			}

			if(infoHeader && business) {
				tpl = infoHeader.getTpl();
				html = tpl.apply({
					'imageUrl' : imageUrl,
					'name' : business.get('name'),
					'slogan' : business.get('slogan'),
					'description' : business.get('description')
				});
				infoHeader.setHtml(html);
			}
	},
	/**
	* Create a panel for each entry in infoPageStore.
	* @param callback (optional)
	*	Called after all panels have been created
	*/
	createCarouselPanels: function(callback) {
		var me = this,
			store = Ext.StoreManager.lookup('infopageStore'),
			infoPageOverview = this.getInfoPageOverview(),
			infoPageCarousel = this.getInfoPageCarousel(),
			carousel = infoPageCarousel.down('carousel'),
			searchfield = this.getInfoPageSearchField(),
			html;

			//skip if panels already exist
			if(this.getPanelsCreated()) {
				return;
			}

			this.setPanelsCreated(true);

			me.on({
				'infopagedelayedshow' : createPanels,
				single: true,
				scope: this
			});

			//mask carousels during creation
			EatSense.util.Helper.toggleMask('infopage.loadingmsg', carousel);

			Ext.create('Ext.util.DelayedTask', function () {
	            me.fireEvent('infopagedelayedshow');
	        }).delay(500);

	        function createPanels() {	        	

				//do cleanup. Just for safety! Normally a cleanup is performed upon status change.
				//clear carousel
				this.removeInfoPageDetailPanels();

				console.log('InfoPage.createCarouselPanels: intial creation of info detail panels');
				try {
					//make sure to create panels before store gets filtered
					//alternative clear filter
							
					store.each(function(record) {
						carousel.add(me.createInfoPageDetail(record));
					});

					//private method of carousel
					//TODO try to use refreshCarouselItems()
					carousel.refresh();

					//unmask carousel
					EatSense.util.Helper.toggleMask(false, carousel);

					//notify observers that panel creation finished
					me.fireEvent('carouselpanelscreated');

					if(EatSense.util.Helper.isFunction(callback)) {
						callback();
					}
				} catch(e) {
					this.setPanelsCreated(false);
					console.log('InfoPage.createCarouselPanels: failed to create panels ' + e);
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
	createInfoPageDetail: function(page) {
		var panel = Ext.create('EatSense.view.InfoPageDetail'),
			html;

			if(page) {
				html = panel.getTpl().apply(page.getData());
				panel.setHtml(html);
			}
			return panel;
	},
	/**
	* Removes all panels from info page carousel.
	*/
	removeInfoPageDetailPanels: function() {
		var infoPageCarousel = this.getInfoPageCarousel(),
			carousel = infoPageCarousel.down('carousel');

		carousel.removeAll(true);
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
			infoPageOverview = this.getInfoPageOverview(),
			ipcarousel = this.getInfoPageCarousel(),
			lounge = this.getLounge(),
			carousel = ipcarousel.down('carousel'),
			// androidCtr = this.getApplication().getController('Android'),
			infoPageList = this.getInfoPageList(),
			store = Ext.StoreManager.lookup('infopageStore'),
			filters = store.getFilters(),
			index;

		//TODO maybe use itemtap (me, index, target, record, e)?
		//TODO check if panels are created?

		//clear filters to get the real index
		store.clearFilter(true);
		index = store.indexOf(record);
		store.setFilters(filters);

		if(index >= 0) {
			carousel.setActiveItem(index);
		}

		console.log('InfoPage.showInfoPageDetail: active carousel index=' +index);

		//must be called before setActiveItem, because a reset is triggered
		//that sets activeItem to 0! currently reset is only triggered if item is not already selected.
		//this may change in future implementation and should be reviewed later
		lounge.selectByAction('show-infopage');
		me.getInfoPageOverview().setActiveItem(ipcarousel);

		carousel.on('activeitemchange', this.setListIndex, this);
		//direct call e.g. from dashboard teaser type=info
		if(direct) {
			this.setListIndex(carousel, index, null);
		}

		// androidCtr.addBackHandler(function() {
  //           me.backToOverview();
  //       });

	},
	/**
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
			androidCtr = this.getApplication().getController('Android'),
			store = Ext.StoreManager.lookup('infopageStore'),
			searchfield = this.getInfoPageSearchField(),
			list = this.getInfoPageList();		

		//reset search field
		searchfield.setValue("");
		store.clearFilter();

		infopageOverview.setActiveItem(0);
		list.deselectAll();
	},
	/**
	* Tap event handler for infoPageBackButton.
	*/
	infoPageBackButtonHandler: function(button) {
		var androidCtr = this.getApplication().getController('Android');

		this.backToDashboard();
		androidCtr.removeLastBackHandler();
	},
	/**
	* Tap event handler for infoPageCarouselBackButton.
	*/
	infoPageCarouselBackButtonHandler: function(button) {
		var androidCtr = this.getApplication().getController('Android');

		this.backToOverview();
		androidCtr.removeLastBackHandler();
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
		

		carousel.un('activeitemchange', this.setListIndex, this);
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
    *
    */
    setImageForInfoButton: function(spot) {
    	var button = this.getShowInfoPageButton();

    	if(!button) {
    		return;
    	}
    	//DEBUG
    	// if(spot) {
    	// 	spot.set('logoUrl', 'http://lh4.ggpht.com/8M0z_I9aSu7S3jNFjrVQ_HV9f1-qx09VzkkU8WNNFWoBL1F3D5vhKPn4gfKoe38AN4WdzUqcnnlqhX1C6ldDswfjUsexpI4W');	
    	// }

    	//a custom logo exists
    	if(spot && spot.get('logoUrl')) {
    		console.log('InfoPage.setImageForInfoButton: found logo ' + spot.get('logoUrl'));
    		//=s360 we load from google blob store and define a maximum logo size
    		button.setIcon(spot.get('logoUrl')+'=s360');
    		button.setExpandIcon(true);
    	} else {
    		console.log('InfoPage.setImageForInfoButton: no logo in spot');
    		//reset image
    		button.setIcon('');
    		button.setExpandIcon(false);
    		//private button method
    		button.showIconElement();
    	}
    },
    /**
    * Cleanup on checkout.
    */
    cleanup: function() {
    	var store = Ext.StoreManager.lookup('infopageStore'),
    		clubArea = this.getClubArea(),
			teasers = clubArea.query('dashboardteaser[type="info"]'),
			lounge = this.getLounge();

			//clean up
			store.clearFilter();
			this.setPanelsCreated(false);
			this.removeInfoPageDetailPanels();
			store.removeAll();
			this.refreshInfoPageList();
			if(teasers){
				Ext.Array.each(teasers, function(teaser) {
					teaser.reset();	
				});
			}
			this.setImageForInfoButton(null);

			if(lounge) {
				//deregister listener for lounge list select
				lounge.getList().un({
					select: this.loungeListSelect,
					scope: this
				});
			}
    }
});
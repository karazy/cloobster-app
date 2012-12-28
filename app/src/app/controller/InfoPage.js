/**
* Controller for infopages.
* Manages loading, showing and navigation for infopages.
*/
Ext.define('EatSense.controller.InfoPage', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.InfoPageDetail'],
	config: {
		refs: {
			clubArea: 'clubarea',
			infoPageOverview: 'clubarea infopageoverview',
			infoPageCarousel: 'clubarea infopagecarousel',
			showInfoPageButton: 'clubarea clubdashboard button[action=show-infopage]',
			infoPageCarouselBackButton: 'clubarea infopagecarousel button[action=back]',
			infoPageBackButton: 'clubarea infopageoverview button[action=back]',
			infoPageList: 'clubarea infopageoverview list',
			infoPageSearchField: 'clubarea infopageoverview searchfield'
		},
		control: {
			showInfoPageButton: {
				tap: 'showInfoPageButtonHandler'
			},
			infoPageBackButton: {
				tap: 'infoPageBackButtonHandler'
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
			}
		},
		//true when all carousel panels have been created
		panelsCreated: false,
		currentFilterValue: null,
		userTypes: false
	},

	init: function() {
		var store = Ext.StoreManager.lookup('infopageStore');

		this.getApplication().getController('CheckIn').on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.setPanelsCreated(false);
				this.loadInfoPages();
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				//clean up
				store.clearFilter();
				this.setPanelsCreated(false);
				this.removeInfoPageDetailPanels();
				store.removeAll();
			}
		}, this);

		this.getApplication().getController('CheckIn').on('basicmode', this.toggleInfoPageTeasers, this);
	},
	registerInfoPageTeaser: function() {
		var me = this,
			clubArea = this.getClubArea(),
			teaser = clubArea.down('infopageteaser');

		if(teaser) {
			teaser.on('teasertapped', function(page) {
				if(!me.getPanelsCreated()) {
					me.createCarouselPanels();
				}
				me.showInfoPageDetail(null, page);
			});
		}

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
		//do cleanup. Just for safety! Normally a cleanup is performed upon status change.
		//clear carousel
		this.removeInfoPageDetailPanels();
		//make sure that store is empty!
		store.removeAll();
		store.load({
				callback: function(records, operation, success) {
			    	if(!operation.error) {
			    		infoPageList.refresh();
			    		me.registerInfoPageTeaser();
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
	*/
	createCarouselPanels: function() {
		var me = this,
			store = Ext.StoreManager.lookup('infopageStore'),
			infoPageCarousel = this.getInfoPageCarousel(),
			carousel = infoPageCarousel.down('carousel'),
			searchfield = this.getInfoPageSearchField(),		
			currentPanel = null,
			html;

			//skip if panels already exist
			if(this.getPanelsCreated()) {
				return;
			}

			this.showHotelInfoHeader();

			console.log('InfoPage.createCarouselPanels > intial creation of info detail panels');

			//make sure to create panels before store gets filtered
			//alternative clear filter
			store.each(function(record) {
				currentPanel = Ext.create('EatSense.view.InfoPageDetail');
				//get template and create html representation
				html = currentPanel.getTpl().apply(record.getData());
				currentPanel.setHtml(html);
				carousel.add(currentPanel);
			});
		

			this.setPanelsCreated(true);		

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
 	* Event handler for select of infoPageList.
	* Shows details for selected InfoPage element.
  	*/
	showInfoPageDetail: function(dataview, record) {
		var me = this,
			ipcarousel = this.getInfoPageCarousel(),
			carousel = ipcarousel.down('carousel'),
			clubArea = this.getClubArea(),
			androidCtr = this.getApplication().getController('Android'),
			infoPageList = this.getInfoPageList(),
			store = Ext.StoreManager.lookup('infopageStore'),
			filters = store.getFilters(),
			index;

		//clear filters to get the real index
		store.clearFilter(true);
		index = store.indexOf(record);
		store.setFilters(filters);

		if(index >= 0) {
			carousel.setActiveItem(index);
		}

		clubArea.setActiveItem(ipcarousel);

		carousel.on('activeitemchange', this.setListIndex, this);

		androidCtr.addBackHandler(function() {			
            me.backToOverview();
        });

	},
	/**
	* @private
	* Event handler for activeitemchange. Sets the selected item in infoPageList
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
		var me = this,
			infopageOverview = this.getInfoPageOverview(),
			clubArea = this.getClubArea(),
			androidCtr = this.getApplication().getController('Android'),
			store = Ext.StoreManager.lookup('infopageStore'),
			searchfield = this.getInfoPageSearchField();

		clubArea.setActiveItem(infopageOverview);

		//reset search field
		searchfield.setValue("");
		store.clearFilter();		
		
		androidCtr.addBackHandler(function() {
            me.backToDashboard();
        });

		Ext.defer(function() {
			this.createCarouselPanels();	
		}, 10, this);

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
		clubArea.animateActiveItem(0, {type: 'slide', direction: 'right'});
    },

    /**
    * Return to infopage overview.
    */
    backToOverview: function(button) {
    	var me = this,
    		infopageOverview = this.getInfoPageOverview(),
    		carousel = this.getInfoPageCarousel().down('carousel'),
			clubArea = this.getClubArea(),
			list = this.getInfoPageList();

		

		carousel.un('activeitemchange', this.setListIndex, this);

		clubArea.animateActiveItem(infopageOverview, {type: 'slide', direction: 'right'});

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
    					regEx = new RegExp("^"+filterValue, 'i');

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

    toggleInfoPageTeasers: function(hide) {
    	var me = this,
			clubArea = this.getClubArea(),
			teaser = clubArea.down('infopageteaser');

		teaser.setHidden(!hide);		
    }
});
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
			infoPageSearchField: 'clubarea infopageoverview searchfield',			

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
				keyup: 'filterInfoPages',
				clearicontap: 'clearInfoPageFilter'
			},
			infoPageCarouselBackButton: {
				tap: 'infoPageCarouselBackButtonHandler'
			}
		},
		//true when all carousel panels have been created
		panelsCreated : false
	},

	init: function() {		
		this.getApplication().getController('CheckIn').on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.loadInfoPages();
			}
		}, this);
	},
	/**
	* Load infopages into infopageStore.
	*/
	loadInfoPages: function() {
		var store = Ext.StoreManager.lookup('infopageStore');

		console.log('InfoPage.loadInfoPages');

		store.load();

	},
	/**
	* Create a panel for each entry in infoPageStore.
	*/
	createCarouselPanels: function() {
		var me = this,
			store = Ext.StoreManager.lookup('infopageStore'),
			infoPageCarousel = this.getInfoPageCarousel(),
			carousel = infoPageCarousel.down('carousel'),			
			currentPanel = null;

			//skip if panels already exist
			if(this.getPanelsCreated()) {
				return;
			}

			//make sure to create panels before store gets filtered
			//alternative clear filter
			store.each(function(record) {
				currentPanel = Ext.create('IPDetail');
				currentPanel.getTpl().overwrite(currentPanel.element, record.getData());
				carousel.add(currentPanel);
			});
		

			this.setPanelsCreated(true);		

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
			infoPageList.select(store.getAt(container.getActiveIndex()));
		}	
	},

	/**
	* Tap event handler for showInfoPagesButton.
	*/
	showInfoPageButtonHandler: function(button) {
		var me = this,
			infopageOverview = this.getInfoPageOverview(),
			clubArea = this.getClubArea(),
			androidCtr = this.getApplication().getController('Android');

		clubArea.setActiveItem(infopageOverview);
		this.createCarouselPanels();

		androidCtr.addBackHandler(function() {
            me.backToDashboard();
        });
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
		clubArea.switchAnim('right');
		clubArea.setActiveItem(0);
		clubArea.switchAnim('left');
    },

    /**
    * Return to infopage overview.
    */
    backToOverview: function(button) {
    	var me = this,
    		infopageOverview = this.getInfoPageOverview(),
    		carousel = this.getInfoPageCarousel().down('carousel'),
			clubArea = this.getClubArea();

		carousel.un('activeitemchange', this.setListIndex, this);

		clubArea.switchAnim('right');
		clubArea.setActiveItem(infopageOverview);
		clubArea.switchAnim('left');		
    },


    /**
    * Filters the info pages based on the value of textfield.
    *
    */
    filterInfoPages: function(textfield) {
    	var filterValue = textfield.getValue(),
    		store = Ext.StoreManager.lookup('infopageStore'),
    		filterExists = (filterValue) ? true : false;

    		store.clearFilter(filterExists);
    		if(filterExists) {
    			// store.filter(filter);	
    			store.filterBy(function(record) {
    				var title = record.get('title'),
    					shortText = record.get('shortText'),
    					regEx = new RegExp("^"+filterValue, 'i');

    				if(title.match(regEx)) {
    					return true;
    				}

    				regEx = new RegExp(filterValue, 'i');

    				if(shortText.match(regEx)) {
    					return true;
    				}

    				return false;
    			});
    		}
    },
    /**
    * Remove filters from infoPageStore.
    */
    clearInfoPageFilter: function() {
    	var store = Ext.StoreManager.lookup('infopageStore');

    	store.clearFilter();
    }
});
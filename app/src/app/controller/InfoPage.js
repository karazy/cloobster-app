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
	/**
	* Load infopages into infopageStore.
	*/
	loadInfoPages: function() {
		var store = Ext.StoreManager.lookup('infopageStore');

		store.load();

	},

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

			//TODO ignore filter
			store.each(function(record) {
				currentPanel = Ext.create('IPDetail');
				currentPanel.getTpl().overwrite(currentPanel.element, record.getData());
				carousel.add(currentPanel);
			});
		

			this.setPanelsCreated(true);		

	},

	showInfoPageDetail: function(dataview, record) {
		var ipcarousel = this.getInfoPageCarousel(),
			carousel = ipcarousel.down('carousel'),
			clubArea = this.getClubArea(),
			androidCtr = this.getApplication().getController('Android'),
			infoPageList = this.getInfoPageList(),
			store = Ext.StoreManager.lookup('infopageStore'),
			index;

		index = store.indexOf(record);

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



    filterInfoPages: function(textfield) {
    	var filterValue = textfield.getValue(),
    		store = Ext.StoreManager.lookup('infopageStore'),
    		// filter = [
    		// {
    		// 	property: 'title',
    		// 	value: filterValue
    		// }, 
    		// {
    		// 	property: 'shortText',
    		// 	value: filterValue,
    		// 	anyMatch: true
    		// }],
    		filterExists = (filterValue) ? true : false;

    		//TODO filter by a function

    		store.clearFilter(filterExists);
    		if(filterExists) {
    			// store.filter(filter);	
    			store.filterBy(function(record) {
    				var title = record.get('title'),
    					shortText = record.get('shortText'),
    					regEx = new RegExp("^"+filterValue);

    				if(title.match(regEx)) {
    					return true;
    				}

    				regEx = new RegExp(filterValue);

    				if(shortText.match(regEx)) {
    					return true;
    				}

    				return false;
    			});
    		}
    },
    clearInfoPageFilter: function() {
    	var store = Ext.StoreManager.lookup('infopageStore');

    	store.clearFilter();
    }
});
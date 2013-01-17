/**
* 
*/
Ext.define('EatSense.view.components.DashboardTeaser', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'dashboardteaser',
	config: {
		layout: 'fit',
		tpl: null,
		/**
		* @cfg
		*/
		store: null,
		page: null,
		//used to determine the visible state of the teaser
		basicMode: false,
		//used to determine the visible state of the teaser
		pageGenerated: false,
		padding: 3,
		/**
		* @cfg {String|Object} filter
		*/
		filter: '',
		cls: 'infopage-teaser'
	},

	// initConfig: function(config) {
	// 	this.callParent();


	// },

	initialize: function(config) {
		var me = this,
			store = null;		

		if(!this.getStore()) {
			console.log('DashboardTeaser.constructor: No store configuration provided.');
			// this.setHidden(true);
			return;
		}
		// console.log('InfoPageTeaser.constructor: store ' + this.getStore());

		store = Ext.StoreManager.lookup(this.getStore());
		this.setStore(store);

		// this.setTpl(config.tpl);

		if(store) {
			store.on('refresh', this.generateRandomPage, this);
			store.on('load', this.generateRandomPage, this);
		}

		if(store.isLoaded()) {
			this.generateRandomPage();
		}

		this.on({
			tap : this.teaserTap,
			element : 'element'
		});
	},

	generateRandomPage: function() {
		var storeCount,
			page,
			randomPageIndex,
			storeFilters,
			store = this.getStore();

		storeFilters = store.getFilters();
		store.clearFilter(true);
		if(this.getFilter()) {
			store.filter(this.getFilter());
		}
		storeCount = this.getStore().getCount();

		if(storeCount > 0) {
			//get a random index
			randomPageIndex = Math.round(Math.random() * (storeCount-1));
			// console.log('InfoPageTeaser.generateRandomPage: storeCount=' + storeCount + ' randomPageIndex=' + randomPageIndex);		
			//get random page based on index
			page = this.getStore().getAt(randomPageIndex);
			
			this.setPage(page);

			this.getTpl().overwrite(this.element, page.getData());
			this.setState({'pageGenerated' : true});
		} else {
			//don't show if no pages exist
			this.setState({'pageGenerated' : false});
			// this.setHidden(true);
			console.log('DashboardTeaser.generateRandomPage: no pages exist. hide teaser.');
		}

		if(this.getFilter()) {
			store.clearFilter(true);
		}
		store.setFilters(storeFilters);
	},

	teaserTap: function() {
		var me = this;

		if(!this.getPage()) {
			console.log('DashboardTeaser.teaserTap: no page exists');
			return;
		}

		me.fireEvent('teasertapped', this.getPage());
	},
	/**
	* Resets teaser to initial state.
	*/
	reset: function() {
		this.setBasicMode(false);
		this.setPageGenerated(false);
		this.setPage(null);
	},
	/**
	* Manages the visibility state for the teaser object.
	* The state depends on locations basic flag and if info pages exist.
	* Only basicMode and pageGenerated are true, the teaser gets rendered.
	* @param stateObject
	*	Object with fields basicMode and/or pageGenerated set either to true or false
	*/
	setState: function(stateObject) {
		if(!stateObject) {
			console.log('DashboardTeaser.setState: no state object provided.');
		}

		// console.log('InfoPageTeaser.setState: basicMode='+stateObject.basicMode+' pageGenerated='+stateObject.pageGenerated);

		if(stateObject.basicMode) {
			this.setBasicMode(true);
		}

		if(stateObject.pageGenerated) {
			this.setPageGenerated(true);
		}
		//this.getBasicMode() === true && 
		if(this.getPageGenerated() === true) {
			this.setHidden(false);
		} else {
			this.setHidden(true);
		}
	}

});
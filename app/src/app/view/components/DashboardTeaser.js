/**
* Renders a random teaser based on a given store.
* This teaser is usually displayed on a dashboard.
* Uses some logic from {@link Ext.Button}.
*/
Ext.define('EatSense.view.components.DashboardTeaser', {
	extend: 'Ext.Panel',

	 /**
     * @event teasertapped
     * Fires whenever a teaser is tapped.
     * @param {Ext.data.Model} the record displayed by this teaser.
     */


	requires: [],
	xtype: 'dashboardteaser',
	config: {
		layout: 'fit',
		/**
		* @cfg {Ext.XTemplate} tpl
		*	Template used to render the teaser.
		*/
		tpl: null,
		/**
		* @cfg {String} store
		*	Accepts a string with the name of store to use for this teaser.
		*	Supports nested stores. E. g. you have a category which has assigned products. You can
		*	set store to categoriesStore.productsStore
		* @accessor
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
		* 	Filter to apply to the store. If nested stores exist it only gets applied to the last store.
		*/
		filter: '',

		cls: 'infopage-teaser',

		/**
         * @cfg {String} pressedCls
         * The CSS class to add to the teaser in pressed mode.
         * @accessor
         */
        pressedCls: Ext.baseCSSPrefix + 'teaser-pressed',

        /**
         * @cfg {Number/Boolean} pressedDelay
         * The amount of delay between the `tapstart` and the moment we add the `pressedCls` (in milliseconds).
         * Settings this to `true` defaults to 100ms.
         */
        pressedDelay: 0
	},

	/**
	* @private
	* Used if store cfg contains nested stores.
	*/
	nestedStores: null,

	initialize: function(config) {
		var me = this,
			store = null,
			nestedStores = null;		

		if(!me.config.store) {
			console.log('DashboardTeaser.constructor: No store configuration provided.');
			return;
		}
		// console.log('DashboardTeaser.constructor: store ' + this.getStore());

		nestedStores = me.config.store.split('.');

		nestedStores = Ext.isArray(nestedStores) ? nestedStores : [nestedStores];

		store = Ext.StoreManager.lookup(nestedStores[0]);
		this.setStore(store);		
		this.nestedStores = nestedStores.slice(1, nestedStores.length);

		this.setMasked({
	        xtype: 'loadmask'
	        // message: i10n.translate('loading')
	     });

		if(store) {
			//regnerate the teaser on store load
			// store.on('refresh', this.generateRandomPage, this);
			store.on('load', this.generateRandomPage, this);
		}
		//if store already has beed loaded directly generate teaser
		if(store.isLoaded()) {
			this.generateRandomPage();
		}

		this.element.on({
            scope      : this,
            tap        : 'onTap',
            touchstart : 'onPress',
            touchend   : 'onRelease'
        });
	},
	/**
	* @private
	*	Renders the teaser by getting a random record from the store and applying it to 
	*	the tpl.
	*/
	generateRandomPage: function() {
		var me = this,
			storeCount,
			page,
			randomPageIndex,
			storeFilters,
			store = this.getStore(),
			nestedStoreInstance,
			nestedStoreFilter;

		// storeFilters = store.getFilters();
		// store.clearFilter(true);
		
		// if(this.getFilter() && !this.nestedStores.length > 0) {
		// 	store.filter(this.getFilter());
		// }

		randomPageIndex = this.getRandomStoreNumber(store);

		if(store.getCount() > 0) {

			page = this.getStore().getAt(randomPageIndex);

			if(this.nestedStores) {
				//if nested stores exist iterate over all of them to get the final random record
				Ext.Array.each(this.nestedStores, function(nested, index) {
					nestedStoreInstance = page[nested + ''];
					//clear possible filters
					// nestedStoreFilter = nestedStoreInstance.getFilters();
					// nestedStoreInstance.clearFilter(true);

					// if(me.getFilter() && index == (me.nestedStores.length - 1)) {
						// nestedStoreInstance.findBy(me.getFilter());
						// nestedStoreInstance.filter('special', true);
					// }

					if(!nestedStoreInstance) {
						console.log('EatSense.view.components.DashboardTeaser.generateRandomPage: non existing nested store ' + nested);
						return false;
					}
					randomPageIndex = me.getRandomStoreNumber(nestedStoreInstance);
					page = nestedStoreInstance.getAt(randomPageIndex);

					// if(me.getFilter() && index == (me.nestedStores.length - 1)) {
					// 	nestedStoreInstance.clearFilter(true);
					// }

					// nestedStoreInstance.setFilters(nestedStoreFilter);
				});
			}
			
			if(!page) {
				console.log('EatSense.view.components.DashboardTeaser.generateRandomPage: no page found, perhabs you provided a wrong filter');
				return;
			}

			this.setPage(page);

			this.getTpl().overwrite(this.element, page.getData());
			this.setState({'pageGenerated' : true});
		} else {
			//don't show if no pages exist
			this.setState({'pageGenerated' : false});
			// this.setHidden(true);
			console.log('DashboardTeaser.generateRandomPage: no pages exist. hide teaser.');
		}

		this.setMasked(false);

		// if(this.getFilter() && !this.nestedStores.length > 0) {
		// 	store.clearFilter(true);
		// }
		// store.setFilters(storeFilters);
	},
	/**
	* @private
	* Returns a random index based on the given stores size.
	* @param {Ext.data.Store} store
	*	store to get random index
	* @return
	*	Random Index, -1 if no store provided
	*/
	getRandomStoreNumber: function(store) {
		var storeCount,
			randomPageIndex = 0;

		if(!store) {
			return -1;
		}

		storeCount = store.getCount();

		if(storeCount > 0) {
			//get a random index
			randomPageIndex = Math.round(Math.random() * (storeCount-1));
		}

		return randomPageIndex;
	},

	/**
	* @private
	*	Called when tap event is fired on element.
	*/
	onTap: function() {
		var me = this;

		if(!this.getPage()) {
			console.log('DashboardTeaser.onTap: no page exists');
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

		// console.log('EatSense.view.components.DashboardTeaser.setState: basicMode='+stateObject.basicMode+' pageGenerated='+stateObject.pageGenerated);

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
	},

	// @private
	applyPressedDelay: function(delay) {
        if (Ext.isNumber(delay)) {
            return delay;
        }
        return (delay) ? 100 : 0;
    },

	// @private
    updatePressedCls: function(pressedCls, oldPressedCls) {
        var element = this.element;

        if (element.hasCls(oldPressedCls)) {
            element.replaceCls(oldPressedCls, pressedCls);
        }
    },

    // @private
    onPress: function() {
        var me = this,
            element = me.element,
            pressedDelay = me.getPressedDelay(),
            pressedCls = me.getPressedCls();

        if (!me.getDisabled()) {
            if (pressedDelay > 0) {
                me.pressedTimeout = setTimeout(function() {
                    delete me.pressedTimeout;
                    if (element) {
                        element.addCls(pressedCls);
                    }
                }, pressedDelay);
            }
            else {
                element.addCls(pressedCls);
            }
        }
    },
    
    // @private
    onRelease: function(e) {
        this.fireAction('release', [this, e], 'doRelease');
    },

    // @private
    doRelease: function(me, e) {
        if (!me.getDisabled()) {
            if (me.hasOwnProperty('pressedTimeout')) {
                clearTimeout(me.pressedTimeout);
                delete me.pressedTimeout;
            }
            else {
                me.element.removeCls(me.getPressedCls());
            }
        }
    }

});
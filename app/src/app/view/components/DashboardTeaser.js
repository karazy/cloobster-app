/**
* Uses some logic from {@link Ext.Button}.
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
		* @accessor
		*/
		store: null,
		/**
		* @private
		*/
		nestedStores: null,
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

	initialize: function(config) {
		var me = this,
			store = null,
			nestedStores = null;		

		if(!me.config.store) {
			console.log('DashboardTeaser.constructor: No store configuration provided.');
			// this.setHidden(true);
			return;
		}
		// console.log('InfoPageTeaser.constructor: store ' + this.getStore());

		nestedStores = me.config.store.split('.');

		nestedStores = Ext.isArray(nestedStores) ? nestedStores : [nestedStores];

		store = Ext.StoreManager.lookup(nestedStores[0]);
		this.setStore(store);		
		this.setNestedStores(nestedStores.slice(1, nestedStores.length));

		if(store) {
			//regnerate the teaser on store load or refresh
			store.on('refresh', this.generateRandomPage, this);
			store.on('load', this.generateRandomPage, this);
		}
		//if store already has beed loaded directly generate teaser
		if(store.isLoaded()) {
			this.generateRandomPage();
		}

		this.element.on({
            scope      : this,
            tap        : 'teaserTap',
            touchstart : 'onPress',
            touchend   : 'onRelease'
        });
	},

	generateRandomPage: function() {
		var me = this,
			storeCount,
			page,
			randomPageIndex,
			storeFilters,
			store = this.getStore(),
			productStore,
			nestedStores = this.getNestedStores();

		storeFilters = store.getFilters();
		store.clearFilter(true);
		if(this.getFilter()) {
			store.filter(this.getFilter());
		}

		randomPageIndex = this.getRandomStoreNumber(store);

		if(randomPageIndex > 0) {	

			page = this.getStore().getAt(randomPageIndex);

			if(nestedStores) {
				//if nested stores exist iterate over all of them to get the final random record
				Ext.Array.each(nestedStores, function(nested) {
					productsStore = page[nested + ''];
					if(!productsStore) {
						console.log('EatSense.view.components.DashboardTeaser.generateRandomPage: non existing nested store ' + nested);
						return false;
					}
					randomPageIndex = me.getRandomStoreNumber(productsStore);
					page = productsStore.getAt(randomPageIndex);
				});
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

		if(this.getFilter()) {
			store.clearFilter(true);
		}
		store.setFilters(storeFilters);
	},

	getRandomStoreNumber: function(store) {
		var storeCount,
			randomPageIndex = 0;

		storeCount = store.getAllCount();

		if(storeCount > 0) {
			//get a random index
			randomPageIndex = Math.round(Math.random() * (storeCount-1));
		}

		return randomPageIndex;
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
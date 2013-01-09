/**
* 
*/
Ext.define('EatSense.view.components.InfoPageTeaser', {
	extend: 'Ext.Panel',
	requires: [],
	xtype: 'infopageteaser',
	config: {
		layout: 'fit',
		pageStore: null,
		tpl: new Ext.XTemplate( //<img src="{imageUrl}"/>
			'<div class="">'+
				'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}\')"></div></tpl>'+
				'<div class="text-container">'+
					'<h3>{title}</h3>'+
					'<p>{shortText}</p>'+
				'</div>'+
				'<div class="info-icon"></div>'+
			'</div>'
			),
		store: null,
		page: null,
		//used to determine the visible state of the teaser
		basicMode: false,
		//used to determine the visible state of the teaser
		pageGenerated: false,
		padding: 3,
		width: '90%',
		cls: 'infopage-teaser'
	},

	initialize: function(config) {
		var me = this,
			pageStore = null;		

		if(!this.getPageStore()) {
			console.log('InfoPageTeaser.constructor: No store configuration provided.');
			// this.setHidden(true);
			return;
		}
		// console.log('InfoPageTeaser.constructor: store ' + this.getPageStore());

		pageStore = Ext.StoreManager.lookup(this.getPageStore());
		this.setStore(pageStore);

		if(pageStore) {
			pageStore.on('refresh', this.generateRandomPage, this);
		}

		this.on({
			tap : this.teaserTap,
			element : 'element'
		});
	},

	generateRandomPage: function() {
		var pagesCount,
			page,
			randomPageIndex;

		pagesCount = this.getStore().getCount();		

		if(pagesCount > 0) {
			//get a random index
			randomPageIndex = Math.round(Math.random() * (pagesCount-1));
			// console.log('InfoPageTeaser.generateRandomPage: pagesCount=' + pagesCount + ' randomPageIndex=' + randomPageIndex);		
			//get random page based on index
			page = this.getStore().getAt(randomPageIndex);
			
			this.setPage(page);

			this.getTpl().overwrite(this.element, page.getData());
			this.setState({'pageGenerated' : true});
		} else {
			//don't show if no pages exist
			this.setState({'pageGenerated' : false});
			// this.setHidden(true);
			console.log('InfoPageTeaser.generateRandomPage: no pages exist. hide teaser.');
		}
	},
	teaserTap: function() {
		var me = this;

		if(!this.getPage()) {
			console.log('InfoPageTeaser.teaserTap: no page exists');
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
			console.log('InfoPageTeaser.setState: no state object provided.');
		}

		// console.log('InfoPageTeaser.setState: basicMode='+stateObject.basicMode+' pageGenerated='+stateObject.pageGenerated);

		if(stateObject.basicMode) {
			this.setBasicMode(true);
		}

		if(stateObject.pageGenerated) {
			this.setPageGenerated(true);
		}

		if(this.getBasicMode() === true && this.getPageGenerated() === true) {
			this.setHidden(false);
		} else {
			this.setHidden(true);
		}
	}

});
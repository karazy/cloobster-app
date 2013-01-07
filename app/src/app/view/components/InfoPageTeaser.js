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
		tpl: new Ext.XTemplate(
			'<div class="">'+
				'<div class="thumbnail"><img src="{imageUrl}"/></div>'+
				// '</div>'+
				'<h3>{title}</h3>'+
				'<p>{shortText}</p>'+
				// '<div>'
				'<div class="info-icon"></div>'+
			'</div>'
			),
		store: null,
		page: null,
		padding: 5,
		width: '90%',
		cls: 'infopage-teaser'
		// style: 'border: 1px solid gray; padding: 5px; height: 110px; overflow: hidden; text-overflow: ellipsis; color: #1E4776;'
	},

	initialize: function(config) {
		var me = this,
			pageStore = null;		

		console.log('InfoPageTeaser.constructor');

		// this.initConfig(config);

		if(!this.getPageStore()) {
			console.log('InfoPageTeaser.constructor: No store configuration provided. Hide component.');
			// this.setHidden(true);
			return;
		}
		console.log('InfoPageTeaser.constructor: load store ' + this.getPageStore());

		pageStore = Ext.StoreManager.lookup(this.getPageStore());
		this.setStore(pageStore);
		
		// this.on('show', this.generateRandomPage);

		if(pageStore) {
			pageStore.on('load', this.generateRandomPage, this);
		}
		this.on({
			tap : this.teaserTap,
			element : 'element'
		});
		// this.addListener(this.element, 'tap', function(panel) {
		// 	me.teaserTap();
		// });
	},

	generateRandomPage: function() {
		var pagesCount,
			page,
			randomPageIndex;

		pagesCount = this.getStore().getCount();

		if(pagesCount > 0) {
			//get a random index
			randomPageIndex = Math.round(Math.random() * pagesCount);
			//get random page based on index
			page = this.getStore().getAt(randomPageIndex);
			
			this.setPage(page);

			this.getTpl().overwrite(this.element, page.getData());
		} else {
			//don't show if no pages exist
			this.setHidden(true);
		}
	},

	teaserTap: function() {
		var me = this;

		if(!this.getPage()) {
			console.log('InfoPageTeaser.teaserTap: no page exists');
			return;
		}

		me.fireEvent('teasertapped', this.getPage());
	}

});
/**
* Loads and handles events data from ztix API and displays it.
* All relevant information from {@link EatSense.model.ZtixEvent} is displayed her.
*/
Ext.define('EatSense.controller.Ztix', {
	extend: 'Ext.app.Controller',
	requires: [
		'EatSense.view.ZtixEvents',
		'EatSense.view.ZtixEventDetail'
	],
	config: {
		refs: {
			eventsArea : 'slidenavcontainer[action=show-ztix-events]',
			couponsArea : 'slidenavcontainer[action=show-ztix-coupons]'
		},
		control: {
			eventsArea: {
				show: 'showEventsArea'
			},
			couponsArea: {
				show: 'showCouponsArea'
			}
		},
		/**
		* @accessor
		* The host Id(s) for which to load events.
		*/
		hostId: null,
		/**
		* @accessor
		* The coupons issuer id(s).
		*/
		couponIds: null,
		/**
		* @accessor
		* The active displayed month
		*/
		currentPaginationDate: null
	},

	launch: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.on({
			'statusChanged': function(status) {
				if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
					this.cleanup();
				}
			},
			'businessloaded' : function(business) {
			 	this.setup(business);
			 },
			scope: this
		})
	},

	/**
	* Reads ztix configuration.
	*/
	setup: function(business) {
		if(!business) {
			console.error('Ztix.setup: no business given');
			return;
		}

		if(business.raw.configuration) {
			if(business.raw.configuration.hasOwnProperty('de.ztix')) {
				this.setHostId(business.raw.configuration['de.ztix'].hosts);
				this.setCouponIds(business.raw.configuration['de.ztix'].coupons);
			}
		}
	},

	/**
	* @private
	* Show Event handler for eventsArea.
	* @param {EatSense.view.components.SlideNavContainer} area
	*/
	showEventsArea: function(area) {
		this.showZtixData(area, "events");
	},

	/**
	* @private
	* Show Event handler for couponsArea.
	* @param {EatSense.view.components.SlideNavContainer} area
	*/
	showCouponsArea: function(area) {
		this.showZtixData(area, "coupons");
	},

	/**
	* @private
	* Display ztix data.
	* Creates {@link EatSense.view.ZtixEvents} during runtime and destroys it on hide.
	* @param {EatSense.view.components.SlideNavContainer} area
	* @param {String} dataType
	*  Type of data to show. Can be coupons or events.
	*/
	showZtixData: function(area, dataType) {
		var me = this,
			eventsView,
			nextMonthBt,
			prevMonthBt,
			tmpDate,
			storeId,
			store,
			today,
			list,
			dataType = dataType || "events";

		//Create the events view
		if(dataType == "events" || !dataType) {
			storeId = 'ztixEventsStore';
		} else if(dataType == "coupons") {
			storeId ='ztixCouponsStore';
		}

		store = Ext.StoreManager.lookup(storeId);

		eventsView = Ext.create('EatSense.view.ZtixEvents', {
			store: storeId
		});

		area.add(eventsView);
		area.setActiveItem(0);

		nextMonthBt = eventsView.down('button[action=next-month]');
		prevMonthBt = eventsView.down('button[action=prev-month]');

		tmpDate = new Date();
		today = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());

		if(!store.getCurrentPaginationDate()) {			
			store.setCurrentPaginationDate(new Date(today.getTime()));
		} else if(store.getCurrentPaginationDate() < today) {
			//if date lies in the past, hide the button and set today as date
			store.setCurrentPaginationDate(new Date(today.getTime()));				
			prevMonthBt.setHidden(true);
		} else {
			prevMonthBt.setHidden(false);
		}

		setViewTitle();

		Ext.create('Ext.util.DelayedTask', function () {
			this.loadEvents(store.getCurrentPaginationDate(), dataType);                  
		}, this).delay(200); 
		
		
		nextMonthBt.on({
			tap: nextMonthBtHandler,
			scope: this
		});

		prevMonthBt.on({
			tap: prevMonthBtHandler,
			scope: this
		});

		area.on({
			'hide': cleanup,
			scope: this
		});

		eventsView.on({
			select: showEventDetailHandler,
			scope: this
		});

		function prevMonthBtHandler() {			
			//decrease date
			store.getCurrentPaginationDate().setMonth(store.getCurrentPaginationDate().getMonth() - 1);

			if(store.getCurrentPaginationDate() < today) {
				//if date lies in the past, hide the button and set today as date
				store.setCurrentPaginationDate(new Date(today.getTime()));				
				prevMonthBt.setHidden(true);
			}

			me.loadEvents(store.getCurrentPaginationDate(), dataType);
			setViewTitle();
		}

		function nextMonthBtHandler() {
			//if last date was today set day of month to 1 to see all events of coming month
			if(store.getCurrentPaginationDate().getTime() == today.getTime()) {
				store.getCurrentPaginationDate().setDate(1);	
			}
			//increase date
			store.getCurrentPaginationDate().setMonth(store.getCurrentPaginationDate().getMonth() + 1);
			me.loadEvents(store.getCurrentPaginationDate(), dataType);
			prevMonthBt.setHidden(false);
			setViewTitle();
		}

		function setViewTitle() {
			if(store.getCurrentPaginationDate()) {
				var shortYear = store.getCurrentPaginationDate().getFullYear().toString().substring(2,4),
					shortMonth = i10n.translate('month.' + store.getCurrentPaginationDate().getMonth());

				eventsView.down('titlebar').setTitle(shortMonth + ' ' + shortYear);
			}
		}

		function showEventDetailHandler(dataview, eventData) {
			this.showEventDetail(area, dataview, eventData);
		}

		function cleanup() {
			area.un({
				'hide': cleanup,
				scope: this
			});

			eventsView.un({
				select: showEventDetailHandler,
				scope: this
			});

			nextMonthBt.un({
				tap: nextMonthBtHandler,
				scope: this
			});

			prevMonthBt.on({
				tap: prevMonthBtHandler,
				scope: this
			});

			area.remove(eventsView);
			eventsView.destroy();
		}
	},

	/**
	* @private
	* Loads {@link EatSense.model.ZtixEvent} from ztix server.
	* @param {String} startDate
	*	The date from which to start.
	* @param {String} dataType
	*/
	loadEvents: function(startDate, dataType) {
		var me = this,
			store,
			baseUrl = appConfig.getProp('de-ztix.baseUrl'),
			_startDate,
			_endDate,
			paginationSuffix,
			dataType = dataType || "events",
			newUrl,
			oldUrl;

		if(dataType == "events" || !dataType) {
			store = Ext.StoreManager.lookup('ztixEventsStore');
		} else if(dataType == "coupons") {
			store = Ext.StoreManager.lookup('ztixCouponsStore');
		}
		

		if(!store) {
			console.error('Ztix.loadEvents: no ztixEventsStore exists');
			return;
		}

		oldUrl = store.getProxy().getUrl();

		if(!baseUrl) {
			console.error('Ztix.loadEvents: no baseUrl exists');
			return;	
		}

		if(!this.getHostId()) {
			console.error('Ztix.loadEvents: ho host id exists');
			return;
		}

		//Pagination logic
		if(!startDate) {
			paginationSuffix = Ext.util.Format.date(new Date(), appConstants.ISODate) + '/2014-12-31/';
		} else {
			_endDate = new Date(startDate);
			//get last day of current month, setting 0 as day results in last day of prev month
			_endDate.setFullYear(_endDate.getFullYear(), _endDate.getMonth() + 1, 0);
			paginationSuffix = Ext.util.Format.date(startDate, appConstants.ISODate) + '/';
			paginationSuffix += Ext.util.Format.date(_endDate, appConstants.ISODate) + '/';
		}

		if(dataType == "events" || !dataType) {
			newUrl = baseUrl + paginationSuffix + this.getHostId();
		} else if(dataType == "coupons") {
			newUrl = baseUrl + paginationSuffix + this.getCouponIds();
		}

		store.getProxy().setUrl(newUrl);

		//reload, if url is old or store never has been loaded
		if(!store.isLoaded() || oldUrl != store.getProxy().getUrl()) {
			store.load({
				callback: function(records, operation, success) {
					if(operation.error) {
						me.getApplication().handleServerError({
		                    'error': operation.error
		                });
					} else if(records.length === 0) {
						store.removeAll();
						// appHelper.showNotificationBox(i10n.translate('de.ztix.events.noeventsinmonth'), 2500);
					}
				}
			});	
		}
	},

	/**
	* @private
	* Handles select event of a list.
	* Create and show a {@link EatSense.view.ZtixEventDetail} for given record.
	* @param {Ext.dataview.List} dataview
	*	List firing the select event.
	* @param {EatSense.model.ZtixEvent} eventData
	*	record to display
	*/
	showEventDetail: function(container, dataview, eventData) {
		var me = this,
			backBt,
			openLinkBt,
			vvk = appConfig.getProp('de-ztix.vvk') || '',
			view;

		view = Ext.create('EatSense.view.ZtixEventDetail', {
			backButton: true
		});

		container.add(view);
		container.setActiveItem(1); 

		view.setEventData(eventData);

		backBt = view.down('button[action=back]');
		openLinkBt = view.down('button[action=open-link]');

		container.on({
			'hide': cleanup,
			scope: this
		});

		if(backBt) {
			backBt.on({
				tap: cleanup,
				scope: this
			});
		}		

		if(openLinkBt) {
			if(!eventData.get('link')) {
				openLinkBt.setHidden(true);
			}

			openLinkBt.on({
				tap: openLink,
				scope: this
			});
		}

		function openLink() {
			if(eventData.get('link')) {
				if(vvk) {
					vvk = '/' + vvk;
				}
				window.open(encodeURI(eventData.get('link')) + vvk, '_system');
			}				
		}

		function cleanup() {
			container.un({
				'hide': cleanup,
				scope: this
			});

			if(backBt) {
				backBt.un({
					tap: cleanup,
					scope: this
				});
			}

			if(openLinkBt) {
				openLinkBt.un({
					tap: openLink,
					scope: this
				});
			}

			container.setActiveItem(0);
			view.hide();
			view.destroy();
		}
	},

	/**
	* Common controller cleanup method.
	* Called after checkout.
	*/
	cleanup: function() {
		var me = this,
			store = Ext.StoreManager.lookup('ztixEventsStore'),
			eventsArea = this.getEventsArea();

		if(store) {
			store.removeAll();
		}

		this.setHostId(null);

		if(eventsArea) {
			eventsArea.removeAll(true);
		}

		this.setCurrentPaginationDate(null);
	}
});
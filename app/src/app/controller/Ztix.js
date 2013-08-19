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
			eventsArea : 'slidenavcontainer[action=show-ztix-events]'
		},
		control: {
			eventsArea: {
				show: 'showEventsArea'
			}
		},
		/**
		* The host Id for which to load events.
		*/
		hostId: null,
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
			}
		}
	},

	/**
	* @private
	* Show Event handler for ztix container.
	* Creates {@link EatSense.view.ZtixEvents} during runtime and destroys it on hide.
	*/
	showEventsArea: function(area) {
		var me = this,
			store = Ext.StoreManager.lookup('ztixEventsStore'),
			eventsView,
			nextMonthBt,
			prevMonthBt,
			tmpDate,
			list;		

		//Create the events view
		eventsView = Ext.create('EatSense.view.ZtixEvents');
		area.add(eventsView);
		area.setActiveItem(0);

		if(!this.getCurrentPaginationDate()) {
			tmpDate = new Date();
			this.setCurrentPaginationDate(new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1));
		}

		setViewTitle();

		Ext.create('Ext.util.DelayedTask', function () {
			this.loadEvents(this.getCurrentPaginationDate());                  
		}, this).delay(200); 

		nextMonthBt = eventsView.down('button[action=next-month]');
		prevMonthBt = eventsView.down('button[action=prev-month]');
		
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
			select: this.showEventDetail,
			scope: this
		});

		function prevMonthBtHandler() {
			//check if not in the past
			//decrease date
			this.getCurrentPaginationDate().setMonth(this.getCurrentPaginationDate().getMonth() - 1);
			this.loadEvents(this.getCurrentPaginationDate());
			setViewTitle();
		}

		function nextMonthBtHandler() {
			//increase date
			this.getCurrentPaginationDate().setMonth(this.getCurrentPaginationDate().getMonth() + 1);
			this.loadEvents(this.getCurrentPaginationDate());
			// prevMonthBt.setHidden(false);
			setViewTitle();
		}

		function setViewTitle() {
			if(me.getCurrentPaginationDate()) {
				var shortYear = me.getCurrentPaginationDate().getFullYear().toString().substring(2,4),
					shortMonth = i10n.translate('month.' + me.getCurrentPaginationDate().getMonth());

				eventsView.down('titlebar').setTitle(shortMonth + ' ' + shortYear);
			}
		}

		function cleanup() {
			area.un({
				'hide': cleanup,
				scope: this
			});

			eventsView.un({
				select: this.showEventDetail,
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
	*/
	loadEvents: function(startDate) {
		var me = this,
			store = Ext.StoreManager.lookup('ztixEventsStore'),
			baseUrl = appConfig.getProp('de-ztix.baseUrl'),
			_startDate,
			_endDate,
			paginationSuffix,
			oldUrl;

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

		store.getProxy().setUrl(baseUrl + paginationSuffix + this.getHostId());

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
	showEventDetail: function(dataview, eventData) {
		var me = this,
			backBt,
			openLinkBt,
			container = this.getEventsArea(),
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
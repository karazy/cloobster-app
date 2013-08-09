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
		}
	},

	//TODO make sure on checkout to reload
	//handle cleanup on checkout
	//load correct data

	launch: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.on({
			'statuschanged': function(status) {
				if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
					//reset stores...
				}
			},
			'businessloaded' : function(business) {
			 	// this.setup(business);
			 },
			scope: this
		})
	},

	/**
	* @private
	* Show Event handler for ztix container.
	* Creates {@link EatSense.view.ZtixEvents} during runtime and destroys it on hide.
	*/
	showEventsArea: function(area) {
		var store = Ext.StoreManager.lookup('ztixEventsStore'),
			eventsView,
			list;		

		//Create the events view
		eventsView = Ext.create('EatSense.view.ZtixEvents');
		area.add(eventsView);
		area.setActiveItem(0);

		Ext.create('Ext.util.DelayedTask', function () {
			this.loadEvents();                  
		}, this).delay(200);     
		

		area.on({
			'hide': cleanup,
			scope: this
		});

		eventsView.on({
			select: this.showEventDetail,
			scope: this
		});

		function cleanup() {
			area.un({
				'hide': cleanup,
				scope: this
			});

			eventsView.un({
				select: this.showEventDetail,
				scope: this
			});

			area.remove(eventsView);
			eventsView.destroy();
		}
	},

	/**
	* @private
	* Loads {@link EatSense.model.ZtixEvent} from ztix server.
	*/
	loadEvents: function() {
		var me = this,
			store = Ext.StoreManager.lookup('ztixEventsStore');

		if(!store) {
			console.error('Ztix.loadEvents: no ztixEventsStore exists');
			return;
		}

		store.getProxy().setUrl('http://88.198.11.203/xmlExport/index.php/main/getEvents/001');

		if(!store.isLoaded()) {
			store.load({
				callback: function(records, operation, success) {
					if(operation.error) {
						me.getApplication().handleServerError({
		                    'error': operation.error
		                });
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
				window.open(encodeURI(eventData.get('link')), '_system');
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

	}
});
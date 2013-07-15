/**
* Loads and handles events data from ztix API and displays it.
* All relevant information from {@link EatSense.model.ZtixEvent} is displayed her.
*/
Ext.define('EatSense.controller.Ztix', {
	extend: 'Ext.app.Controller',
	requires: [
		'EatSense.view.EventDetail'
	],
	config: {
			refs: {
				eventsArea : 'eventsarea'
			},
		control: {
			eventsArea: {
				show: 'showEventsArea'
			}
		}
	},

	showEventsArea: function(area) {
		var store = Ext.StoreManager.lookup('ztixEventsStore'),
			list;

		if(!store.isLoaded()) {
			store.load();	
		}
		

		list = area.down('list');

		list.on({
			select: this.showEventDetail,
			scope: this
		});


		function showDetails(dataview, record) {
			window.open(encodeURI(record.get('link')), '_system');
		}
		
	},

	showEventDetail: function(dataview, eventData) {
		var me = this,
			backBt,
			openLinkBt,
			container = this.getEventsArea(),
			view;

		view = Ext.create('EatSense.view.EventDetail', {
			backButton: true
		});
		container.add(view);
		container.setActiveItem(1);

		// Ext.create('Ext.util.DelayedTask', function () {


	                  
	 //    }, this).delay(200);     

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
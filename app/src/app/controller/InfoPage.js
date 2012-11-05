/**
* Controller for infopages.
* Manages loading, showing and navigation for infopages.
*/
Ext.define('EatSense.controller.InfoPage', {
	extend: 'Ext.app.Controller',
	requires: [],
	config: {
		refs: {
			clubArea: 'clubarea',
			infoPageOverview: 'clubarea infopageoverview',
			showInfoPageButton: 'clubarea clubdashboard button[action=show-infopage]',
			infoPageBackButton: 'clubarea infopageoverview button[action=back]',
			infoPageList: 'clubarea infopageoverview list'

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
			}
		}
	},
	/**
	* Load infopages into infopageStore.
	*/
	loadInfoPages: function() {
		var store = Ext.StoreManager.lookup('infopageStore');

		store.load();

	},

	showInfoPageDetail: function(dataview, record) {

	},
	
	/**
	* Tap event handler for showInfoPagesButton.
	*/
	showInfoPageButtonHandler: function(button) {
		var infopageOverview = this.getInfoPageOverview(),
			clubArea = this.getClubArea(),
			androidCtr = this.getApplication().getController('Android');

		clubArea.setActiveItem(infopageOverview);

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
    * Return to dashboard view.
    */
    backToDashboard: function(button) {
    	var me = this,
			clubArea = this.getClubArea();

		clubArea.switchAnim('right');
		clubArea.setActiveItem(0);
		clubArea.switchAnim('left');
    },
});
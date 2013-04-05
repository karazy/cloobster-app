/**
 *  {@link EatSense.view.components.BackButtonPanel} is a subclass of {@link Ext.Panel}
 *  that can be configured to add a backbutton or homebutton upon creation.
 *
 *  @author Frederik Reifschneider
 */
Ext.define('EatSense.view.components.BackButtonPanel', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.components.SlidenavButton', 'EatSense.view.BackButton', 'EatSense.view.components.HomeButton'],
	xtype: 'backbuttonpanel',	
	config: {
		/**
         * @cfg {Boolean} If true adds a back button to the components titlebar.
         * @accessor
         */
		backButton: false,
		/**
         * @cfg {Boolean} If true adds a home button to the components titlebar.
         * Gets ignored if backButton is true.
         * @accessor
         */
		homeButton: false,
		layout: 'fit'
	},

	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);

		if(config.backButton) {
			this.setBackButton(true);
			this.down('titlebar').add(Ext.create('EatSense.view.BackButton'));	
		}  else if(config.homeButton) {
			this.setHomeButton(true);
			this.down('titlebar').add(Ext.create('EatSense.view.components.HomeButton'));	
		}

	}
});
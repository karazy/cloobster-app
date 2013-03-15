/**
 *  {@link EatSense.view.components.BackButtonPanel} is a subclass of {@link Ext.Panel}
 *  that can be configured to add a backbutton upon creation.
 *
 *  @author Frederik Reifschneider
 */
Ext.define('EatSense.view.components.BackButtonPanel', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.components.SlidenavButton', 'EatSense.view.BackButton'],
	xtype: 'backbuttonpanel',	
	config: {
		/**
         * @cfg {Boolean} If true adds a back button to the components titlebar.
         * @accessor
         */
		backButton: false,
		layout: 'fit'
	},

	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);

		if(config.backButton) {
			this.setBackButton(true);
			this.down('titlebar').add(Ext.create('EatSense.view.BackButton'));	
		};

	}
});
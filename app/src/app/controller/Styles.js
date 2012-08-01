/*
* Controlls which style is used in the app.
* Reacts to status changes in app and sets theme according to configuration in active business.
*/
Ext.define('EatSense.controller.Styles', {
	extend: 'Ext.app.Controller',

	config: {
		//id of active theme
		activeTheme: null
	},

	init: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.on('statusChanged', this.activateTheme, this);
	},

	/**
	* Depending on application status and business user is checked in the corresponding theme ist activated.
	*/
	activateTheme: function(status) {
		var checkInCtr = this.getApplication().getController('CheckIn'),
			theme = checkInCtr.getActiveSpot().get('theme'),
			activeTheme = this.getActiveTheme();

		if(status == Karazy.constants.CHECKEDIN) {
			console.log('activate theme ' + theme);
			this.changeTheme(theme);	
		} else if (status == Karazy.constants.COMPLETE) {
			this.changeTheme('default');	
		}
	},

	/*
	* Changes the theme.
	* @param themeId
	*	Code of theme to use.
	*/
	changeTheme: function(themeId) {
        var stylesheets = this.getStylesheets(),
            targetTheme = themeId,
            sheet,
            interval;

        //TODO do we need a loading mask
        // main.setMasked({
        //     xtype: 'loadmask',
        //     message: 'Theming',
        //     indicator: false
        // });
		
		this.setActiveTheme(themeId);
		//activate theme by removing disbaled attribute
        stylesheets[targetTheme].removeAttribute('disabled');

        interval = setInterval(function() {
            if (stylesheets[targetTheme].sheet
                && stylesheets[targetTheme].sheet.cssRules.length) {
                clearInterval(interval);
            	//disable other stylsheets
                for (sheet in stylesheets) {
                    if (sheet != targetTheme) {
                        stylesheets[sheet].setAttribute('disabled', true);
                    }
                }
                // main.unmask();
            }
        }, 100);
    },

    /**
    * Returns all available stylesheets.
    */
    getStylesheets: function() {
        var stylesheets = {}, 
        	store;

        if (!this.stylesheets) {
        	//store contains all available stylesheets
            store = Ext.StoreManager.lookup('styleStore');
            for (var i = store.data.items.length - 1; i >= 0; i--){
                theme = store.data.items[i].data;
                //traverse dom and retrieve stylsheets named in store
                stylesheets[theme['id']] = document.getElementById(theme['id'])
            };
            this.stylesheets = stylesheets;
        }
        return this.stylesheets;
    }
});
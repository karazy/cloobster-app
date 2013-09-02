Ext.define('EatSense.ux.HTMLPanel', {
    extend: 'Ext.Panel',
    xtype: 'htmlpanel',

    // We are using Ext.Ajax, so we should require it
    requires: ['Ext.Ajax'],

    config: {
        listeners: {
            activate: 'onActivate',
            painted: 'onActivate'
        },

        // Create a new configuration called `url` so we can specify the URL
        url: null
    },

    onActivate: function(me, container) {
        if(!this.getUrl()) {
            return;
        }
        
        Ext.Ajax.request({
            // we should use the getter for our new `url` config
            url: this.getUrl(),
            method: "GET",
            success: function(response, request) {
                // We should use the setter for the HTML config for this
                me.setHtml(response.responseText);
            },
            failure: function(response, request) {
                me.setHtml("failed -- response: " + response.responseText);
            }
        });
    }
});
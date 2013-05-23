/**
 * @author Frederik Reifschneider
 *
 * This class prevents sencha touch 2 from generating custom ids.
 *
 */
Ext.define('Ext.data.identifier.None', {
    alias: 'data.identifier.none',
    
    statics: {
        // AUTO_ID: 1
    },

    config: {
        // prefix: 'ext-record-'
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    generate: function(record) {
        return "";
    }
});
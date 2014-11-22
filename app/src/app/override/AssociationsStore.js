
Ext.define('EatSense.override.AssociationsStore', {
    extend: 'Ext.data.Store',
    xtype: 'assocstore',  

    config: {
    	/**
    	* @cfg
    	* 
    	*/
    	associations: null
    },

    /**
     * @override
     * @private
     * Called internally when a Proxy has completed a load request.
     */
    onProxyLoad: function(operation) {
        var me = this,
            records = operation.getRecords(),
            resultSet = operation.getResultSet(),
            successful = operation.wasSuccessful(),
            associations;

        if (resultSet) {
            me.setTotalCount(resultSet.getTotal());
        }        

        //Start custom logic

        if(me.getAssocations()) {
        	console.log('EatSense.override.AssociationsStore.onProxyLoad: Processing associations ' + me.getAssocations());
        	if(!Ext.isArray(me.getAssocations())) {
        		associations = [me.getAssocations()];
        	} else {
        		associations = me.getAssocations();
        	}

        	Ext.Array.each(records, function(rec, index) {
        		Ext.Array.each(associations, function(a, index) {
        			if(rec.raw[a]) {
        				rec.data[a] = rec.raw[a];
        			}
        		});        		
        	});

        }

        //End custom logic

        if (successful) {
            this.fireAction('datarefresh', [this, this.data, operation], 'doDataRefresh');
        }

        me.loaded = true;
        me.loading = false;


        me.fireEvent('load', this, records, successful, operation);

        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.getCallback(), operation.getScope() || me, [records, operation, successful]);
    },

});
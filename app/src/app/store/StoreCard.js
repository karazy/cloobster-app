Ext.define('EatSense.store.StoreCard', {
    extend  : 'Ext.data.Store',    
    requires: ['EatSense.model.StoreCard'],
    config : {
    	storeId: 'storeCardStore',
    	model   : 'EatSense.model.StoreCard'    	
    }
});
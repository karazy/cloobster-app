Ext.define('EatSense.store.Spot', {
    extend  : 'Ext.data.Store',    
    requires: ['EatSense.model.Spot'],    
    config : {
    	storeId: 'spotStore',
    	model   : 'EatSense.model.Spot',
    	syncRemovedRecords: false,
    	proxy : {
			type : 'rest',
			url : '/c/businesses/{pathId}/spots',
			enablePagingParams: false,
			reader : {
				type : 'json'
			}
		}
    }
});
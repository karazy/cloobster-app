Ext.define('EatSense.override.CustomRestProxy', {
	override: 'Ext.data.proxy.Rest',
	  buildUrl: function(request) {	
	        var  me = this, 
	        	_serviceUrl = appConfig.serviceUrl, 
	        	url = me.getUrl(request),
	        	params = request.getParams() || {},
	        	defaultHeaders = Ext.Ajax.getDefaultHeaders() || {};

	        if(params.pathId) {
	        	if(url.match(/(.*){pathId}(.*)/)) {
	        		var replacer = '$1'+params.pathId+'$2';
	        		url = url.replace(/(.*){pathId}(.*)/, replacer);
	        		delete params.pathId;
	        	}	        	
	        } else if(defaultHeaders.pathId) {
	        	if(url.match(/(.*){pathId}(.*)/)) {
	        		var replacer = '$1'+defaultHeaders.pathId+'$2';
	        		url = url.replace(/(.*){pathId}(.*)/, replacer);
	        	}	
	        }

	        if(params.checkInId) {
	        	if(url.match(/(.*){checkInId}(.*)/)) {
	        		var replacer = '$1'+params.checkInId+'$2';
	        		url = url.replace(/(.*){checkInId}(.*)/, replacer);
	        	}	        	
	        } else if(defaultHeaders.checkInId) {
	        	if(url.match(/(.*){checkInId}(.*)/)) {
	        		var replacer = '$1'+defaultHeaders.checkInId+'$2';
	        		url = url.replace(/(.*){checkInId}(.*)/, replacer);
	        	}	
	        }

	        if(params.businessId) {
	        	if(url.match(/(.*){businessId}(.*)/)) {
	        		var replacer = '$1'+params.businessId+'$2';
	        		url = url.replace(/(.*){businessId}(.*)/, replacer);
	        	}	        	
	        } else if(defaultHeaders.businessId) {
	        	if(url.match(/(.*){businessId}(.*)/)) {
	        		var replacer = '$1'+defaultHeaders.businessId+'$2';
	        		url = url.replace(/(.*){businessId}(.*)/, replacer);
	        	}	
	        }
	        	
	        request.setUrl(_serviceUrl + url);

	        // console.log('EatSense.override.CustomRestProxy.buildUrl:' + _serviceUrl + url);

	        return me.callParent([request]);
	    },
	    /**
	     * Sets up an exception on the operation
	     * @private
	     * @param {Ext.data.Operation} operation The operation
	     * @param {Object} response The response
	     */
	    setException: function(operation, response) {
	        if (Ext.isObject(response)) {
	            operation.setException({
	                status: response.status,
	                statusText: response.statusText,
	                responseText: response.responseText
	            });
	        }
	    },   	

	    doRequest: function(operation, callback, scope) {
	    	var me = this,
            	writer  = me.getWriter(),
            	request = me.buildRequest(operation);

	        request.setConfig({
	            headers  : me.getHeaders(),
	            timeout  : 90000, //me.getTimeout()
	            method   : me.getMethod(request),
	            callback : me.createRequestCallback(request, operation, callback, scope),
	            scope    : me,
	            proxy    : me
	        });

	        if (operation.getWithCredentials() || me.getWithCredentials()) {
	            request.setWithCredentials(true);
	            request.setUsername(me.getUsername());
	            request.setPassword(me.getPassword());
	        }

	        // We now always have the writer prepare the request
	        request = writer.write(request);

	        if(request.getMethod().toUpperCase() === 'DELETE') {
		        	//prevent Sencha from sending payload to avoid BAD REQUEST on appengine
		        	 delete request._jsonData;	        	
		        }

	        Ext.Ajax.request(request.getCurrentConfig());

	        return request;
	    }
});
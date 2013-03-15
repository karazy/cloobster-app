/**
*	This controller handles push messages send from the server
*	and fires events when they arrive. Any component interested in those events
* 	can listen.
* 	It also requests tokens from the server and initiates open channel calls.
*/
Ext.define('EatSense.controller.Message', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.util.Channel'],
	config: {
		//id used for channel creation		
		channelId: null
	},
	launch: function() {		
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');		

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {

			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				me.closeChannel();	
			}
		}, this);

		checkInCtr.on('spotswitched', function(newSpot, newCheckIn) {
			me.closeChannel();
			me.openChannel(newCheckIn.get('userId'));
		});
	},
	/**
	*	Called after receiving a channel message.
	*	
	*	@param rawMessages	
	*		The raw string message(s) which will be parsed as JSON.
	*		This could be a single object or an array.
	*/
	processMessages: function(rawMessages) {
		var 	me = this,
				message = Ext.JSON.decode(rawMessages, true);

		if(Ext.isArray(message)) {
				for(index = 0; index < message.length; index++) {
				if(message[index]) {
					this.broadcastMessage(message[index]);
				}	
			}
		}
		else if(message) {
			this.broadcastMessage(message);
		}				
	},
	/**
	*	Fires events to notify listeners about a new message.
	*	Naming schmeme: eatSense.messageType
	*   where message type can be something like spot, order ...
	*
	*	The fired event submits two additional parameters
	*	1. action type (e. g. update, new , delete)
	*	2. content - the data
	*   
	*	@param message	
	*		A message consists of 3 fields
	*			type	- a type like spot
	*			action	- an action like update, new ... 
	*			content - the data
	*/
	broadcastMessage: function(message) {
		var 	me = this,
				evtPrefix = 'eatSense.',
				model = message.content;

		if(!message) {
			console.log('no message send');
			return;
		}
		if(message.type == 'channel') {
			console.log('received service message ' + message.action);
			if(message.action == 'connected') {
				appChannel.connectedReceived();
			}
		}
		else {
			console.log('broadcast message type ' + message.type + ', action ' + message.action);

			//fire event based on the message
			me.fireEvent(evtPrefix+message.type.toLowerCase(), message.action, message.content);
		}
	},
	/**
	* Requests a new token from server and executes the given callback with new token as parameter.
	* @param successCallback
	*	callback function to invoke on success
	* @param connectionCallback
	*	
	*/
	requestNewToken: function(successCallback, connectionCallback) {	
		var me = this,
			timestamp = new Date().getTime();
			
		if(!this.getChannelId()) {
			console.log('no channel id is set');
			return;
		};

		console.log('request new token. clientId: ' + this.getChannelId());

		Ext.Ajax.request({
		    url: appConfig.serviceUrl+'/c/checkins/'+this.getChannelId()+'/tokens',		    
		    method: 'POST',
		    //submit a timestamp to prevent iOS6 from caching the POST request
		    jsonData: timestamp,
		    success: function(response){
		       	token = response.responseText;
		       	successCallback(token);
		       	connectionCallback(response.status);
		    },
		    failure: function(response, opts) {
		    	me.getApplication().handleServerError({
					'error': response, 
					'forceLogout': false, 
					'hideMessage':true, 
					'message': i10n.translate('channelTokenError')
				});
				connectionCallback(response.status);
		    }
		});
	},
	/**
	* 	Let the server know we are still there.
	*/
	checkOnline: function(disconnectCallback, connectedCallback) {
		
		console.log('checkOnline: clientId ' + this.getChannelId());
		Ext.Ajax.request({
		    url: appConfig.serviceUrl+'/c/checkins/channels',		    
		    method: 'GET',
		    params: {
		    	'c' :  this.getChannelId()
		    },
		    success: function(response) {
		       	console.log('online check request result: ' + response.responseText);
		       	if(response.responseText == 'DISCONNECTED') {
		       		disconnectCallback();
		       	}
		       	else if(response.responseText == 'CONNECTED') {
		       		if(connectedCallback) {
		       			connectedCallback();
		       		}
		       	}
		    }, 
		    failure: function(response) {
		    	if(appChannel.connectionStatus != 'CONNECTION_LOST') {
		    		appChannel.setStatusHelper('CONNECTION_LOST');
		    		appChannel.stopOnlinePing();
		    		appChannel.clearMessageTimeout();
		    		appChannel.startOnlineCheck();
		    		me.handleStatus({
		    			'status' : appChannel.connectionStatus, 
		    			'prevStatus': appChannel.previousStatus
		    		});
		    	}
		    	console.log('online check request failed with code: ' + response.status);
		    }
		});
	},
	/**
	* 	Requests a token and
	*	opens a channel for server side push messages.
	*	@param id
	*		Id to open channel for
	*/
	openChannel: function(id) {
		var		me = this;

		//DEBUG remember to disable before building. Used to prevent 
		//spamming of console with messages
		// if(Ext.os.deviceType.toLowerCase() == 'desktop') {
		// 	return;
		// }

		this.setChannelId(id);

		appChannel.setup({
			messageHandler: me.processMessages,
			requestTokenHandler: me.requestNewToken,
			statusHandler: me.handleStatus,
			checkOnlineHandler: me.checkOnline,
			executionScope: me
		});

	},
	/**
	* Close the active channel.
	*/
	closeChannel: function() {
		appChannel.closeChannel();
	},
	/**
	*	Called when the connection status changes.
	*
	*/
	handleStatus: function(opts) {
		var connectionStatus = opts.status,
			previousStatus = opts.prevStatus,
			reconnectIteration = opts.reconnectIteration;

		// Log status change.
		console.log('Connection status changed to '+connectionStatus+' from '+previousStatus+'. ('+reconnectIteration+' call)');
	}
});
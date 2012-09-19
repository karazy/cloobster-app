Ext.define('EatSense.model.Order', {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'id',
		fields : [ {
			name : 'id',
			type : 'string'
		}, {
			name : 'status',
			type : 'string'
		}, {
			name : 'amount',
			type : 'number', 
			defaultValue: 1
		}, {
			name : 'comment',
			type : 'string'
		}, {
			name : 'orderTime',
			type : 'date',
			dateFormat: 'time'
		},
		{
			name: 'productName'
		},
		{
			name: 'productPrice'
		},		
		{
			name: 'productId'
		},
		{
			name: 'productLongDesc'
		},
		{
			name: 'productShortDesc'
		},
		{//dont change, gets set automatically
			name: 'price_calculated',
			type: 'number',
			persist: false
		}],
		associations: [{
            type: 'hasMany',
            model: 'EatSense.model.Choice',
            primaryKey: 'id',
            name: 'choices',
            autoLoad: true,
            associationKey: 'choices', // read child data from child_groups
            store: {
            	sorters: [
            	{
            		sorterFn: function(record1, record2){
            			// console.log('sort choices id1: %s parent1: %s and id2: %s parent2: %s', record1.get('id'), record1.get('parent'), record2.get('id'), record2.get('parent'));
            			var parent1 = record1.get('parent'),
            				parent2 = record1.get('parent');
            			if(parent1) {
            				if(parent1 == record2.get('id')) {
            					return 1;
            				}
            			}

            			if(parent2) {
            				if(parent2 == record1.get('id')) {
            					return 1;
            				}
            			}

            			return 0;
            		}
            	}]
            }
	    }],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
			url : '/c/businesses/{pathId}/orders',
			reader: {
				type: 'json'
		   	}
	 	},
	 	// current state of this order. used for store and restore
	 	state: null
	},
	/**
	* Static methods.
	* Can be called like EatSense.model.Order.createOrder()
	*/
	statics: {
		/**
		* Creates an order based on a product.
		* The order is completely independent from the original product.
		*/
		createOrder: function(product) {
			var newOrder = Ext.create('EatSense.model.Order'),
				tmpChoice;

			newOrder.set('productName', product.get('name'));
			newOrder.set('productId', product.get('id'));
			newOrder.set('productPrice', product.get('price'));
			newOrder.set('productShortDesc', product.get('shortDesc'));
			newOrder.set('productLongDesc', product.get('longDesc'));

			product.choices().each(function(choice) {
				//create phantom copy
				tmpChoice = choice.copy();
				tmpChoice.options().each(function(option) {
					var idProperty = option.getIdProperty();

	       			delete option.raw[idProperty];
	        		delete option.data[idProperty];

	        		option.phantom = true;
				});
				
				newOrder.choices().add(tmpChoice);
			});

			return newOrder;
		}
	},
	/**
	 * Calculates total cost of this order including choices and amount, returns it and
	 * stores it in priceCalculated.
	 * 
	 */
	calculate: function() {
		var _total = this.get('productPrice'), _amount = this.get('amount');
		this.choices().each(function(choice, index) {
			_total += choice.calculate();
		});

		// _total = appHelper.roundPrice(_total*_amount);
		_total = _total*_amount;
		this.set('price_calculated', _total);
		
		return (this.get('status') == appConstants.Order.CANCELED) ? 0 : _total;
	},
	/**
	*	Saves the state of this order.
	*	The state can be restored after changes.
	*	An existing state will be overriden.
	*/
	saveState: function() {
		if(this.getState()) {
			console.log('override existing order state');
		}

		this.setState(this.getRawJsonData());
	},
	/**
	*	If a state exists it will be restored.
	*/
	restoreState: function() {
		if(this.getState()) {
			this.setRawJsonData(this.getState());
			this.setState(null);
		}
	},
	/**
	*	Returns a deep raw json representation of this object.
	*
	*/	
	getRawJsonData: function() {
		var rawJson = {},
			choicesCount = this.choices().getCount(),
			index = 0;
		
		rawJson.id = (this.phantom === true) ? this.get('genuineId') : this.get('id');
		rawJson.status = this.get('status');
		rawJson.amount = this.get('amount');
		rawJson.comment = this.get('comment');
		rawJson.productName = this.get('productName');
		rawJson.productId = this.get('productId');
		rawJson.productPrice = this.get('productPrice');
		rawJson.productShortDesc = this.get('productShortDesc');
		rawJson.productLongDesc = this.get('productLongDesc');
		rawJson.orderTime = (this.get('orderTime')) ? this.get('orderTime').getTime() : null;		

		rawJson.choices = new Array(this.choices().data.length);
		
		for( ; index < choicesCount; index++) {
			rawJson.choices[index] = this.choices().getAt(index).getRawJsonData();
		}

		console.log('Order id: ' + this.get('id') +' genuineId: '+this.get('genuineId')+ ' getRawJsonData id: ' + rawJson.id);
		return rawJson;
	},
	/**
	*	Sets the data of this object based on a raw json object.
	*	@param rawData
	*		data to set
	*	@param shallow
	*		don't set nested data
	*/	
	setRawJsonData: function(rawData, shallow) {
		var index = 0,
			choicesCount = rawData.choices.length,
			choice;

		if(!rawData) {
			return false;
		}

		if(!shallow) {
			for( ; index < choicesCount; index++) {
				//check if an option with given id exists
				choice = this.choices().getById(rawData.choices[index].id);
				if(choice) {
					console.log('option with id ' + rawData.choices[index].id);
					if(!choice.setRawJsonData(rawData.choices[index])) {
						return false;
					}
				} 
			}
		};


		this.set('id', rawData.id);
		this.set('status', rawData.status);
		this.set('amount', rawData.amount);
		this.set('comment', rawData.comment);
		this.set('orderTime', rawData.orderTime);
		this.set('productName', rawData.productName);
		this.set('productId', rawData.productId);
		this.set('productPrice', rawData.productPrice);
		this.set('productShortDesc', rawData.productShortDesc);
		this.set('productLongDesc', rawData.productLongDesc);

		return true;	
	},

});
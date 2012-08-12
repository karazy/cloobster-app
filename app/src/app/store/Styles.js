Ext.define('EatSense.store.Styles', {
	extend: 'Ext.data.Store',
	config: {
		storeId: 'styleStore',
		fields: [ 'id', 'name'],
		data:  [
		{
			id: 'default',
			name: 'Default cloobster theme'
		},
		{
			id: 'red',
			name: 'A red and elegant theme'
		},
		{
			id: 'green',
			name: 'A green and friendly theme'
		},
		{
			id: 'blue',
			name: 'A blue and airy theme'
		},
		{
			id: 'orange',
			name: 'A green and cosy theme'
		}]
	}
});
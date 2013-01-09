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
			id: 'blue-gold',
			name: 'A noble blue and golden theme'
		},
		{
			id: 'black-pink',
			name: 'A funky black and pink theme'
		}]
	}
});
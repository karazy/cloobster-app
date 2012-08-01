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
			id: 'dark',
			name: 'A dark and more elegant theme'
		},
		{
			id: 'light',
			name: 'A light and friendly theme'
		}]
	}
});
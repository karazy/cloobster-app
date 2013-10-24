Ext.define('EatSense.store.ZtixCoupon', {
	extend: 'Ext.data.Store',
	requires: ['EatSense.model.ZtixEvent'],
	config: {
		storeId: 'ztixCouponsStore',
		model: 'EatSense.model.ZtixEvent',
		syncRemovedRecords: false,
		currentPaginationDate: null
	}
});
/**
* Represents the configuration for a dashboard item.
* Displayed on the {@link EatSense.view.ClubDashboard}
*/
Ext.define('EatSense.model.DashboardItem', {
	extend: 'Ext.data.Model',
	requires: [],
	config: {
		fields: [
			{
				name: 'id'
			},
			{
				name: 'type',
				type: 'string'
			}
			//also contains
			//raw.entityIds
		]
	},
	proxy: {
		type: 'rest',
		url: '/c/businesses/{pathId}/dashboarditems',
		enablePagingParams: false,
	}
});
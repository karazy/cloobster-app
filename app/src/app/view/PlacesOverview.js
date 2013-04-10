Ext.define('EatSense.view.PlacesOverview', {
	extend: 'Ext.Panel',
	xtype: 'placesoverview',
	requires: [],
	config: {
		layout: 'card',
		activeItem: 0,
		items: [
			{
				xtype: 'history'				
			},
			{
				xtype: 'historydetail'
			}
		]
	},
	/**
	 * Switch to given item.
	 * 
	 * @param item
	 *	The item the view should switch to.
	 */
	switchTo: function(item, dir) {
		this.setActiveItem(item);	
	}
});
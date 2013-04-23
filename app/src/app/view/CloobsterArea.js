/**
* Acts as Container for main views when user is not checked in.
*/
Ext.define('EatSense.view.CloobsterArea', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.Dashboard'],
	xtype: 'cloobsterarea',
	config: {
		layout: {
			type: 'card',
			//override default tabpanel animation setting
			animation : null
		},
		activeItem: 0,
		items: [
			{
				xtype: 'dashboard'
			},
			{
				xtype: 'checkinconfirmation'
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
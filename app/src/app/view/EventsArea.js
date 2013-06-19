/**
* Acts as Container for ClubDashboard, Feedback, Requests etc.
* which are all found in the first tab of Lounge view.
* ClubDashboard is the first visible item after checkin.
*/
Ext.define('EatSense.view.EventsArea', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.Events'],
	xtype: 'eventsarea',
	config: {
		// iconCls : 'home',
		title: i10n.translate('eventsarea.title'),
		iconMask: true,
		layout: {
			type: 'card',
			//override default tabpanel animation setting
			animation : null
		},
		activeItem: 0,
		items: [
			{
				xtype: 'events'
			}
		]
	},
	/**
	 * Switch to given item.
	 * 
	 * @param item
	 *	The item the view should switch to.
	 * @param dir
	 *  animation. left or right 
	 */
	switchTo: function(item, dir) {
		this.setActiveItem(item);	
		// this.animateActiveItem(item, {type: 'slide', direction: dir});
	}
	
});
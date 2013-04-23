/**
* Wraps  {@link EatSense.view.FeedbackForm} in a card layout.
*/
Ext.define('EatSense.view.FeedbackContainer', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.FeedbackForm'],
	xtype: 'feedbackcontainer',
	config: {
		layout: {
			type: 'card'
		},
		activeItem: 0,
		items: [
			{
				xtype: 'feedbackform',
				homeButton: true
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
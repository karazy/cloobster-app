/**
* Generic slide naviation container. Simply hosts a card panel.
* Should be used in {@link EatSense.view.Lounge}.
*/
Ext.define('EatSense.view.components.SlideNavContainer', {
	extend: 'Ext.Panel',
	xtype: 'slidenavcontainer',
	requires: [
		
	],
	config: {
		activeItem: 0,
		
		/**
		* @cfg {String}
		* The action associated with this menu entry.
		* @accessor
		*/
		action: '',

		layout: {
			type: 'card'
		},
		
		items: [

		]
	},

	/**
	 * Switch to given item.
	 * 
	 * @param item
	 *	The item the view should switch to.
	 * @param dir (optional)
	 *  animation. left or right 
	 *	ATTENTION! animations can reduce Performance
	 */
	switchTo: function(item, dir) {
		if(!dir) {
			this.setActiveItem(item);		
		} else {
			this.animateActiveItem(item, {type: 'slide', direction: dir});
		}
	}
});
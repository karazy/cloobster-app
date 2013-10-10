/**
* Generic menu container. Simply hosts a card panel.
*
*/
Ext.define('EatSense.view.components.MenuContainer', {
	extend: 'Ext.Panel',
	xtype: 'menucontainer',
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
	}
});
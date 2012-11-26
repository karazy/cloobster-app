/**
* This component represents a 5 - Star Input used in @see EatSense.view.FeedbackQuest.
* Everytime an star is tapped this component throws a starvaluechanged event.
*/
Ext.define('EatSense.view.StarsInput', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button'],
	xtype: 'starsinput',

	 /**
     * @event starvaluechanged
     * Fires whenever a star is tapped.
     * @param {Ext.Button} this The item added to the Container.
     * @param {Number} A number indicating the rating (value) of the star.
     */

	config: {
		layout: {
			type: 'hbox',
			align: 'center',
			pack: 'center'
		},
		defaults: {
			xtype: 'button',
			baseCls: 'star-button'
		},
		items: [
			{
				rating: '0'
			},
			{
				rating: '1'
			},
			{
				rating: '2'
			},
			{
				rating: '3'
			},
			{
				rating: '4'
			}
		]
	},

	initialize: function(config) {
		var me = this;

		this.on({
				delegate: 'button',
				'tap': function(button) {
					me.letTheStarsShine(button.config.rating);
					me.fireEvent('starvaluechanged', button, button.config.rating);
				}
		});
	},

	/**
	* @private
	* Swaps css class of star buttons depending on the rating.
	* All stars with a rating value equal or less than the given rating are marked blue, otherwise they appear gray.
	* @param rating
	*	The rating to set this component to.
	*/
	letTheStarsShine: function(rating) {
		var buttons = this.query('button');

		// console.log('EatSense.view.StarsInput.letTheStarsShine > star shine value=' + rating);

		Ext.Array.each(buttons, function(button) {
			if(button.config.rating <= rating) {
				button.setBaseCls('star-button-shining');
			} else {
				button.setBaseCls('star-button');
			}
		});
	}
});
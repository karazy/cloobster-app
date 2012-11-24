Ext.define('EatSense.view.StarsInput', {
	extend: 'Ext.Panel',
	requires: ['Ext.Button'],
	xtype: 'starsinput',
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
			},
			{
				rating: '5'
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
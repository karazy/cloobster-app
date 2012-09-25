Ext.define('EatSense.view.Menu', {
	extend : 'Ext.Panel',
	xtype : 'menutab',
	config : {
		layout: 'fit',
		iconCls : 'menu',
		title: i10n.translate('menuTab'),
		iconMask : true,
		itemId : 'menutab',
		items : [ 
		{
			xtype: 'panel',
			itemId: 'menuCardPanel',
			layout: {
				type: 'card'
			},
			activeItem : 0,
			items: [
			        {
			        	xtype: 'menuoverview',
			        	layout: 'fit'
			        },
			        {
			        	xtype: 'productoverview',
			        	layout: 'fit'
			        },
			        {
			        	xtype: 'carttab',
			        	layout: 'fit'
			        }
			]
			
		}
		],
	},
	/**
	 * Switch to a view with the given direction for slide animation.
	 * @param view
	 *		view to switch to
	 * @param direction
	 * 			left or right
	 */
	switchMenuview : function(view, direction){
		var cardpanel = this.getComponent('menuCardPanel');

		cardpanel.getLayout().setAnimation({
			 type: 'slide',
	         direction: direction
		});		
		cardpanel.setActiveItem(view);		
	},
	/**
	 * Shows or hides the product cart button.
	 * @param show
	 * 		true = show | false = hide
	 */
	showCartButtons: function(show) {
		this.down('menuoverview button[action=show-cart]').setHidden(!show);
		this.down('productoverview button[action=show-cart]').setHidden(!show);
	}
});
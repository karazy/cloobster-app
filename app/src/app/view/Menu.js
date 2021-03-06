Ext.define('EatSense.view.Menu', {
	extend : 'Ext.Panel',
	xtype : 'menutab',
	config : {
		layout: {
				type: 'card'
		},
		iconCls : 'menu',
		activeItem : 0,
		title: i10n.translate('menuTab'),
		iconMask : true,
		itemId : 'menutab',
		items : [ 
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
	        },
	        {
	        	xtype: 'productdetail'
	        },
	        {
	        	xtype: 'orderdetail'
	        }
		]
	},
	/**
	 * Switch to a view with the given direction for slide animation.
	 * @param view
	 *		view to switch to
	 * @param direction
	 * 			left or right
	 */
	switchMenuview : function(view, direction){	
		this.setActiveItem(view);		
	},
	switchTo: function(view, direction) {
		this.switchMenuview(view, direction);
	},
	/**
	 * @Deprecated
	 * Shows or hides the product cart button.
	 * @param show
	 * 		true = show | false = hide
	 */
	showCartButtons: function(show) {
		alert('showCartButtons');
		console.error('EatSense.view.Menu.showCartButtons > DEPRECATED CALL');
		this.down('menuoverview button[action=show-cart]').setHidden(!show);
		this.down('productoverview button[action=show-cart]').setHidden(!show);
	}
});
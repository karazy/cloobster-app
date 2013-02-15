/**
*
*/
Ext.define('EatSense.view.Lounge', {
	extend: 'EatSense.ux.slidenavigation.collapsible.View',
	requires : [ 
		'EatSense.view.MyOrders', 
		'EatSense.view.Menu', 
		'EatSense.view.MenuOverview', 
		'EatSense.view.SettingsTab', 
		'EatSense.view.RequestsTab',
		'EatSense.view.ClubArea',
		'EatSense.ux.slidenavigation.collapsible.View'
	],
	xtype : 'lounge',
	config : {
		 /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */       
        slideSelector: 'x-slidenavigation-bezel',
        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 0,
        slideDuration: 0,
        container: {
        	items: [ 
        		//order matters, put bezel first to make button stay on top!
        		{
        			xtype: 'container',
        			cls: 'x-slidenavigation-bezel',
        			id: 'slidenavigationbezel',
        			left: 0,
        			top: 0,
        			bottom: 0,
        			width: 15,
        			style: 'background-color: transparent;',
        			items: [
	        			{	
		        			//the button to reveal the slide navigation
		        			xtype: 'fixedbutton',
		        			iconCls: 'x-slidenavigation-toggle-mask',
		        			cls: 'x-slidenavigation-toggle',
		        			action: 'toggle-navigation',
		        			floatingCls: 'dummy-cls',
		        			bottom: 5,
		        			left: 0,
		        			tapMaskFactor: 3
	        			}  
        			]
        		},
				// {
				// 	xtype: 'panel',
				// 	layout: {
				// 		type: 'fit'
				// 	},
				// 	height: 5,
				// 	docked: 'bottom',
				// 	style: 'background-color: orange'
				// }         	        		
        	]
        },
		items : [	
			{
				xtype: 'clubarea',
				title: i10n.translate('slidenav.button.home'),
				leaf: true,
				action: 'show-clubdashboard',
				iconCls: 'home-icon'
			},		
			{
				iconCls: 'offer-icon',
				xtype: 'menutab',
				title: i10n.translate('menuTab'),
				leaf: true,
				preCreate: true,
				action: 'show-menu'
			},
			{
				xtype: 'infopageoverview',
				title: i10n.translate('clubdashboard.button.infopage'),
				leaf: true,
				preCreate: true,
				action: 'show-infopage',
				iconCls: 'slidenav-info-icon'
			},
			{
				title: i10n.translate('requestsTitle'),
				xtype: 'requeststab',
				iconCls: 'request-icon',
				leaf: true,
				preCreate: true,
				hideOnBasic: true,
				action: 'show-requests',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},
			{
				xtype: 'feedbackform',
				iconCls: 'feedback-icon',
				itemId: 'loungeFeedback',
				title: i10n.translate('clubdashboard.button.feedback'),
				leaf: true,
				backButton: false,
				hideOnBasic: true,
				preCreate: true,
				action: 'show-feedback',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},
			{
				xtype: 'settingstab',
				title: i10n.translate('settingsButton'),
				leaf: true,
				action: 'show-settings',
				iconCls: 'user-icon',
			},
						{	
				xtype: 'myorderstab',
				iconCls: 'exit-icon',
				title: i10n.translate('myOrdersTabLeaveBt'),
				leaf: true,
				preCreate: true,
				action: 'show-myorders'
			}		
		]
	},
	/**
	 * Switch the tab.
	 * 
	 */
	switchTab : function(view) {
		this.setActiveItem(view);
	}
});
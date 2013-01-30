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
        slideSelector: 'slidenavigation-button',    
        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 0,
        slideDuration: 0,
        // container: {
        // 	items: [
        // 		{
        // 			xtype: 'titlebar',
        // 			title: i10n.translate('slidenav.title')
        // 		}
        // 	]
        // },
		items : [
		// {
		// 	title: 'Group 1',
		// 	items: [	
			{
				xtype: 'clubarea',
				title: i10n.translate('slidenav.button.home'),
				leaf: true
			},		
			{
				iconCls: 'menu-icon',
				xtype: 'menutab',
				title: i10n.translate('menuTab'),
				leaf: true,
				preCreate: true
			},
			{
				xtype: 'infopageoverview',
				title: i10n.translate('infopage.overview.title'),
				leaf: true,
				preCreate: true
			},
			{
				title: i10n.translate('requestsTitle'),
				xtype: 'requeststab',
				iconCls: 'request-icon',
				leaf: true,
				preCreate: true
			},
			{	
				xtype: 'myorderstab',
				iconCls: 'exit-icon',
				title: i10n.translate('myOrdersTabLeaveBt'),
				leaf: true,
				preCreate: true
			},
			{
				xtype: 'feedbackform',
				iconCls: 'feedback-icon',
				itemId: 'loungeFeedback',
				title: i10n.translate('clubdashboard.button.feedback'),
				leaf: true,
				backButton: false,
				hideOnBasic: true,
				preCreate: true
			},
			{
				xtype: 'settingstab',
				title: i10n.translate('settingsButton'),
				leaf: true
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
/**
* The main view of the application. Called Lounge for historical reasons.
* Consist of a {@link EatSense.ux.slidenavigation.collapsible.View} Sidenavigation.
* Each navigation item is itself a card layout or a function! 
* The view architecture basically looks like this:
*
*	#slide nav#    Card Layout
*	#menu item# -> -------------
*	#menu item#    | Panel 1-n |
*	#menu item#    |           |
*	#menu item#    |           |
*	#menu item#    |           |
*	#menu item#    |           |
*	#function #    -------------
*
*
*
*/
Ext.define('EatSense.view.Lounge', {
	extend: 'EatSense.ux.slidenavigation.collapsible.View',
	requires : [ 
		'EatSense.view.CloobsterArea',
		'EatSense.view.PlacesOverview',
		'EatSense.view.MyOrders', 
		'EatSense.view.Menu', 
		'EatSense.view.MenuOverview', 
		'EatSense.view.SettingsTab', 
		'EatSense.view.RequestsTab',
		'EatSense.view.ClubArea',
		'EatSense.ux.slidenavigation.collapsible.View',
		'EatSense.view.FeedbackContainer',
		'EatSense.view.ContactInfo'
	],
	xtype : 'lounge',
	config : {
		fullscreen: true,
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
        bounceWhenInactive: false,
        container: {
        	items: [ 
        		//order matters, put bezel first to make button stay on top!
        		{
        			xtype: 'container',
        			cls: 'x-slidenavigation-bezel',
        			id: 'slidenavigationbezel',        			
        			left: 0,
        			top: 40,
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
		        			bottom: 8,
		        			left: 0,
		        			tapMaskFactor: 3
	        			}  
        			]
        		}        	        		
        	]
        },
		items : [
			{
				xtype: 'cloobsterarea',
				title: i10n.translate('slidenav.button.dashboard'),
				leaf: true,
				iconCls: 'places-icon',
				action: 'show-dashboard',
				viewState: 'cloobster'
			},
			{
				xtype: 'placesoverview',
				title: i10n.translate('dashboard.button.history'),
				leaf: true,
				action: 'show-places',
				iconCls: 'time-icon',
				viewState: 'cloobster',
				accountRequired: true
			},
			{
				xtype: 'clubarea',
				title: i10n.translate('slidenav.button.home'),
				leaf: true,
				preCreate: true,
				action: 'show-clubdashboard',
				iconCls: 'home-icon',
				viewState: 'club'
			},
			{
				iconCls: 'offer-icon',
				xtype: 'menutab',
				title: i10n.translate('menuTab'),
				leaf: true,
				action: 'show-menu',
				viewState: 'club'
			},			
			{
				xtype: 'infopageoverview',
				title: i10n.translate('infopage.overview.title'),
				leaf: true,
				action: 'show-infopage',
				iconCls: 'slidenav-info-icon',
				viewState: 'club'
			},
			{
				xtype: 'feedbackcontainer',
				iconCls: 'feedback-icon',
				itemId: 'loungeFeedback',
				title: i10n.translate('clubdashboard.button.feedback'),
				leaf: true,
				hideOnBasic: true,
				action: 'show-feedback',
				viewState: 'club',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},
			{
				title: i10n.translate('requestsTitle'),
				xtype: 'requeststab',
				iconCls: 'request-icon',
				leaf: true,
				hideOnBasic: true,
				action: 'show-requests',
				viewState: 'club',
				welcomeFn: function() {
					Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
				}
			},
			{
				xtype: 'contactinfo',
				title: i10n.translate('contactinfo.title'),
				iconCls: 'contactinfo-icon',
				leaf: true,
				action: 'show-contactinfo',
				viewState: 'club'
			},
			{
				title: i10n.translate('tovisit.save'),
				viewState: 'club',
				iconCls: 'places-icon',
				leaf: true,
				hanlder: function() {
					Ext.Viewport.fireEvent('addcurrentcheckinastovisit');
				}
			},
			{
				xtype: 'settingstab',
				title: i10n.translate('settingsButton'),
				leaf: true,
				action: 'show-settings',
				iconCls: 'user-icon',
				viewState: 'allways'
			},
			{
				ui: 'action',
				title: i10n.translate('dashboard.button.demo'),
				action: 'demo-checkin',
				iconCls: 'demo-icon',
				leaf: true,
				viewState: 'cloobster',
				handler: function() {
					Ext.Viewport.fireEvent('democheckin');
				}
			},
			{	
				xtype: 'myorderstab',
				iconCls: 'exit-icon',
				title: i10n.translate('myOrdersTabLeaveBt'),
				leaf: true,
				action: 'show-myorders',
				viewState: 'club'
			},
			//a short helpful description description
			{
			 title: i10n.translate('slidenav.header.help'),
			 header: true,
			 viewState: 'cloobster'
		  	}
	
		]
	}
});
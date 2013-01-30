/**
*	Settings. Used in SettingsView and SettingsTab.
*/
Ext.define('EatSense.view.Settings', {
	extend : 'Ext.Panel',
	requires: ['EatSense.view.components.SlidenavButton'],
	xtype : 'settings',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'center'
		},
		scrollable: 'vertical',
		padding: '0 10 0 10',
		/**
         * @cfg {Boolean} If true adds a back button to the components titlebar.
         * @accessor
         */
		backButton: false,
		/**
         * @cfg {Boolean} If false, hides the logout button from settings panel.
         * @accessor
         */
		logoutButton: true,
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('settingsButton'),
				docked: 'top',
				items: [
					{
						xtype: 'slidenavbutton',
					}
				]
			},
			{
						xtype: 'label',
						itemId: 'accountEmail',
						cls: 'general-label',
						width: '90%',
						tpl: '<h1>'+i10n.translate('settings.account.email')+'</h1>'						
			},
			{
				xtype: 'label',
				width: '90%',
				cls: 'general-text',
				margin: '7 0 5 0',
				html: i10n.translate('nicknameDesc')
			},
			{
				xtype : 'textfield',
				placeHolder : i10n.translate('nickname'),
				width: '90%',
				itemId : 'nickname',
				maxLength: 25,
				cls: 'general-textfield',
				labelCls: 'general-field-label-vertical'
			}
			,
			{
				xtype: 'panel',
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'stretch'
				},
				width: '90%',
				itemId: 'accountPanel',				
				items: [					
					{
						xtype: 'label',
						itemId: 'accountFbStatus',
						cls: 'general-label',
						html: i10n.translate('settings.account.fbconnected'),
						hidden: true
					},
					{
						xtype: 'label',
						cls: 'general-label',
						margin: '5 0 0 0',
						itemId: 'changeSectionLabel',
						html: i10n.translate('settings.account.label.edit')
					},
					{
						xtype: 'panel',
						layout: {
							type: 'hbox',
							pack: 'center',
							align: 'stretch'
						},
						items: [
						{
							xtype: 'fixedbutton',
							ui: 'action',
							margin: '0 5 0 0',
							action: 'email-change',
							text: i10n.translate('settings.account.button.email'),
							flex: 1
						},
						{
							xtype: 'fixedbutton',
							ui: 'action',
							action: 'password-change',
							margin: '0 0 0 5',
							text: i10n.translate('settings.account.button.password'),
							flex: 1
						}
						]
					},					
					{
						xtype: 'fixedbutton',
						text: i10n.translate('settings.button.connectfb'),
						ui: 'action',
						action: 'connect-fb',
						// width: '80%',
						margin: '7 0 5 0',
						iconCls: 'fb-signup',
						iconMask: true
					},
					{
						xtype: 'fixedbutton',
						ui: 'action',
						action: 'logout',
						margin: '10 0 5 0',
						// width: '80%',
						text: i10n.translate('settings.button.logout')
					}
				]
			},
			{
				xtype: 'fixedbutton',
				text: i10n.translate('general.companydetail'),
				ui: 'action',
				action: 'about',
				margin: '7 0 5 0',
				width: '90%'
			}
		]
	},
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);

		if(config.backButton) {
			this.setBackButton(true);
			this.down('titlebar').add(Ext.create('EatSense.view.BackButton'));	
		};

		if(config.logoutButton === false) {
			this.setLogoutButton(false);
			this.down('button[action=logout]').setHidden(true);	
			this.down('button[action=logout]').disable();
		};

	}
});
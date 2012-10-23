/**
*	Settings. Used in SettingsView and SettingsTab.
*/
Ext.define('EatSense.view.Settings', {
	extend : 'Ext.Panel',
	xtype : 'settings',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'stretch'
		},
		scrollable: 'vertical',
		padding: 20,
		width: '100%',
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
			},
			{
				xtype: 'label',
				// cls: 'general-label',
				cls: 'login-description',
				margin: '7 0 5 0',
				html: i10n.translate('nicknameDesc')
			},
			{
				xtype : 'textfield',
				placeHolder : i10n.translate('nickname'),
				labelWidth: '40%',
				labelAlign: 'top',
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
				// width: '100%',
				itemId: 'accountPanel',				
				items: [
					{
						xtype: 'label',
						itemId: 'accountEmail',
						cls: 'general-label',
						// width: '80%',
						// style: 'text-align: left;',
						tpl: '<h1>'+i10n.translate('settings.account.email')+'</h1>'						
					},
					{
						xtype: 'label',
						itemId: 'accountFbStatus',
						cls: 'general-label',
						// width: '80%',
						// style: 'text-align: left;',
						html: i10n.translate('settings.account.fbconnected'),
						hidden: true
					},
					{
						xtype: 'label',
						cls: 'general-label',
						margin: '5 0 0 0',
						html: "- "+i10n.translate('change')+" -"
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
							xtype: 'button',
							ui: 'action',
							margin: '0 5 0 0',
							action: 'email-change',
							// width: '60%',
							text: i10n.translate('settings.account.button.email'),
							flex: 1
						},
						{
							xtype: 'button',
							ui: 'action',
							action: 'password-change',
							margin: '0 0 0 5',
							// width: '60%',
							text: i10n.translate('settings.account.button.password'),
							flex: 1
						}
						]
					},					
					{
						xtype: 'button',
						text: i10n.translate('settings.button.connectfb'),
						ui: 'action',
						action: 'connect-fb',
						// width: '60%',
						margin: '7 0 5 0',
						iconCls: 'fb-signup',
						iconMask: true
					},
					{
						xtype: 'button',
						ui: 'action',
						action: 'logout',
						margin: '10 0 5 0',
						// width: '60%',
						text: i10n.translate('settings.button.logout')
					}
				]
			},
			{
				xtype: 'button',
				text: i10n.translate('general.legalnotice'),
				ui: 'action',
				action: 'about',
				style: 'margin-top: 1em;',
				// width: '60%'
			},
			{
				xtype: 'label',
				html: 'Cloobster App Version: ' + appConfig.version,
				style: 'text-align: right; font-size: 0.6em; color: black;',
				margin: '10 0 0 0',
				// width: '80%'
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
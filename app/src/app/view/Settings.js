/**
* Displays account settings.
*/
Ext.define('EatSense.view.Settings', {
	extend : 'EatSense.view.components.BackButtonPanel',
	requires: ['EatSense.view.components.SlidenavButton', 'EatSense.view.components.HomeButton'],
	xtype : 'settings',
	config : {
		layout: {
			type: 'vbox',
			pack: 'center',
			align: 'stretch'
		},
		scrollable: 'vertical',
		padding: '0 30 8 30',

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
				]
			},
			{
						xtype: 'label',
						itemId: 'accountEmail',
						cls: 'general-label',
						tpl: '<h1>'+i10n.translate('settings.account.email')+'</h1>'						
			},
			{
				xtype: 'label',
				cls: 'general-text',
				margin: '7 0 5 0',
				html: i10n.translate('nicknameDesc')
			},
			{
				xtype : 'textfield',
				placeHolder : i10n.translate('nickname'),
				width: '100%',
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
						margin: '7 0 5 0',
						iconCls: 'fb-signup',
						iconMask: true
					},
					{
						xtype: 'fixedbutton',
						ui: 'action',
						action: 'logout',
						margin: '10 0 5 0',
						text: i10n.translate('settings.button.logout')
					}
				]
			},
			{
				xtype: 'fixedbutton',
				text: i10n.translate('general.companydetail'),
				ui: 'action',
				action: 'about',
				margin: '7 0 0 0'
			},
			{
				xtype: 'fixedbutton',
				text: i10n.translate('settings.button.login'),
				ui: 'action',
				action: 'show-login',
				margin: '13 0 0 0'
				width: '90%'
			},
			{
				xtype: 'label',
				html: 'Platform Version: ' + appConfig.version,
				width: '90%',
				margin: '7 0 0 0',
				style: {
					'font-size' : '.6em',
					'text-align' : 'left'
				}
			}
		]
	},
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);


		if(config.logoutButton === false) {
			this.setLogoutButton(false);
			this.down('button[action=logout]').setHidden(true);	
			this.down('button[action=logout]').disable();
		}

	}
});
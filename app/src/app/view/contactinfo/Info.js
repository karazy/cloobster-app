Ext.define('EatSense.view.contactinfo.Info', {
	extend: 'EatSense.view.components.BackButtonPanel',
	xtype: 'contactinfodetail',
	requires: [],
	config: {
		/**
		* @cfg {EatSense.model.Business} location
		* The record displayed on this page.
		*/
		location:  null,
		layout:  {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		scrollable: 'vertical',
		padding: '10px 30px 8px 30px',
		/**
		* @cfg {Boolean} backButton
		* True, to render a BackButton instead of HomeButton on first panel.
		*/	
		backButton: false,
		homeButton: true,
		items: [
			{
				xtype: 'titlebar',
				title: i10n.translate('contactinfo.title'),
				docked: 'top',
				items: [
				]
			},
			{
				xtype: 'label',
				itemId: 'content',
				margin: '0 0 20 0',
				tpl: new Ext.XTemplate(
					'<div class="contactinfo-main-data">',
						'<div class="name">{name}</div>',
						'<div class="description">{description}</div>',
					'</div>'
				)
			},
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					align: 'center'
				},
				margin: '5 0 0 0',
				hidden: true,
				itemId: 'actions',
				items: [					
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						align: 'right',
					    text: i10n.translate('tovisit.detail.sneakinbutton'),
					    ui: 'action',
					    margin: '0 5 0 0',
					    flex: 1
					},
					{
						xtype: 'fixedbutton',
						// iconCls: 'tovisit-icon',
						// iconMask: true,
						ui: 'action',
						action: 'save-favorit',
						align: 'right',
						margin: '0 0 0 5',
						flex: 1,
						text: i10n.translate('dashboard.button.tovisit'),
					}
				]
			},	
			{
				xtype: 'panel',
				itemId: 'mainPhone',
				margin: '6 0 0 0',
				layout: {
					type: 'hbox',
					align: 'start'
				},
				style: {
					'word-break' : 'break-word'
				},
				items: [
					{
						xtype: 'label',
						cls: 'general-text',
						flex: 2,
						margin: '0'
					},
					{
						xtype: 'fixedbutton',
						action: 'call-location',
						text: i10n.translate('contactinfo.location.phone'),
						iconCls: 'phone1',
						iconMask: true,
						hidden: true,
						ui: 'action',
						flex: 1
					}
				]
			},
			{
				xtype: 'panel',
				margin: '6 0 0 0',
				layout: {
					type: 'hbox',
					align: 'start'
				},
				style: {
					'word-break' : 'break-word'
				},
				items: [
					{
						xtype: 'label',
						itemId: 'address',
						cls: 'general-text',
						flex: 2,
						margin: '0'
					},
					{
						xtype: 'fixedbutton',
						action: 'show-maps',
						text: i10n.translate('contactinfo.map.title'),
						iconCls: 'globe2',
						iconMask: true,
						hidden: true,
						ui: 'action',
						flex: 1
					}	
				]
			},
			{
				xtype: 'fixedbutton',
				action: 'open-link',
				text: i10n.translate('contactinfo.location.url'),
				iconCls: 'look',
				iconMask: true,
				hidden: true,
				ui: 'action',
				margin: '6 0 0 0'
			},
			{
				xtype: 'fixedbutton',
				action: 'open-fburl',
				text: i10n.translate('contactinfo.fburl'),
				iconCls: 'fb-signup',
				iconMask: true,
				hidden: true,
				ui: 'action',
				margin: '6 0 0 0'
			},
			{
				xtype: 'label',
				itemId: 'slogan',
				margin: '20 0 0 0'
			},
			{
				xtype: 'panel',
				itemId: 'profilePictures'
			}
			
		]
	},

	constructor: function(config) {
		//needed to correctly initialize config in BackButtonPanel
		this.callParent(arguments);
	},

	updateLocation: function(newValue, oldValue) {
		var content,
			slogan,
			address,
			tpl,
			urlPanel,
			openLocationUrlBt,
			callLocationBt,
			showMapsBt,
			gmap,
			mapsMarker,
			phonePanel,
			fbPanel,
			fbBt;

		if(newValue && newValue != oldValue) {			
			content = this.down('#content');
			slogan = this.down('#slogan');
			address = this.down('#address');
			fbPanel = this.down('#fbUrl');
			showMapsBt = this.down('button[action=show-maps]');			
			console.log('EatSense.view.ContactInfo.updateLocation');

			gmap = this.down('map');

			phonePanel = this.down('#mainPhone');
			callLocationBt = this.down('button[action=call-location]');

			urlPanel = this.down('#mainUrl');
			openLocationUrlBt = this.down('button[action=open-link]');	
			fbBt = this.down('button[action="open-fburl"]');		

			if(content) {
				tpl = content.getTpl();

				tpl.overwrite(content.element, newValue.getData());
			}

			if(slogan) {
				slogan.setHtml(newValue.get('slogan'));
			}

			if(address) {				
				address.setHtml(appHelper.formatBusinessAddress(newValue.getData()));
			}

			// if(fbPanel) {
			// 	fbPanel.down('label').setHtml(newValue.get('fbUrl'));
			// }

			if(showMapsBt) {
				if(newValue.get('address') || newValue.get('city') || newValue.get('postcode')) {
					showMapsBt.setHidden(false);	
				} else {
					showMapsBt.setHidden(true);
				}
			}
			

			if(phonePanel) {
				phonePanel.down('label').setHtml(newValue.get('phone'));
			}

			if(callLocationBt) {
				if(newValue.get('phone')) {
					callLocationBt.setHidden(false);
					callLocationBt.on({
						tap: function() {
							window.location.href = 'tel:' + newValue.get('phone');
						},
						scope: this
					})	;
				} else {
					callLocationBt.setHidden(true);
				}			
			}
			
			// if(urlPanel) {
			// 	urlPanel.down('label').setHtml(newValue.get('url'));
			// }

			if(openLocationUrlBt) {
				if(newValue.get('url')) {
					openLocationUrlBt.setHidden(false);
					openLocationUrlBt.on({
						tap: function() {
							window.open(encodeURI(appHelper.createValidUrl(newValue.get('url'))), '_blank');
						},
						scope: this
					});
				} else {
					openLocationUrlBt.setHidden(true);
				}			
			}

			if(fbBt) {
				if(newValue.get('fbUrl')) {
					fbBt.setHidden(false);
					fbBt.on({
						tap: function() {
							window.open(encodeURI(appHelper.createValidUrl(newValue.get('fbUrl'))), '_system');
						},
						scope: this
					});
				} else {
					fbBt.setHidden(true);
				}
			}	

		} else {
			//no location given
			tpl.overwrite(content.element, '');
		}
	}
});
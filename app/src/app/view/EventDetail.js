Ext.define('EatSense.view.EventDetail', {
	extend: 'EatSense.view.components.BackButtonPanel',
	xtype: 'eventdetail',
	mixins: ['EatSense.mixin.ImageZoom'],
	config: {
		backButton: true,
		// layout: {
		// 	type: 'vbox'
		// },
		tpl: new Ext.XTemplate(
			'<tpl if="infpic">',
				'<div class="image">',
				'</div>',
			'</tpl>',
			'<div class="text">',
				'<h1>{title}</h1>',
				'{info}',
				'<p>{locationCommon} {location}</p>',
				'<p>{locationStreet}, {locationZip} {locationCity}</p>',
				'<p>{locationAppendix}</p>',
			'</div>'
		),
		items: [		
			{
				xtype: 'titlebar',
				docked: 'top',
				items: [
					{
						xtype: 'fixedbutton',
						action: 'open-link',
						ui: 'action',
						text: i10n.translate('ztixevent.button.openlink'),
						// cls: 'infopage-link-button',
						// iconCls: 'infopage-link-button-icon',
						hidden: true,
						align: 'right'
					}
				]
			},
			{
				xtype: 'panel',
				itemId: 'content',
				scrollable: {
				    direction: 'vertical',
				    directionLock: true
				},
				height: '100%',
				width: '100%',
				styleHtmlContent: false,
				cls: 'infopage-detail'
			}
		],
		/**
		* @cfg
		* The event displayed on this page. Must be of type @see{EatSense.model.ZtixEvent}
		*/
		eventData: null
	},

	updateEventData: function(newRecord, oldRecord) {
		var panel = this,
			contentPanel,
			html,
			imagePanel,
			linkButton;

		linkButton = panel.down('fixedbutton[action=open-link]');

		// show/hide link button if an url is present or not
		if(newRecord.get('link')) {
			linkButton.setHidden(false);
		} else {
			linkButton.setHidden(true);
		}

		//set html in content panel
		html = panel.getTpl().apply(newRecord.getData());
		contentPanel = panel.down('#content');
		contentPanel.setHtml(html);	

		// imagePanel = panel.down('#imageHeader');
		imagePanel = panel.element.down('.image');

		if(newRecord.get('infpic')) {
			if(imagePanel) {
				imagePanel.setStyle({
					'background-image': 'url(' + newRecord.get('infpic') + ')'
				});

				this.registerImageZoomTap(panel.element.down('.image'), newRecord.get('infpic'));
			}
		}
	}
});
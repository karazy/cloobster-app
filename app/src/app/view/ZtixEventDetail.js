Ext.define('EatSense.view.ZtixEventDetail', {
	extend: 'EatSense.view.components.BackButtonPanel',
	xtype: 'eventdetail',
	mixins: ['EatSense.mixin.ImageZoom'],
	config: {
		backButton: true,
		itemId: 'content',
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		height: '100%',
		width: '100%',
		styleHtmlContent: false,
		cls: 'infopage-detail',
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
						hidden: true,
						align: 'right'
					}
				]
			}
		],
		/**
		* @cfg
		* The event displayed on this page. Must be of type @see{EatSense.model.ZtixEvent}
		*/
		eventData: null
	},

	/**
	* Renders given record into panel.
	*/
	updateEventData: function(newRecord, oldRecord) {
		var panel = this,
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

		//set html 
		html = panel.getTpl().apply(newRecord.getData());
		panel.setHtml(html);

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
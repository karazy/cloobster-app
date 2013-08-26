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
				'<tpl if="subtitle">',
					'<h3>{subtitle}</h3>',
				'</tpl>',
				'<tpl if="date">',
					'<div>{[this.formatDate(values.date)]} <tpl if="this.checkTime(values.time)">{time}</tpl></div>',
				'</tpl>',
				'<div style="text-align: justify;">{info}</div>',
				'<p style="margin-top:15px !important; font-family:Roboto_Italic;">{locationCommon} {location}</p>',
				'<p style="font-family:Roboto_Italic;">{locationStreet}, {locationZip} {locationCity}</p>',
				'<p style="font-family:Roboto_Italic;">{locationAppendix}</p>',
			'</div>',
			{
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language];;
					return Ext.util.Format.date(date, format);
				},
				checkTime: function(time) {
					if(time == "00:00:00") {
						return false;	
					}
					return true;
				}
			}
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
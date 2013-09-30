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
					'<h3 class="subheadline">{subtitle}</h3>',
				'</tpl>',
				'<tpl if="date">',
					'<p class="date">{[this.formatDate(values.date)]} <tpl if="this.checkTime(values.time)">{[this.formatTime(values.time)]}</tpl></p>',
				'</tpl>',
				'<p style="text-align: justify;">{[this.removeIframes(values.info)]}</p>',
				'<p style="margin-top:15px !important; font-family:Roboto_Italic;">{locationCommon} {location}<br/>',
				'{locationStreet}, {locationZip} {locationCity}<br/>',
				'{locationAppendix}</p>',
			'</div>',
			{
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language];;
					return Ext.util.Format.date(date, format);
				},
				formatTime: function(time) {
					//cut of :XY at the end 
					return appHelper.shorten(time, 5);
				},
				checkTime: function(time) {
					if(time == "00:00:00") {
						return false;	
					}
					return true;
				},
				removeIframes: function(data) {
					if(!data) {
						return
					}

					try {
						return data.replace(/(<iframe.*?>.*?<\/iframe>)/g, '');
					} catch(e) {
						console.error('EatSense.view.ZtixEventDetail: failed to remove iframe');
						return data;
					}									
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
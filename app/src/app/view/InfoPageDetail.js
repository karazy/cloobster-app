/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	mixins: ['EatSense.mixin.ImageZoom'],

	alternateClassName: 'IPDetail',
	config: {
		tpl: new Ext.XTemplate(
			'<tpl if="imageUrl">'+
				'<div class="image">'+
					// '<img src="{imageUrl}"/>'+
				'</div>'+
			'</tpl>'+
			'<div class="text"><h1>{title}</h1>{html}</div>'
		),
		items: [
			
			{
				xtype: 'label',
				top: '50%',
				right: 1,
				style: {
					width: 0,
					height: 0,
					'border-right': '.7em solid #c3c3c3',
					'border-top': '.8em solid transparent',
					'border-bottom': '.8em solid transparent'
				}
			},
			{
				xtype: 'label',
				top: '50%',
				left: 1,
				style: {
					width: 0,
					height: 0,
					'border-left': '.7em solid #c3c3c3',
					'border-top': '.8em solid transparent',
					'border-bottom': '.8em solid transparent'
				}
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
				cls: 'infopage-detail',
				items: [
				{
					xtype: 'fixedbutton',
					action: 'open-link',
					ui: 'action',
					cls: 'infopage-link-button',
					iconCls: 'infopage-link-button-icon',
					hidden: true
				}
				]
			}
		],
		/**
		* @cfg
		* The record displayed on this page. Must be of type @see{EatSense.model.Infopage}
		*/
		ipRecord: null
		
	},

	updateIpRecord: function(newRecord, oldRecord) {
		var panel = this,
			contentPanel,
			html,
			imagePanel,
			scaleFactorS = '=s720',
			scaleFactorL = '=s1024',
			urlButton;

		urlButton = panel.down('fixedbutton[action=open-link]');

		// show/hide link button if an url is present or not
		if(newRecord.get('url')) {
			urlButton.setHidden(false);
		} else {
			urlButton.setHidden(true);
		}

		//set html in content panel
		html = panel.getTpl().apply(newRecord.getData());
		contentPanel = panel.down('#content');
		contentPanel.setHtml(html);	

		// imagePanel = panel.down('#imageHeader');
		imagePanel = panel.element.down('.image');

		if(newRecord.get('imageUrl')) {
			if(imagePanel) {
				imagePanel.setStyle({
					'background-image': 'url(' + newRecord.get('imageUrl') + scaleFactorS + ')'
				});

				this.registerImageZoomTap(panel.element.down('.image'), newRecord.get('imageUrl') + scaleFactorL);
			}
		} else {
			if(urlButton && urlButton.element) {
				urlButton.element.dom.style.top = '5px';	
			} else {
				console.log('EatSense.view.InfoPageDetail.updateIpRecord: urlButton or urlButton.element do not exist');
			}
			
		}
	}
});
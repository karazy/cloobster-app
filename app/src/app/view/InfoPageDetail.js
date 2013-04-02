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
				xtype: 'fixedbutton',
				action: 'open-link',
				// text: i10n.translate('infopage.link.button'),
				ui: 'action',
				iconMask: true,
				iconCls: 'globe2',
				hidden: true,
				right: '10px',
				top: '184px'
			},
			{
				xtype: 'label',
				// html: '&lt;',
				top: '50%',
				left: 3,
				style: {
					// 'border-radius': '0 2em 2em 0',
					// color: '#a3a3a3',
					// border: '1px solid #a3a3a3',
					// height: '2em',
					// width: '1em',
					// 'text-align': 'center',
					// 'font-size': '1em',
					// 'line-height': '2em'
					width: 0,
					height: 0,
					'border-right': '.7em solid #e5e5e5',
					'border-top': '1em solid transparent',
					'border-bottom': '1em solid transparent'
				}
			},
			{
				xtype: 'label',
				// html: '&gt;',
				top: '50%',
				right: 3,
				style: {
					// 'border-radius': '2em 0 0 2em',					
					// color: '#a3a3a3',
					// right: '3px',
					// border: '1px solid #a3a3a3',
					// height: '2em',
					// width: '1em',
					// 'text-align': 'center',
					// 'font-size': '1em',
					// 'line-height': '2em'
					width: 0,
					height: 0,
					'border-left': '.7em solid #e5e5e5',
					'border-top': '1em solid transparent',
					'border-bottom': '1em solid transparent'
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
				cls: 'infopage-detail'
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
				// imagePanel.dom.style.backgroundImage.src =  newRecord.get('imageUrl');
				this.registerImageZoomTap(panel.element.down('.image'), newRecord.get('imageUrl') + scaleFactorL);
			}
		} else {
			urlButton.setTop('5px');
		}
	}
});
/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',

	/**
     * @event imagezoomopen
     * Fires when image is zoomed for fullscreen display.
     * @param {Ext.Panel} imagePanel 
     *	The panel containing the image.
     */

     /**
     * @event imagezoomclose
     * Fires when a fullscreen image gets closed.
     * @param {Ext.Panel} imagePanel 
     *	The panel containing the image.
     */

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
				html: '&lt;',
				// docked: 'left',
				// height: 10,
				// width: 5,
				top: '50%',
				left: 3,
				// docked: 'left',
				style: {
					// position: 'fixed',
					// top: '50%',
					// left: '3px',
					'border-radius': '0 2em 2em 0',
					color: '#a3a3a3',
					// right: '3px',
					border: '1px solid #a3a3a3',
					height: '2em',
					width: '1em',
					'text-align': 'center',
					'font-size': '1em',
					'line-height': '2em'
				}
			},
			{
				xtype: 'label',
				html: '&gt;',
				top: '50%',
				right: 3,
				style: {
					// position: 'fixed',
					// top: '50%',
					// right: '3px',
					'border-radius': '2em 0 0 2em',					
					color: '#a3a3a3',
					right: '3px',
					border: '1px solid #a3a3a3',
					height: '2em',
					width: '1em',
					'text-align': 'center',
					'font-size': '1em',
					'line-height': '2em'
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
				this.registerImageZoomTap(panel, newRecord.get('imageUrl') + scaleFactorL);
			}
		} else {
			urlButton.setTop('5px');
		}
	},
	/**
	* Register a tap event for image to zoom it.
	* @param {Ext.dom.Element} panel
	*	Panel to register tap event
	* @param {String} url (optional)
	*	url to image. If none provided uses url of image tag
	*/
	registerImageZoomTap: function(panel, url) {
		var image;

		image = panel.element.down('.image');

		if(image) {
			//if an image exists, add tap listener
			image.on({
				tap: function(ele) {
					console.log('InfoPageDetail.registerImageZoomTap: image tap');					

					var img = new Image(),
						imgPanel,
						viewportW,
						viewportH,
						panelW = '',
						panelH = '',
						imageH = 'auto',
						imageW = 'auto';

					imgPanel = Ext.create('Ext.Panel', {
						height: '50%',
						width: '50%',
						centered: true,
						hideOnMaskTap: true,
						modal: true,
						// floatingCls: '',
						// style: {
						// 	'background-color' : 'white'
						// },
						listeners: {
							hide: function() {
								imgPanel.destroy();
							}
						}
					});

					imgPanel.element.on({
						tap: function() {
							imgPanel.hide();
							//notify listeners that image panel close
							// panel.fireEvent('imagezoomclose', imgPanel);
							Ext.Viewport.fireEvent('removebackhandler', doHidePanel);
						}
					});					

					Ext.Viewport.add(imgPanel);
					appHelper.toggleMask('loadingMsg', imgPanel);	
					//notify listeners that an image panel is open
					Ext.Viewport.fireEvent('addbackhandler', doHidePanel);
					// panel.fireEvent('imagezoomopen', imgPanel);				

					
					function doHidePanel() {
						imgPanel.hide();
					}



					img.onload = function() {
						var ratio = this.width / this.height;

						if(!imgPanel) {
							console.log('EatSense.view.InfoPageDetail: panel destroyed before image finished loading');
							return;
						}

						try {
							appHelper.toggleMask(false, imgPanel);

							viewportW = window.innerWidth;
							viewportH = window.innerHeight;

							//more wide then tall
							if(ratio >= 2/3 ) {
								imageW = "100%";

								if(this.width > viewportW * 0.95) {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 1');
									panelW  = viewportW * 0.95;
									panelH = panelW / ratio;
								} else {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 2');
									panelW = this.width;
									panelH = this.height;
								}
							} else {
								imageH = "100%";

								if(this.height > viewportH * 0.95) {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 3');
									panelH  = viewportH * 0.66;
									//add 4 pixels because of margins
									panelW = panelH * ratio + 4;
								} else {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 4');
									panelH = this.height;
								}
							}
							
							imgPanel.setWidth(panelW);
							imgPanel.setHeight(panelH);
							imgPanel.setHtml('<img src="'+img.src+'" width="'+imageW+'" height="'+imageH+'"/>');

						} catch(e) {
							console.log('EatSense.view.InfoPageDetail: failed to load image ' + e);
						}
					}

					img.src = url;
					
				}
			});
		}
	}

});
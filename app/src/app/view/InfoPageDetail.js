/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		// layout: 'vbox',
		// scrollable: {
		//     direction: 'vertical',
		//     directionLock: true
		// },
		// styleHtmlContent: false,
		// cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><tpl if="imageUrl"><img src="{imageUrl}"/></tpl><div>{html}</div>'
		),
		items: [
			{
				xtype: 'fixedbutton',
				action: 'open-link',
				// text: i10n.translate('infopage.link.button'),
				ui: 'action',
				iconMask: true,
				iconCls: 'globe2',
				// top: 5,
				// right: 5,
				hidden: true,
				style: {
					position: 'absolute',
					right: '5px',
					top: '5px',
					width: '40px',
					height: '40px'
				}
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
				// layout: 'fit',
				scrollable: {
				    direction: 'vertical',
				    directionLock: true
				},
				height: '100%',
				width: '100%',
				styleHtmlContent: false,
				cls: 'infopage-detail',
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
			image;

		// show/hide link button if an url is present or not
		if(newRecord.get('url')) {
			panel.down('fixedbutton[action=open-link]').setHidden(false);
		} else {
			panel.down('fixedbutton[action=open-link]').setHidden(true);
		}	

		//HINT dont user tpl.overwrite, scrolling will not work
		html = panel.getTpl().apply(newRecord.getData());
		contentPanel = panel.down('#content');
		contentPanel.setHtml(html);		

		this.registerImageZoomTap(panel);
	},
	/**
	* Register a tap event for image to zoom it.
	* @param {Ext.Component} panel
	*	Panel to look for image
	*/
	registerImageZoomTap: function(panel) {
		var image;		

		image = panel.element.down('img');

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
						// floatingCls: '',
						// cls: 'image-zoom',
						style: {
							// border: '1px solid black',
							// 'background-color' : '#FFF',
							// padding: '6px 6px 0px 6px'
						},
						modal: true,
						// html: '<img src="'+image.dom.src+'" width="100%"/>',
						listeners: {
							hide: function() {
								imgPanel.destroy();
							},
							'setimagesrc': setImageSrc
						}
					});

					imgPanel.element.on({
						tap: function() {
							imgPanel.hide();
						}
					});					

					Ext.Viewport.add(imgPanel);
					appHelper.toggleMask('loadingMsg', imgPanel);					



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

								if(this.width > viewportW * 0.9) {
									panelW  = viewportW*0.9;
								} else {
									panelW = this.width;
								}
							} else {
								imageH = "100%";

								if(this.height > viewportH * 0.9) {
									panelH  = viewportH * 0.66;
									//add 4 pixels because of margins
									panelW = panelH * ratio + 4;
								} else {
									panelH = this.height;
								}
							}
							
							imgPanel.setWidth(panelW);
							imgPanel.setHeight(panelH);
							imgPanel.setHtml('<img src="'+image.dom.src+'" width="'+imageW+'" height="'+imageH+'"/>');

						} catch(e) {
							console.log('EatSense.view.InfoPageDetail: failed to load image ' + e);
						}
					}

					// Ext.create('Ext.util.DelayedTask', function () {
					// 	imgPanel.fireEvent('setimagesrc');
    	// 			}).delay(100);

					//start loading the image
					// img.src = image.dom.src + '?size=500x1000';
					function setImageSrc() {
						img.src = image.dom.src;	
					}

					img.src = image.dom.src;
					
				}
			});
		}
	}

});
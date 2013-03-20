/**
* Represents an InfoPage used in @see{EatSense.view.InfoPageCarousel}
*/
Ext.define('EatSense.view.InfoPageDetail', {
	extend: 'Ext.Panel',
	xtype: 'infopagedetail',
	alternateClassName: 'IPDetail',
	config: {
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		styleHtmlContent: false,
		cls: 'infopage-detail',
		tpl: new Ext.XTemplate(
			'<h1>{title}</h1><tpl if="imageUrl"><img src="{imageUrl}"/></tpl><div>{html}</div>'
		),
		//record assigned to this infopage
		ipRecord: null
		
	},
	updateIpRecord: function(newRecord, oldRecord) {
		var panel = this,
			html,
			image;

		//HINT dont user tpl.overwrite, scrolling will not work
		html = panel.getTpl().apply(newRecord.getData());
		panel.setHtml(html);

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
						panelW,
						panelH;

					imgPanel = Ext.create('Ext.Panel', {
						height: '50%',
						width: '50%',
						centered: true,
						hideOnMaskTap: true,
						modal: true,
						// html: '<img src="'+image.dom.src+'" width="100%"/>',
						listeners: {
							hide: function() {
								imgPanel.destroy();
							}
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
						console.log(this.width);

						if(!imgPanel) {
							console.log('EatSense.view.InfoPageDetail: panel destroyed before image finished loading');
							return;
						}

						try {
							appHelper.toggleMask(false, imgPanel);

							viewportW = window.innerWidth;
							viewportH = window.innerHeight;

							if(this.width > viewportW * 0.9) {
								// this.width = '100%';
								panelW  = viewportW*0.9;
								// this.height = viewportH*0.9;
								// panelH  = viewportH*0.9;
							} else {
								panelW = this.width;
							}

							// if(this.height > viewportH * 0.9) {
							// 	// this.height = '100%';
							// 	panelH  = viewportH*0.9;
							// } else {
							// 	panelH = this.height;
							// }

							// imgPanel = Ext.create('Ext.Panel', {
							// // top: 30,
							// // left: 30,
							// // right: 30,
							// // bottom: 30,
							// height: panelH,
							// width: panelW,
							// centered: true,
							// hideOnMaskTap: true,
							// modal: true,
							// html: '<img src="'+image.dom.src+'" width="100%"/>',
							// listeners: {
							// 	hide: function() {
							// 		imgPanel.destroy();
							// 	}
							// }
							// });
							
							imgPanel.setWidth(panelW);
							imgPanel.setHeight('');
							imgPanel.setHtml('<img src="'+image.dom.src+'" width="100%" height="auto"/>');

							// Ext.Viewport.add(imgPanel);
						} catch(e) {
							console.log('EatSense.view.InfoPageDetail: failed to load image ' + e);
						}
					}

					//start loading the image
					img.src = image.dom.src + '?size=500x1000';

					
				}
			});
		}
	}

});
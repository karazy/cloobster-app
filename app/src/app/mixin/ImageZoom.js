/**
* This mixin provides a common interface to give a component/controller the ability
* to add an image zoom. Use {@link #registerImageZoomTap}.
* Manages backhandlers via throwing addbackhandler and removebackhandler events.
*
*/
Ext.define('EatSense.mixin.ImageZoom', {
	extend: 'Ext.mixin.Mixin',
	alternateClassName: 'EatSense.util.ImageZoom',
	mixins: ['Ext.mixin.Observable'],

	/**
     * @event imagezoomopen
     * Fires on {@link #config.eventReceiver} whenever the overlay gets shown.
     * @param {Ext.Component} panel
     *	The panel displaying the image.
     */

	/**
     * @event imagezoomclose
     * Fires whenever the overlay gets closed.
     * @param {Ext.Component} panel
     *	The panel displaying the image.
     */


	/**
	* Register a tap event for image to view it as whole in an overlay.
	* Fires addbackhandler and removebackhandler events on Ext.Viewport.
	*
	* @param {Ext.dom.Element} imageElement
	*	The element to bin the tap event to.
	* @param {String} url (optional)
	*	url to image. If none provided uses url of image tag
	* @param {Ext.Component} panel (optional)
	*	Panel used for fireEvent. If none provided fires on the component itself.
	*/
	registerImageZoomTap: function(imageElement, url, panel) {
		var me = this,
			image,
			eventReceiver;

		image = imageElement;
		
		eventReceiver = panel || me;


		if(image) {
			//if an image exists, add tap listener
			image.on({
				tap: function(ele) {
					// console.log('EatSense.mixin.ImageZoom.registerImageZoomTap: image tap');					

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
						floatingCls: '',
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

					imgPanel.on({
						hide: function() {
							//listen for hide. tap only works on image and hideOnMaskTap is set
							//notify listeners that image panel was closed
							eventReceiver.fireEvent('imagezoomclose', imgPanel);
							Ext.Viewport.fireEvent('removebackhandler', doHidePanel);
						}
					});		

					Ext.Viewport.add(imgPanel);
					appHelper.toggleMask('loadingMsg', imgPanel);

					//notify listeners that an image panel is open
					eventReceiver.fireEvent('imagezoomopen', imgPanel);	
					Ext.Viewport.fireEvent('addbackhandler', doHidePanel);

					function doHidePanel() {
						imgPanel.hide();
					}	



					img.onload = function() {
						var ratio = this.width / this.height;

						if(!imgPanel) {
							console.log('EatSense.mixin.ImageZoom: panel destroyed before image finished loading');
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
							console.log('EatSense.mixin.ImageZoom: failed to load image ' + e);
						}
					}

					img.src = url;
					
				}
			});
		}
	}
});
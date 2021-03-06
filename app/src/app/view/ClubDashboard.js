/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.ClubDashboard', {
	extend : 'Ext.Panel',	
	xtype : 'clubdashboard',
	requires: ['Ext.Img', 'EatSense.view.components.BasicButton', 'EatSense.view.components.TileButton',
		'EatSense.view.components.BasicTileButton', 'EatSense.view.components.DashboardTeaser'],

	/**
	* @event tilesrendered
	* Tiles have been rendered.
	* @param {EatSense.view.ClubDashboard} dashboard
	*/

	config : {
		layout : {
			type : 'vbox'
		},
		scrollable: 'vertical',
		items : [
			{
				xtype: 'fixedbutton',
				ui: 'action',
				action: 'fb-wallpost',
				baseCls: 'fb-wimpel-button',
				pressedCls: 'fb-wimpel-button-pressed',
				hidden: true,
				style: {
					'position' : 'absolute',
					'top' : '0px',
					'right' : '15px',
					'z-Index' : '5'
				}
			},
			{
				xtype: 'label',
				style: {
					'background-color' : 'transparent',
					'height' : '110px'
				}
			},
		{
			xtype: 'panel',
			width: '100%',
			itemId: 'tilePanel',
			layout: {
				type: 'vbox',
				align: 'center',
				pack: 'start'
			},
			padding: '7 8 12 8',
			items: [
				
				{
					xtype: 'label',
					itemId: 'description',
					cls: 'club-dashboard-description',
					style: 'text-align: center;'
					//get set programmatically
					// html: i10n.translate('clubdashboard.label.description')
				},
				{
					xtype: 'panel',					
					width: '100%',
					layout: {
						type: 'hbox',
						align: 'start',
						pack: 'center'
					},					
					padding: '5px 0 0 0',			
					items: [
					{
						xtype: 'panel',
						flex: 1,
						itemId: 'leftTileColumn',
						padding: '0 4 0 0',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [										
						]
					},
					{
						xtype: 'panel',
						flex: 1,
						padding: '0 0 0 4',
						itemId: 'rightTileColumn',
						layout: {
							type: 'vbox',
							align: 'center',
							pack: 'center'
						},
						defaults: {
							width: '100%',
							margin: '8 0 0 0'
						},
						items: [	
						]
					}
			]
		}
			]
		}	
		]
	},

	initialize: function() {
		var me = this,
			scrollPanel = this;
			fbButton = this.down('button[action=fb-wallpost]'),
			fps = 10,
			scrollTreshhold = '110';


		//configure dynamic scrolling behaviour of facebook button

		if (Ext.os.is.Android && !Ext.browser.is.Chrome) {
            fps = 15;
        }

        if(fbButton) {
        	scrollPanel.getScrollable().getScroller().on({
				scroll: Ext.Function.createThrottled(onClubdashBoardScroll, fps, this),
				scrollend: onClubdashBoardScroll,
				scope: this
			});


			function onClubdashBoardScroll(panel, x, y) {
				//2 different approaches to for moving the item
				// console.log('EatSense.view.ClubDashboard: onClubdashBoardScroll ' + x + ' ' + y);
				// var yCalc = (y > scrollTreshhold) ? scrollTreshhold : y;
				var yOld = (y > scrollTreshhold) ? (scrollTreshhold - y) : 0;

				// if(me.yCalc != yCalc && yCalc) {
				// 	console.log('EatSense.view.ClubDashboard: onClubdashBoardScroll ' + me.yCalc + ' ' + yCalc);
				// 	me.yCalc = yCalc;
				// 	fbButton.element.dom.style.webkitTransform = 'translate3d(0px, ' + yCalc +'px, 0)';	
				// }


				if(me.yOld != yOld) {
					// console.log('EatSense.view.ClubDashboard: onClubdashBoardScroll ' + me.yOld + ' ' + y);
					me.yOld = yOld;
					fbButton.setTop(yOld);	
				}
				
			}
        }
		
	},

	showLoadScreen : function(mask) {
		if (mask) {
			this.setMasked({
				message : i10n.translate('loadingMsg'),
				xtype : 'loadmask'
			});
		} else {
			this.setMasked(false);
		}
	}
});

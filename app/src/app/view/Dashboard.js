/**
 * The dashboard represents the main screen of the application. From here the
 * user can navigate, access his order history or change his settings.
 */
Ext.define('EatSense.view.Dashboard', {
	extend : 'Ext.Panel',
	xtype : 'dashboard',
	requires: ['Ext.Img'],
	config : {
		layout: {
				type: 'fit'
		},
		padding: '25 8 30',
		// cls: 'dashboard',		
		items : [
		{
			xtype: 'toolbar',
			docked: 'top',
			cls: 'dashboard-header',
			title: '<img src="res/images/dashboard/logo_frizz.png" height="30px" width="auto" style="margin: 8px 5px 0 0; float: left;">'+
					' <p style="font-size: .8em;">Stadt- & Kulturmagazin</p>'
		},
		{
			xtype: 'panel',
			layout: {
				type: 'hbox',
				align: 'start'
			},
			docked: 'bottom',
			padding: 10,
			margin: '0 0 10 0',
			items: [
				{
					xtype : 'fixedbutton',
					action: 'tovisit',
					text: i10n.translate('dashboard.button.tovisit'),
					baseCls: 'dashboard-button',
					cls: 'dashboard-button-history',
					// iconCls: 'dashboard-button-icon',
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '7 7 0 4'
				},
				{
					xtype : 'fixedbutton',
					action: 'checkin',
					html: i10n.translate('dashboard.button.checkin'),
					baseCls: 'dashboard-button',
					cls: ['dashboard-button-checkin', 'right'],
					// iconCls: 'dashboard-button-icon',			
					pressedCls: 'dashboard-button-pressed',
					labelCls: 'dashboard-button-label',
					flex: 1,
					margin: '7 4 0 7'
				}	
			]
		},
		{
			xtype: 'list',
			store: 'visitStore',
			emptyText: '<div class="welcome-text">' + i10n.translate('tovisit.list.emptytext') + '</div>',
			deferEmptyText: false,
			// grouped: true,
			itemCls: 'tovisit-item',
			itemTpl: new Ext.XTemplate(
				"<table style='width:100%;'>",					
					'<td align="left" style="vertical-align: top;">',
						//Dummy
						// '<div class="thumbnail" style="background-image: url(http://robohash.org/FRED); background-color: blue;"></div>',
						'<tpl if="imageUrl">',
							'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',							
						'<tpl elseif="values.image && values.image.url">',
							'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s128\')"></div>',
						'</tpl>',
						'<div class="content">',
							'<tpl if="locationId">',
								'<div class="cloobster-location"></div>',
							'</tpl>',
							'<div class="location">',
								'{locationName}',
							'</div>',
							'<tpl if="locationCity">',
								'<div class="location-city">',
									'{locationCity}',
								'</div>',
							'</tpl>',
						'</div>',
					'</td>',
					'<tpl if="visitDate">',
						'<td align="right">',
							'{[this.formatDate(values.visitDate)]}',
						'</td>',
					'</tpl>',					
				'</table>'				
				, {
				formatDate: function(date) {
					var format = appConstants.DateFormat[appConfig.language],
						compareDate = new Date(),
						staleDate,
						shortYear,
						html;

					compareDate.setHours(0,0,0,0);
					staleDate = (date < compareDate) ? ' stale' : '';
					shortYear = date.getFullYear().toString().substring(2,4);

					html =  '<div class="date' + staleDate +'">' +
							'<div class="day">' + date.getDate() + '</div>'+
							'<div class="mmyy">' + 
								appHelper.shorten(i10n.translate('month.' + date.getMonth()), 3) + ' ' + 
								shortYear +
							'</div>';
							// '<div class="mmyy">' + date.getFullYear() + '</div></div>';
					return html;
				}
			}),			
			listeners: {
				select: function(dv, ix, item, e) {
					Ext.defer((function() {
						dv.deselect(ix);
	    			}), 100, this);					
				}
			},
			plugins: [
		        {
		            xclass: 'Ext.plugin.ListPaging',
		            loadMoreText: i10n.translate('history.detail.list.paging'),
		            autoPaging: false
		        }
		    ]
		}
		// {
		// 	xtype: 'label',
		// 	docked: 'bottom',
		// 	width: '100%',
		// 	height: 50,
		// 	// itemId: 'skylinecanvas',
		// 	html: '<canvas id="skylinecanvas" style="width: 100%; height: 50px;"></canvas>'
		// }
		// {
		// 	xtype: 'fixedbutton',
		// 	ui: 'action',
		// 	action: 'demo-checkin',
		// 	text: i10n.translate('dashboard.button.demo'),
		// 	baseCls: 'dashboard-button',
		// 	cls: 'dashboard-button-demo',
		// 	iconCls: 'dashboard-button-icon',
		// 	pressedCls: 'dashboard-button-pressed',
		// 	labelCls: 'dashboard-button-label',
		// 	flex: 2
		// }
		]
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
	},

	initialize: function() {
		var list = this.down('list');

		//skyline disabled
		// if(list) {
		// 	//draw skyline on emptytext on first start
		// 	list.on({
		// 		'painted' : function() {
		// 			this.genSkylineBg();
		// 		},
		// 		single: true,
		// 		scope: this
		// 	});
		// }
	},

	/**
    * Generate a skyline displayed on the empty text of tovisit list.
    */
    genSkylineBg: function(){

      var canvas,
          ctx,
          WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight * .2;

      // canvas = this.getDashboard().down('#skylinecanvas');
      canvas = document.getElementById('skylinecanvas');
      if(!canvas) {
        return;
      }
      ctx = canvas.getContext('2d');
      

      var genSkyline = function() {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        var maxWidth = WIDTH / 12,
            minWidth = maxWidth / 10,
            maxHeight = HEIGHT / 1.2, 
            minHeight = maxHeight / 5,
            amount = random(WIDTH/20,WIDTH/10),
            pos = 0,
            rColor = 'transparent',
            prevHeight,
            rHeight,
            fHeight;

        rHeight = random(minHeight,maxHeight);
        fHeight = prevHeight = rHeight;

        ctx.beginPath();
        ctx.strokeStyle = rColor;
        ctx.fillStyle = '#e6e6e6';
        ctx.lineWidth = 1;
        ctx.moveTo(pos, rHeight);

        while(pos < WIDTH + maxWidth){          
          var currWidth = random(minWidth,maxWidth),
              triangle = random(100, 0);

          prevHeight = drawSkyscraper(pos, currWidth, rHeight, triangle, prevHeight);
          rHeight = random(minHeight,maxHeight);
          pos += currWidth;
        }

        ctx.lineTo(window.innerWidth-1, HEIGHT);
        ctx.lineTo(0, HEIGHT);
        ctx.lineTo(0, fHeight);

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      };

      var drawSkyscraper = function(pos,scraper_width,scraper_height, triangle, prevHeight){
        
        if(triangle < 20 && scraper_width > 5) {
          ctx.lineTo(pos + scraper_width/2, prevHeight - scraper_width/2);
          ctx.lineTo(pos + scraper_width, prevHeight);
          ctx.lineTo(pos + scraper_width, HEIGHT-scraper_height);              
        } else {
          ctx.lineTo(pos + scraper_width, prevHeight);
          ctx.lineTo(pos + scraper_width, HEIGHT-scraper_height);
        }

        return HEIGHT-scraper_height;
      };

      // var bindEventHandlers = function(){
      //   window.onresize = resize;
      //   canvas.addEventListener('click',genSkyline,false);
      // };
      // var resize = function(){
      //   canvas.width = WIDTH = window.innerWidth * .8;
      //   canvas.height = HEIGHT = window.innerHeight * .4;
      //   genSkyline();
      // };

      var random = function(a,b) {
        return Math.random() * (b - a) + a;
      };

      function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
      }

      genSkyline();
    }
});

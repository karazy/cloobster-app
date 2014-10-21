/**
* Displays a list of nearby locations.
*
*/
Ext.define('EatSense.view.locationsearch.Search', {
	extend: 'Ext.Panel',
	xtype: 'locationsearch',
	requires: [],
	config: {
		layout: 'card',
		activeItem: 0,
		items: [		
			{
				xtype: 'backbuttonpanel',
				homeButton: true,
				layout: {
						type: 'vbox',
						pack: 'center',
						align: 'center'
				},
				scrollable: 'vertical',
				padding: '10px 30px 8px 30px', 
				items: [
					{
						xtype: 'titlebar',
						title: i10n.translate('locationsearch.title'),
						docked: 'top',
						items: [
							// {
							// 	xtype: 'fixedbutton',
							// 	text: i10n.translate('storecard.scan'),
							// 	align: 'right',
							// 	action: 'scan-barcode',
							// 	ui: 'normal'
							// }
						]
					},
					{
						xtype: 'list',
						store: 'locationSearchStore',
						emptyText: '<div class="welcome-text">' + i10n.translate('tovisit.list.emptytext') + '</div>',
						deferEmptyText: false,
						loadingText: i10n.translate('loadingMsg'),			
						itemCls: 'tovisit-item',
						itemTpl: new Ext.XTemplate(
							'<tpl if="imageUrl">',
								'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s256\')"></div>',
							'<tpl elseif="values.image && values.image.url">',
								'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s256\')"></div>',
							'</tpl>',				
							'<div class="content">',
								'<div class="location">',
									'{name}',
								'</div>',
								'<tpl if="locationCity">',
									'<div class="location-city">',
										'{city}',
									'</div>',
								'</tpl>',
							'</div>'
						),			
						listeners: {
							select: function(dv, ix, item, e) {
								Ext.defer((function() {
									dv.deselect(ix);
				    			}), 100, this);					
							}
						}
					}					
				]
			}		
		]
	}
	
});
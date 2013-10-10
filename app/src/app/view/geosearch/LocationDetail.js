/**
* Displays details of a location accessed by geosearch.
*
*/
Ext.define('EatSense.view.geosearch.LocationDetail', {
	extend: 'Ext.Panel',
	xtype: 'locationdetail',
	requires: [],
	config: {
		items: [
		layout: {
			type: 'vbox',
			align: 'stretch',
			pack: 'start'
		},
		scrollable: 'vertical',	
		padding: '20 15 8 15',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				items: [
					{
						xtype: 'backbutton'
					}
				]
			},		
			{
				xtype: 'panel',
				itemId: 'content',
				cls: 'tovisit-detail',
				tpl: new Ext.XTemplate(					
						'<div>',
							'<tpl if="imageUrl">',
								// '<div class="thumbnail" style="background-image: url(\'http://robohash.org/FRED\')"></div>',
								'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s128\')"></div>',
							'</tpl>',
							'<div class="location content-box">',
								'{locationName}',							
							'</div>',
						'</div>',						
						'<tpl if="locationCity">',
							'<div class="content-box">',
								'<div class="address">{locationCity}</div>',
							'</div>',
						'</tpl>',
						'<tpl if="comment">',
							'<div class="comment content-box">',
								'{comment}',
							'</div>',
						'</tpl>'
				)
			},
			{
				xtype: 'panel',
				layout: {
					type: 'hbox',
					align: 'center'
				},
				margin: '5 0 0 0',
				items: [					
					{
						xtype: 'fixedbutton',
						action: 'checkin',
						align: 'right',
					    text: i10n.translate('tovisit.detail.sneakinbutton'),
					    ui: 'action',
					    margin: '0 5 0 0',
					    flex: 1
					}
					// {
					// 	xtype: 'fixedbutton',
					// 	iconCls: 'qrcode-icon',
					// 	iconMask: true,
					// 	ui: 'action',
					// 	action: 'scan',
					// 	align: 'right',
					// 	margin: '0 0 0 5'
					// }
				]
			},			
			{
				xtype: 'label',
				hidden: true,
				itemId: 'image',
				margin: '5 0 0 0'
			}

		]
		]
	}
});
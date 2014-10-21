/**
* Displays details of a location accessed by geosearch.
*
*/
Ext.define('EatSense.view.geosearch.LocationDetail', {
	extend: 'Ext.Panel',
	xtype: 'locationdetail',
	requires: [],
	config: {
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
								'{name}',							
							'</div>',
						'</div>',						
						'<tpl if="city">',
							'<div class="content-box">',
								'<div class="address">{city}</div>',
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
					},
					{
						xtype: 'fixedbutton',
						// iconCls: 'tovisit-icon',
						// iconMask: true,
						ui: 'action',
						action: 'save-favorit',
						align: 'right',
						margin: '0 0 0 5',
						flex: 1,
						text: i10n.translate('dashboard.button.tovisit'),
					}
				]
			},			
			{
				xtype: 'label',
				hidden: true,
				itemId: 'image',
				margin: '5 0 0 0'
			}

		]
	}
});
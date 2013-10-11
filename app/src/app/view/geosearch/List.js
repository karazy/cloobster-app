/**
* The list displays the results of the geosearch.
*
*/
Ext.define('EatSense.view.geosearch.List', {
	extend: 'Ext.List',
	xtype: 'geosearchlist',
	requires: ['Ext.field.Select'],
	config: {
		store: 'businessStore',
		emptyText: i10n.translate('geosearch.list.nolocations'),
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
				'<div>',
					'<div class="location">',
						'{name}',
					'</div>',
					'<tpl if="city">',
						'<div class="address">',
							'{postcode} {city}',
						'</div>',
					'</tpl>',
					'<tpl if="address">',
						'<div class="address">',
							'{address}',
						'</div>',
					'</tpl>',
				'</div>',
			'</td>',				
		'</table>'
		),
		itemCls: 'geosearch-list-item',
		cls: 'geosearch-list',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: i10n.translate('geosearch.title'),				
				items: [
					{
						xtype: 'homebutton'
					},
					{
				        xtype: 'selectfield',
				        align: 'right',
				        width: 100,
				        options: [
				            {text: '2km',  value: '2000'},
				            {text: '5km', value: '5000'},
				            {text: '10km',  value: '10000'}
				        ]
				    }
				]				
			}
		],
		listeners: {
			select: function(dv, ix, item, e) {
				Ext.defer((function() {
					dv.deselect(ix);
    			}), 100, this);					
			}
		}
	}
});
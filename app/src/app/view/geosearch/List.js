/**
* The list displays the results of the geosearch.
*
*/
Ext.define('EatSense.view.geosearch.List', {
	extend: 'Ext.List',
	xtype: 'geosearchlist',
	requires: ['Ext.field.Select'],
	config: {
		store: 'locationSearchStore',
		variableHeights: false,
		itemHeight: 75,
		emptyText: i10n.translate('geosearch.list.nolocations'),
		itemTpl: new Ext.XTemplate(
		'<tpl if="imageUrl">',
			'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s256\')"></div>',
		'<tpl elseif="values.image && values.image.url">',
			'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s256\')"></div>',
		'</tpl>',				
		'<div class="content">',
			'<div class="distance">',
				'{distance}m',
			'</div>',
			'<div class="location">',
				'{name}',
			'</div>',			
			'<div class="address">',
				'<tpl if="city">',				
					'{postcode} {city} ',
				'</tpl>',
				'<tpl if="address">',
					' {address}',				
				'</tpl>',
			'</div>',
		'</div>'	

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
				            {text: '5km', value: '5000'},
				            {text: '10km',  value: '10000'},
				            {text: '20km',  value: '20000'},
				            {text: '100km',  value: '1000000'},
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
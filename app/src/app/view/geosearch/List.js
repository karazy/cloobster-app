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
		variableHeights: false,
		itemHeight: 65,
		emptyText: i10n.translate('geosearch.list.nolocations'),
		itemTpl: new Ext.XTemplate(
		'<tpl if="imageUrl">',
			'<div class="thumbnail" style="background-image: url(\'{[values.imageUrl]}=s256\')"></div>',
		'<tpl elseif="values.image && values.image.url">',
			'<div class="thumbnail" style="background-image: url(\'{[values.image.url]}=s256\')"></div>',
		'</tpl>',				
		'<div class="content">',
			'<div class="distance">',
				'< 2345m',
			'</div>',
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
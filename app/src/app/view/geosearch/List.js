/**
* The list displays the results of the geosearch.
*
*/
Ext.define('EatSense.view.geosearch.List', {
	extend: 'Ext.List',
	xtype: 'geosearchlist',
	requires: ['Ext.picker.Picker'],
	config: {
		store: 'locationSearchStore',
		cls: 'geosearch-list',
		// scollToTopOnRefresh: true,
		emptyText: i10n.translate('geosearch.list.nolocations'),
		loadingText: i10n.translate('loadingMsg'),
		itemCls: 'default-list-item',
		itemTpl: new Ext.XTemplate(
		'<tpl if="values.images && values.images.logo && values.images.logo.url">',
			'<div class="thumbnail" style="background-image: url(\'{[values.images.logo.url]}=s256\')"></div>',
		'</tpl>',
		'<div class="content">',
			'<tpl if="distance">',
				'<div class="distance">',
					'{[this.convertMeterToKM(values.distance)]}',
				'</div>',
			'</tpl>',
			'<div class="item-title">',
				'{name}',
			'</div>',			
			'<div class="item-sub-title">',
				'<tpl if="city">',				
					'{postcode} {city} ',
				'</tpl>',
				'<tpl if="address">',
					' {address}',				
				'</tpl>',
			'</div>',
		'</div>',
		{
			convertMeterToKM: function(distance) {
				var formatted;

				if(!distance || (typeof distance).toLowerCase() != 'number' || distance <= 0) {
					return '';
				}

				//get km
				formatted = (distance/1000).toPrecision(2) + 'km';
				return formatted;
			}
		}

		),		
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
				    	xtype: 'fixedbutton',
				    	align: 'right',
				    	text: '5km ' + i10n.translate('geosearch.radius'),
				    	action: 'select-radius'
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
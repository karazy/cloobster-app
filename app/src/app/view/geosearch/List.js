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
		cls: 'geosearch-list',
		scollToTopOnRefresh: true,
		emptyText: i10n.translate('geosearch.list.nolocations'),
		loadingText: i10n.translate('loadingMsg'),
		itemCls: 'default-list-item',
		itemTpl: new Ext.XTemplate(
		// '<tpl if="values.raw.images && values.raw.images.logo && values.raw.images.logo.url">',
			'<div class="thumbnail" style="background-image: url(\'{[this.getLogoUrl(values)]}=s256\')"></div>',
		// '</tpl>',
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
			getLogoUrl: function(location) {
				//TODO kinda ugly to query the store here
				var store = Ext.StoreManager.lookup('locationSearchStore'),
					complete;
				if(store) {
					complete = store.getById(location.id);
				}

				if(complete.raw.images && complete.raw.images.logo && complete.raw.images.logo.url) {
					return complete.raw.images.logo.url;
				}
				
				return "";
			},
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
				        xtype: 'selectfield',
				        align: 'right',
				        width: 100,
				        options: [
				            {text: '5km', value: '5000'},
				            {text: '10km',  value: '10000'},
				            {text: '20km',  value: '20000'},
				            {text: '10km',  value: '100000'}
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
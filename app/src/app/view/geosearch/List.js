/**
* The list displays the results of the geosearch.
*
*/
Ext.define('EatSense.view.geosearch.List', {
	extend: 'Ext.List',
	xtype: 'geosearchlist',
	requires: [],
	config: {
		store: 'businessStore',
		emptyText: i10n.translate('geosearch.list.nolocations'),
		itemTpl: new Ext.XTemplate('{name}'),
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
				        // label: 'Choose one',
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
/**
* The list displays the results of the geosearch.
*
*/
Ext.define('EatSense.view.geosearch.List', {
	extend: 'Ext.List',
	xtype: 'geosearchlist',
	requires: [],
	config: {
		itemTpl: new Ext.XTemplate('{name}'),
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: i10n.translate('geosearch.title'),
				store: 'businessStore',
				emptyText: i10n.translate('geosearch.list.nolocations'),
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
		]
	}
});
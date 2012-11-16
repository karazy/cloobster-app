Ext.define('EatSense.view.InfoPageCarousel', {
	extend: 'Ext.Panel',
	xtype: 'infopagecarousel',
	requires: ['Ext.carousel.Carousel'],
	config: {		
		layout: 'fit',
		items: [
			{
				xtype: 'titlebar',
				docked: 'top',
				title: i10n.translate('infopage.overview.detail'),
				items: [
					{
						xtype: 'backbutton'						
					}
				]
			},
			{
				xtype: 'carousel',
				scrollable: {
				    direction: 'horizontal'
				    // directionLock: true
				},
				indicator: false
			}
		]
		
	}
});
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
				items: [
					{
						xtype: 'backbutton'						
					}
				]
			},
			{
				xtype: 'carousel',
				// scrollable: {
				//     direction: 'horizontal'
				// },
				indicator: false
			}
		]
		
	}
});
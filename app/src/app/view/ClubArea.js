/**
* Acts as Container for ClubDashboard, Feedback, Requests etc.
* which are all found in the first tab of Lounge view.
* ClubDashboard is the first visible item after checkin.
*/
Ext.define('EatSense.view.ClubArea', {
	extend: 'Ext.Panel',
	requires: ['EatSense.view.ClubDashboard', 'EatSense.view.FeedbackForm', 'EatSense.view.InfoPageOverview'],
	xtype: 'clubarea',
	config: {
		iconCls : 'home',
		title: i10n.translate('clubdashboard.tab.title'),
		iconMask: true,
		layout: {
				type: 'card',
				animation : {
					type : 'slide',
					direction : 'left'
				}
		},
		activeItem: 0,
		items: [
			{
				xtype: 'clubdashboard'
			},
			{
				xtype: 'feedbackform'
			},
			{
				xtype: 'requeststab'
			},
			{
				xtype: 'infopageoverview'
			}
		]
	},
	/**
	* Change the direction of the slide animation.
	* 
	* @param direction
	*            left or right
	*/
	switchAnim : function(direction) {
		this.getLayout().setAnimation({
			type : 'slide',
			direction : direction
		});
	}
	
});
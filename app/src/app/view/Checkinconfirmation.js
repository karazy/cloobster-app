/**
 * Checkin Step 2 User has to confirm that he wants to checkin and has to choose
 * a nickname.
 */
Ext.define('EatSense.view.Checkinconfirmation', {
	extend : 'Ext.Panel',
	xtype : 'checkinconfirmation',
	requires: ['Ext.field.Toggle'],
	config : {
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'center'
		},
		items : [ {
			docked : 'top',
			xtype : 'toolbar',
			title : i10n.translate('checkin.confirm.title'),
			items : [{
				xtype : 'backbutton',
				action: 'cancel-checkin'
			}]
		}, 
		{
			xtype : 'label',
			itemId : 'checkInDlg1Label1',
			html : i10n.translate('checkInStep1Label1'),
			cls: 'checkin-confirm-nickname-label'
		}, 
		{
			xtype : 'textfield',
			itemId : 'nicknameTf',
			width : '80%',
			required : true,
			maxLength: 25,
			placeHolder: i10n.translate('checkin.nickname.palceholder'),
			cls: 'general-textfield'
		},  
		{
			xtype : 'panel',
			layout : {
				type : 'fit'
			},
			width : '80%',
			items : [ 
			{
				xtype : 'fixedbutton',
				action: 'confirm-checkin',
				text : i10n.translate('checkInStep1Button'),
				ui : 'action',	
				margin: '10 0 0 0'
				// flex: 1
			} ]
		},
		{
			xtype : 'togglefield',
			action : 'toggle-nickname',
			cls: 'checkin-confirm-nickname-toggle',
			labelCls: 'checkin-confirm-nickname-toggle-label',
			labelWidth: '70%',
			margin: '10 0 0 0',
			width: '80%',
			value : 0,
			label : i10n.translate('saveNicknameToggle')			
		}
		]
	},
	
	showLoadScreen : function(mask) {
		if (mask) {
			this.setMasked({
				message : i10n.translate('loadingMsg'),
				xtype : 'loadmask'
			});
		} else {
			this.setMasked(false);
		}
	}
});
/**
 * Checkin Step 2 User has to confirm that he wants to checkin and has to choose
 * a nickname.
 */
Ext.define('EatSense.view.Checkinconfirmation', {
	extend : 'Ext.Panel',
	xtype : 'checkinconfirmation',
	requires: ['Ext.field.Toggle'],
	config : {
		cls: 'dashboard',
		layout : {
			type : 'vbox',
			pack : 'center',
			align : 'center'
		},
		items : [ {
			docked : 'top',
			xtype : 'toolbar',
			title : i10n.translate('nickname'),
			items : [ {
				xtype : 'button',
				action: 'cancel-checkin',
				text : i10n.translate('back'),
				ui : 'back'
			}, ]
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
			cls: 'checkin-confirm-nickname-field'
		},  
		{
			xtype : 'panel',
			layout : {
				type : 'hbox'
			},
			items : [ {
				xtype : 'button',
				action: 'regenerate-nickname',
				text : i10n.translate('refreshNicknameBt'),
				// iconCls : 'refresh',
				// iconMask : true,
				style : 'margin-right:10px;',
				ui : 'action',
				margin : 5
			},
			{
				xtype : 'button',
				action: 'confirm-checkin',
				text : i10n.translate('checkInStep1Button'),
				ui : 'action',
				margin : 5
			} ]
		},
		{
			xtype : 'togglefield',
			action : 'toggle-nickname',
			cls: 'checkin-confirm-nickname-toggle',
			labelCls: 'checkin-confirm-nickname-toggle-label',
			labelAlign: 'top',
			html: i10n.translate('nicknameToggleHint'),
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
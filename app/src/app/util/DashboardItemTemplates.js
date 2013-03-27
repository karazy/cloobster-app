/**
* Provides templates for dasbhooard item configurations.
*/
Ext.define('EatSense.util.DashboardItemTemplates', {
	alternateClassName: ['dItemTpl'],
	requires: ['EatSense.util.Helper'],
	singleton: true,

		factory: function(brand) {
             // 'this' in static methods refer to the class itself
             return new this(brand);
         },
		//map of factory methods returning the filters
		infopages : function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-infopage',
					title: i10n.translate('clubdashboard.button.infopage'),
					text: i10n.translate('clubdashboard.button.infopage.text'),
					iconCls: 'info'
				}

				return tpl;
			},

			products : function() {
				var tpl = {
					xtype : 'tilebutton',
					action: 'show-menu',
					text: i10n.translate('clubdashboard.menu.text'),
					title: i10n.translate('menuTab'),
					iconCls: 'menu'
				}
				return tpl;
			},

			actions : function() {
					var tpl = {
						xtype : 'basictilebutton',
						action: 'show-requests',
						title: i10n.translate('clubdashboard.button.vip'),
						text: i10n.translate('clubdashboard.button.vip.text'),
						iconCls: 'vip',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
					}
					return tpl;
			},

			feedback : function() {
					var tpl = {
						xtype : 'basictilebutton',
						action: 'show-feedback',
						title: i10n.translate('clubdashboard.button.feedback'),
						text: i10n.translate('clubdashboard.button.feedback.text'),
						iconCls: 'feedback',
						welcomeFn: function() {
							Ext.Msg.alert(i10n.translate('clubdashboard.welcomespot.title'), i10n.translate('clubdashboard.welcomespot.text'));
						}
					}
				return tpl;
			},

			productsall : function() {
				var tpl = {
					xtype : 'dashboardteaser',
					store : 'productStore',
					// clearBeforeFiltering: true,
					filter: [
						function(item) {
							if(item.get('hideInDashboard') === false && item.get('special') === false) {
								return true;
							}
							return false;
					    }
					],
					type: 'products',
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
						'<div class="text-container">'+
							'<h3>{name}</h3>'+
							'<p>{shortDesc}</p>'+
						'</div>'+
						'<div class="teaser-icon menu-icon"></div>'
					)
					}
				return tpl;
			},

			productsspecial: function() {
				var tpl = {
					xtype : 'dashboardteaser',
					store : 'productStore',
					filter: [
							
						function(item) {
							if(item.get('hideInDashboard') === false) {
								return true;
							}
							return false;
					    }, 
						{
							property: 'special',
							value: true
						}
					],
					// clearBeforeFiltering: true,
					type: 'products',
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
						'<div class="text-container">'+
							'<h3>{name}</h3>'+
							'<p>{shortDesc}</p>'+									
						'</div>'+
						'<div class="teaser-icon star-icon"></div>'
					)
				}
				return tpl;
			},

			productsselected : function(entityIds) {
				var tpl = {
					xtype : 'dashboardteaser',
					store : 'productStore',
					filter: [
						function(item) {
							if(item.get('hideInDashboard') === false && item.get('special') === false) {
								return true;
							}
							return false;
					    },
					    function(item) {
					    	//TODO pass entity ids
			    			if(Ext.Array.contains(entityIds, item.get('id'))) {
			    				return true;
			    			}
			    		}
					],
					type: 'products',
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
						'<div class="text-container">'+
							'<h3>{name}</h3>'+
							'<p>{shortDesc}</p>'+									
						'</div>'+
						'<div class="teaser-icon star-icon"></div>'
					)
				}

				if(entityIds) {
					tpl.filter.push(
						function(item) {
							if(Ext.Array.contains(entityIds, item.get('id'))) {
							return true;
						}
					});
				}
				
				return tpl;
			},

			infopagesall : function() {
				var tpl = {
					xtype : 'dashboardteaser',
					type: 'infopages',
					store : 'infopageStore',
					filter: [
						function(item) {
							if(item.get('hideInDashboard') === false) {
								return true;
							}
							return false;
					    }
					],
					iconFit: true,
					tpl: new Ext.XTemplate(
						'<tpl if="imageUrl"><div class="thumbnail" style="background-image: url(\'{imageUrl}=s360\')"></div></tpl>'+
						'<div class="text-container">'+
							'<h3>{title}</h3>'+
							'<p>{shortText}</p>'+
						'</div>'+
						'<div class="teaser-icon info-icon"></div>'
					)
				}
				return tpl;
			},

	/**
	* Get template assigned to given config.
	* @param {EatSense.model.DashboardItem} config
	*	config to get template for
	* @return 
	*	Template or null when none was found
	*/
	getTemplate: function(config) {
		var tpl,
			type;

		if(!config) {
			console.log('EatSense.util.DashboardItemTemplates.getTemplate: no config');
			return;
		}

		type = config.get('type');
		//create template by calling the template function
		if(appHelper.isFunction(this[type])) {
			tpl = this[type](config.raw.entityIds);	
		} else {
			console.log('EatSense.util.DashboardItemTemplates.getTemplate: no template found for ' + type);
		}
		

		return tpl;
	}
});
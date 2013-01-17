/**
* 
*/
Ext.define('EatSense.view.components.TileButton', {
	extend: 'EatSense.view.components.BasicButton',
	xtype: 'tilebutton',
	requires: [],
	config: {

		/**
         * @cfg {String} text
         * The Button text.
         * @accessor
         */
        title: null,

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'tilebutton',

        /**
         * @cfg {Boolean} expandIcon
         * Set to true, to not shrink the image to fit the button size
         * @accessor
         */
        expandIcon: false,

        /**
         * @cfg {String} labelCls
         * The CSS class to add to the field's label element.
         * @accessor
         */
        labelCls: Ext.baseCSSPrefix + 'tilebutton-label',

        pressedCls: Ext.baseCSSPrefix + 'tilebutton-pressed',
		
	},
	template: [
		{
            tag: 'span',
            reference: 'tapMask',
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                boxSizing: 'content-box'
            }
        },
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'div',
            className: Ext.baseCSSPrefix + 'tilebutton-icon',
            reference: 'iconElement',
            hidden: true
        },
        {
            tag: 'div',
            reference: 'titleElement',
            className: Ext.baseCSSPrefix + 'tilebutton-title',
            hidden: true
        },
        {
            tag: 'div',
            reference: 'textElement',
            // className: Ext.baseCSSPrefix + 'tilebutton-text',
            hidden: true
        }
    ],

    /**
     * @private
     */
    updateTitle: function(text) {
        var titleElement = this.titleElement;
        if (titleElement) {
            if (text) {
                titleElement.show();
                titleElement.setHtml(text);
            }
            else {
                titleElement.hide();
            }
        }
    },

    updateExpandIcon: function(expand) {
    	var iconElement = this.iconElement;

    	if(iconElement) {
    		if(expand === true) {
    			iconElement.addCls('x-tilebutton-icon-expand');
    		} else {
    			iconElement.removeCls('x-tilebutton-icon-expand');
    		}
    	}
    }
});
/**
* 
*/
Ext.define('EatSense.view.components.TileButton', {
	// extend: 'GT.override.FixedButton',
    extend: 'Ext.Button',
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

        /**
         * @cfg {String} pressedCls
         * The CSS class to add to button in pressed mode.
         * @accessor
         */
        pressedCls: Ext.baseCSSPrefix + 'tilebutton-pressed',

        /**
         * @cfg {String} badgeCls
         * The CSS class for button badge.
         * @accessor
         */
        badgeCls: Ext.baseCSSPrefix + 'tilebutton-badge',

        /**
        * @cfg {String} iconAlign
        * @see Ext.Button
        */
        iconAlign: 'top',

        // cls: Ext.os.is.Android2 ? 'infopage-teaser' : ''
		
	},
	template: [
		//we have to provide this, since we override the template from GT.override.FixedButton
		// {
  //           tag: 'span',
  //           reference: 'tapMask',
  //           style: {
  //               position: 'absolute',
  //               width: '100%',
  //               height: '100%',
  //               boxSizing: 'content-box'
  //           }
  //       },
        {
            tag: 'span',
            reference: 'badgeElement',
            className: Ext.baseCSSPrefix + 'tilebutton-badge',
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
    /**
    * @private
    */
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
/**
* Overrides default Ext.MessageBox.
* Accepts a nohide config on buttons to prevent hiding
* of MsgBox after tap event.
*/
Ext.define('EatSense.override.MessageBox', {
    // Support dontHide configuration property for Button
    override: 'Ext.MessageBox',
    onClick: function (button) {
        var nohide = false;

        if (button) {
            var config = button.config.userConfig || {},
            initialConfig = button.getInitialConfig(),
            prompt = this.getPrompt();

            //if this is a nohide button execute the function
            if(typeof config.fn == 'function' && button.config.nohide) {
                nohide = true;
                config.fn.call(
                    config.scope || null,
                    initialConfig.itemId || initialConfig.text,
                    prompt ? prompt.getValue() : null,
                    config
                );
            }

            if (typeof config.fn == 'function' && !button.config.nohide) {
                this.on({
                    hiddenchange: function () {
                    config.fn.call(
                        config.scope || null,
                        initialConfig.itemId || initialConfig.text,
                        prompt ? prompt.getValue() : null,
                        config
                    );
                    },
                    single: true,
                    scope: this
                });
            }

            if (config.input) {
                if(config.input.dom) {
                    config.input.dom.blur();    
                } else {
                    console.log('EatSense.override.MessageBox.onClick: no dom found on input');
                }
                
            }
        }

        //only hide if fnReturn is true
        if (!nohide) {
            this.hide();
        }
    }

});
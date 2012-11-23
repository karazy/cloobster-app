/**
* Overrides default Ext.MessageBox.
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
            if(button.config.nohide) {
                nohide = true;
                config.fn.call(
                    config.scope || null,
                    initialConfig.itemId || initialConfig.text,
                    prompt ? prompt.getValue() : null,
                    config
                );
            }

            if (typeof config.fn == 'function' && !button.nohide) {
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
                config.input.dom.blur();
            }
        }

        //only hide if fnReturn is true
        if (!nohide) {
            this.hide();
        }
    }

});
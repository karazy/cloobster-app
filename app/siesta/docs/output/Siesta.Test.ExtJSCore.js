Ext.data.JsonP.Siesta_Test_ExtJSCore({"tagname":"class","name":"Siesta.Test.ExtJSCore","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-Siesta.Test.ExtJSCore","members":{"cfg":[],"property":[],"method":[{"name":"Ext","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-Ext"},{"name":"clickCQ","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-clickCQ"},{"name":"clickComponentQuery","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-clickComponentQuery"},{"name":"compToEl","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{"private":true},"id":"method-compToEl"},{"name":"compositeQuery","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-compositeQuery"},{"name":"cq","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-cq"},{"name":"cq1","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-cq1"},{"name":"getExt","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-getExt"},{"name":"knownBugIn","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-knownBugIn"},{"name":"requireOk","tagname":"method","owner":"Siesta.Test.ExtJSCore","meta":{},"id":"method-requireOk"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":9,"files":[{"filename":"ExtJSCore.js","href":"ExtJSCore.html#Siesta-Test-ExtJSCore"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":["Siesta.Test.ExtJS","Siesta.Test.SenchaTouch"],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixed into</h4><div class='dependency'><a href='#!/api/Siesta.Test.ExtJS' rel='Siesta.Test.ExtJS' class='docClass'>Siesta.Test.ExtJS</a></div><div class='dependency'><a href='#!/api/Siesta.Test.SenchaTouch' rel='Siesta.Test.SenchaTouch' class='docClass'>Siesta.Test.SenchaTouch</a></div><h4>Files</h4><div class='dependency'><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore' target='_blank'>ExtJSCore.js</a></div></pre><div class='doc-contents'><p>A base mixin for testing ExtJS and SenchaTouch applications.</p>\n\n<p>Contains testing functionality that is common for both frameworks.</p>\n\n<p>This file is a reference only, for a getting start guide and manual, please refer to <a href=\"#!/guide/siesta_getting_started\">Getting Started Guide</a>.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-Ext' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-Ext' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-Ext' class='name expandable'>Ext</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>The alias for getExt ...</div><div class='long'><p>The alias for <a href=\"#!/api/Siesta.Test.ExtJSCore-method-getExt\" rel=\"Siesta.Test.ExtJSCore-method-getExt\" class=\"docClass\">getExt</a></p>\n</div></div></div><div id='method-clickCQ' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-clickCQ' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-clickCQ' class='name expandable'>clickCQ</a>( <span class='pre'>selector, root, callback</span> )</div><div class='description'><div class='short'>An alias for clickComponentQuery. ...</div><div class='long'><p>An alias for <a href=\"#!/api/Siesta.Test.ExtJSCore-method-clickComponentQuery\" rel=\"Siesta.Test.ExtJSCore-method-clickComponentQuery\" class=\"docClass\">clickComponentQuery</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>The selector to perform a component query with</p>\n</div></li><li><span class='pre'>root</span> : Ext.Container<div class='sub-desc'><p>The optional root container to start a query from.</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>The callback to call, after clicking all the found components</p>\n</div></li></ul></div></div></div><div id='method-clickComponentQuery' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-clickComponentQuery' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-clickComponentQuery' class='name expandable'>clickComponentQuery</a>( <span class='pre'>selector, root, callback</span> )</div><div class='description'><div class='short'>This method is a simple wrapper around the chainClick - it performs a component query for provided selector starting ...</div><div class='long'><p>This method is a simple wrapper around the chainClick - it performs a component query for provided <code>selector</code> starting from the <code>root</code> container\nand then clicks on all found components, in order:</p>\n\n<pre><code>// click all buttons in the `panel`\nt.clickComponentQuery('button', panel, function () {})\n</code></pre>\n\n<p>The 2nd argument for this method can be omitted and method can be called with 2 arguments only. In this case a global component query will be performed:</p>\n\n<pre><code>// click all buttons in the application\nt.clickComponentQuery('button', function () {})\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>The selector to perform a component query with</p>\n</div></li><li><span class='pre'>root</span> : Ext.Container<div class='sub-desc'><p>The optional root container to start a query from.</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>The callback to call, after clicking all the found components</p>\n</div></li></ul></div></div></div><div id='method-compToEl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-compToEl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-compToEl' class='name expandable'>compToEl</a>( <span class='pre'>comp, locateInputEl</span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>comp</span> : Ext.Component<div class='sub-desc'><p>the Ext.Component</p>\n</div></li><li><span class='pre'>locateInputEl</span> : Boolean<div class='sub-desc'><p>For form fields, try to find the inner input element by default.</p>\n\n<pre><code>             If you want to target the containing Component element, pass false instead.\n</code></pre>\n\n<p>@return {*}</p>\n</div></li></ul></div></div></div><div id='method-compositeQuery' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-compositeQuery' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-compositeQuery' class='name expandable'>compositeQuery</a>( <span class='pre'>selector, root, allowEmpty</span> ) : HTMLElement[]</div><div class='description'><div class='short'>This method performs a combination of Ext.ComponentQuery and DOM query, allowing to easily find the DOM elements,\nmat...</div><div class='long'><p>This method performs a combination of <code>Ext.ComponentQuery</code> and DOM query, allowing to easily find the DOM elements,\nmatching a css selector, inside of some Ext.Component.</p>\n\n<p>Both queries should be combined with the <code>=&gt;</code> separator:</p>\n\n<pre><code> gridpanel[title=Accounts] =&gt; .x-grid-row\n</code></pre>\n\n<p>On the left side of such \"composite\" query should be a component query, on the right - DOM query (CSS selector)</p>\n\n<p>This method will generate exception, if component query returns no results. In case when component query returns more than one\ncomponent, method will generate a warning and proceed with the 1st found component. The exception/warning can be suppressed with the \"allowEmpty\" argument.</p>\n\n<p>E.g. the composite query <code>gridpanel[title=Accounts] =&gt; .x-grid-row</code> will give you the grid row elements inside a certain grid panel</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>The CompositeQuery selector</p>\n</div></li><li><span class='pre'>root</span> : Ext.Component<div class='sub-desc'><p>The optional root component to start the component query from. If omitted, global component query will be performed.</p>\n</div></li><li><span class='pre'>allowEmpty</span> : Boolean<div class='sub-desc'><p>True to suppress the exception/warnings from this method if no match is found. Default is <code>false</code>.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>HTMLElement[]</span><div class='sub-desc'><p>The array of DOM elements</p>\n</div></li></ul></div></div></div><div id='method-cq' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-cq' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-cq' class='name expandable'>cq</a>( <span class='pre'>selector</span> )</div><div class='description'><div class='short'>An alias for Ext.ComponentQuery.query ...</div><div class='long'><p>An alias for Ext.ComponentQuery.query</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>The selector to perform a component query with</p>\n</div></li></ul></div></div></div><div id='method-cq1' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-cq1' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-cq1' class='name expandable'>cq1</a>( <span class='pre'>selector</span> )</div><div class='description'><div class='short'>An shorthand method to get the first result of any Ext.ComponentQuery.query ...</div><div class='long'><p>An shorthand method to get the first result of any Ext.ComponentQuery.query</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>selector</span> : String<div class='sub-desc'><p>The selector to perform a component query with</p>\n</div></li></ul></div></div></div><div id='method-getExt' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-getExt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-getExt' class='name expandable'>getExt</a>( <span class='pre'></span> ) : Object</div><div class='description'><div class='short'>This method returns the Ext object from the scope of the test. ...</div><div class='long'><p>This method returns the <code>Ext</code> object from the scope of the test. When creating your own assertions for Ext JS code, you need\nto make sure you are using this method to get the <code>Ext</code> instance. Otherwise, you'll be using the same \"top-level\" <code>Ext</code>\ninstance, used by the harness for its UI.</p>\n\n<p>For example:</p>\n\n<pre><code> elementHasProvidedCssClass : function (el, cls, desc) {\n     var Ext     = this.getExt();\n\n     if (Ext.fly(el).hasCls(cls)) {\n         this.pass(desc);\n     } else {\n         this.fail(desc);\n     }\n }\n</code></pre>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>The <code>Ext</code> object from the scope of test</p>\n</div></li></ul></div></div></div><div id='method-knownBugIn' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-knownBugIn' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-knownBugIn' class='name expandable'>knownBugIn</a>( <span class='pre'>frameworkVersion, fn, reason</span> )</div><div class='description'><div class='short'>This method allow assertions to fail silently for tests executed in versions of Ext JS up to a certain release. ...</div><div class='long'><p>This method allow assertions to fail silently for tests executed in versions of Ext JS up to a certain release. When you try to run this test on a newer\nversion of Ext JS and it fails, it will fail properly and force you to re-investigate. If it passes in the newer version, you should remove the\nuse of this method.</p>\n\n<p>See also <a href=\"#!/api/Siesta.Test-method-todo\" rel=\"Siesta.Test-method-todo\" class=\"docClass\">Siesta.Test.todo</a></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>frameworkVersion</span> : String<div class='sub-desc'><p>The Ext JS framework version, e.g. '4.0.7'</p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The method covering the broken functionality</p>\n</div></li><li><span class='pre'>reason</span> : String<div class='sub-desc'><p>The reason or explanation of the bug</p>\n</div></li></ul></div></div></div><div id='method-requireOk' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.ExtJSCore'>Siesta.Test.ExtJSCore</span><br/><a href='source/ExtJSCore.html#Siesta-Test-ExtJSCore-method-requireOk' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.ExtJSCore-method-requireOk' class='name expandable'>requireOk</a>( <span class='pre'>className1, className2, classNameN, fn</span> )</div><div class='description'><div class='short'>This method will load the specified classes with Ext.require() and call the provided callback. ...</div><div class='long'><p>This method will load the specified classes with <code>Ext.require()</code> and call the provided callback. Additionally it will check that all classes have been loaded.</p>\n\n<p>This method accepts either variable number of arguments:</p>\n\n<pre><code> t.requireOk('Some.Class1', 'Some.Class2', function () { ... })\n</code></pre>\n\n<p>or array of class names:</p>\n\n<pre><code> t.requireOk([ 'Some.Class1', 'Some.Class2' ], function () { ... })\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>className1</span> : String<div class='sub-desc'><p>The name of the class to <code>require</code></p>\n</div></li><li><span class='pre'>className2</span> : String<div class='sub-desc'><p>The name of the class to <code>require</code></p>\n</div></li><li><span class='pre'>classNameN</span> : String<div class='sub-desc'><p>The name of the class to <code>require</code></p>\n</div></li><li><span class='pre'>fn</span> : Function<div class='sub-desc'><p>The callback. Will be called even if the loading of some classes have failed.</p>\n</div></li></ul></div></div></div></div></div></div></div>"});
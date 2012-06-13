module("jBuilder");

test("jQuery.jBuilder.extend Test", function() {
	jQuery.jBuilder.extend("dummy.test", {
	    alias : "dummyTest",

	    doLayout : function() {
	        return "OK";
	    }
	});
	
	ok(jQuery.jBuilder.aliases.dummyTest !== undefined, "Creating dummyTest alias");
	ok(jQuery.jBuilder.dummy.constructor == Object, "Plugin path exists");
	ok(jQuery.isFunction(jQuery.jBuilder.dummy.test), "Plugin function exists");
	
	var dummyTest = new jQuery.jBuilder.dummy.test({});
	ok(jQuery.isFunction(dummyTest.doLayout), "Plugin has doLayout function");
	ok(dummyTest.doLayout() == "OK", "Plugin returns OK");
});

test("jQuery.jBuilder.doLayout Test", function() {
	var jsonForm = [{
		type : "form",
		items : [{
			label : "Test Input",
			type : "textfield"
		}]
	}];
	
	var html = jQuery.jBuilder.doLayout(jsonForm);
	ok(true, "Data : " + html);
	ok(html.length > 0, "HTML has content");
	ok(html.indexOf("<form") != -1, "Checking for form");
	ok(html.indexOf("textfield") != -1, "Checking for textfield");
	ok(html.indexOf("Test Input") != -1, "Checking for textfield label");
});
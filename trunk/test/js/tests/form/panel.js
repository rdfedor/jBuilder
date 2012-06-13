module("jBuilder.form");
test("jBuilder.form.panel", function() {
	var test1;
    raises(function() {
        new jQuery.jBuilder.form.panel({
            id : "testForm",
            method : "POST"
        })
    }, "Check for noElement error");
	
	test1 = new jQuery.jBuilder.form.panel({
		id : "testIDForm",
		method : "POST",
		name : 'testNameForm',
		items : []
	});
	
	ok(test1.constructor.toString().indexOf("function") != -1, "Check if form panel initialized");
	
	var html = test1.doLayout();
	ok(true, "Data : " + html);
	ok(html.constructor == String, "Check that doLayout returned a string");
	ok(html.indexOf("id") != -1 && html.indexOf("testIDForm") != -1, "Check that testIDForm was inserted");
	ok(html.indexOf("method") != -1 && html.indexOf("POST") != -1, "Check that POST method was inserted");
	ok(html.indexOf("name") != -1 && html.indexOf("testNameForm") != -1, "Check that name and testNameForm was inserted");
	
});
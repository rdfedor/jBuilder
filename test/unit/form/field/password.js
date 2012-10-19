/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

module("jBuilder.form");

test("jBuilder.form.field.password", function() {
    var password = new jQuery.jBuilder.form.field.password({
        id : "testPasswordField",
        'class' : "testClass",
        label : "Test Label",
        value : "Test Value",
        title : "Test Title",
        tabindex : 2
    });
    var html = password.doLayout()[0].outerHTML;

    ok(true, "Data : " + html);
    ok(html.indexOf("id=\"testPasswordField\"") !== -1, "Check for id and testPasswordField");
    ok(html.indexOf("type=\"password\"") !== -1, "Check for password type");
    ok(html.indexOf("testClass") !== -1, "Check for class and testClass");
    ok(html.indexOf("Test Label") !== -1, "Check for Test Label");
    ok(html.indexOf("value=\"Test Value\"") !== -1, "Check for Test Value");
    ok(html.indexOf("title=\"Test Title\"") !== -1, "Check for Test Title");
    ok(html.indexOf("tabindex=\"2\"") !== -1, "Check for TabIndex");
});
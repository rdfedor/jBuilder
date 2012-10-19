/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

module("jBuilder.form");

test("jBuilder.form.field.number", function() {
    var htmlObject, inputObject;
    
    htmlObject = jQuery.jBuilder.doLayout({
        type : "number",
        id : "number_field",
        'class' : "testClass",
        label : "Test Label",
        tabindex : 2
    });
    
    htmlObject.trigger("onRender");
    inputObject = htmlObject.find("input");
    
    ok(htmlObject.hasClass("testClass"), "Found testClass");
    ok(inputObject.length === 1, "Found input element");
    ok(inputObject.attr("tabindex") === "2", "Found tabindex");
    ok(inputObject.attr("role") === "spinbutton", "Spinner active");
});

module("jBuilder.form");
test("jBuilder.form.field.textfield", function() {
    var textfield = new jQuery.jBuilder.form.field.textfield({
        id : "testTextField",
        class : "testClass",
        label : "Test Label",
        value : "Test Value",
        title : "Test Title",
        tabindex : 2
    });

    var html = textfield.doLayout()[0].outerHTML;

    ok(true, "Data : " + html);
    ok(html.indexOf("type=\"textfield\"") != -1, "Check for textfield type");
    ok(html.indexOf("id=\"testTextField\"") != -1, "Check for id and testTextField");
    ok(html.indexOf("testClass") != -1, "Check for class and testClass");
    ok(html.indexOf("Test Label") != -1, "Check for Test Label");
    ok(html.indexOf("value=\"Test Value\"") != -1, "Check for Test Value");
    ok(html.indexOf("title=\"Test Title\"") != -1, "Check for Test Title");
    ok(html.indexOf("tabindex=\"2\"") != -1, "Check for TabIndex");
});
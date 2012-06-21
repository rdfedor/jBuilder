module("jBuilder.form");
test("jBuilder.form.field.checkbox", function() {
    raises(function() {
        new jQuery.jBuilder.form.field.checkbox({})
    }, "Check for noElement error");

    var checkbox = new jQuery.jBuilder.form.field.checkbox({
        id : "testDropDown",
        class : "testClass",
        label : "Test Label",
        tabindex : 2,
        items : [
            {label : "Opt 1", tabindex: 1},
            {label : "Opt 2", value : 2, tabindex: 2},
            {label : "Opt 3", value : 3, selected : true, tabindex: 3},
            {label : "Opt 4", disabled : true, tabindex: 4}
        ]
    });

    var html = checkbox.doLayout()[0].outerHTML;

    ok(true, "Data : " + html);
    ok(html.indexOf("id=\"testDropDown\"") != -1, "Check for id");
    ok(html.indexOf("testClass") != -1, "Check for class");
    ok(html.indexOf("Test Label") != -1, "Check for label");
    ok(html.indexOf("tabindex=\"2\"") != -1, "Check for tabindex");
    ok(html.indexOf("value=\"Opt 1\" tabindex=\"1\">") != -1, "Check for option 1 HTML");
    ok(html.indexOf("value=\"2\" tabindex=\"2\"") != -1, "Check for option 2 HTML");
    ok(html.indexOf("value=\"3\" tabindex=\"3\">") != -1, "Check for option 3 HTML");
    ok(html.indexOf("value=\"Opt 4\" tabindex=\"4\" disabled=\"disabled\">") != -1, "Check for option 4 HTML");
});
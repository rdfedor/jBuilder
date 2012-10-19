/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

module("jBuilder.form");

test("jBuilder.form.field.select", function() {
    raises(function() {
        new jQuery.jBuilder.form.field.select({});
    }, "Check for noElement error");

    var select = new jQuery.jBuilder.form.field.select({
        id : "testSelect",
        'class' : "testClass",
        label : "Test Label",
        title : "Test Title",
        tabindex : 2,
        items : [
            {label : "Opt 1"},
            {label : "Opt 2", value : 2},
            {label : "Opt 3", value : 3, selected : true},
            {label : "Opt 4", disabled : true}
        ]
    });
    var html = select.doLayout()[0].outerHTML;

    ok(true, "Data : " + html);
    ok(html.indexOf("id=\"testSelect\"") !== -1, "Check for id");
    ok(html.indexOf("testClass") !== -1, "Check for class");
    ok(html.indexOf("Test Label") !== -1, "Check for label");
    ok(html.indexOf("title=\"Test Title\"") !== -1, "Check for title");
    ok(html.indexOf("tabindex=\"2\"") !== -1, "Check for tabindex");
    ok(html.indexOf("<option label=\"Opt 1\">Opt 1</option>") !== -1, "Check for option 1 HTML");
    ok(html.indexOf("<option label=\"Opt 2\" value=\"2\">Opt 2</option>") !== -1, "Check for option 2 HTML");
    ok(html.indexOf("<option label=\"Opt 3\" value=\"3\" selected=\"selected\">Opt 3</option>") !== -1, "Check for option 3 HTML");
    ok(html.indexOf("<option label=\"Opt 4\" disabled=\"disabled\">Opt 4</option>") !== -1, "Check for option 4 HTML");
});
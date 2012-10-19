/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

module("jBuilder.form");

test("jBuilder.form.field.checkbox", function() {
    var htmlObject, inputFields;
    
    raises(function() {
        jQuery.jB.doLayout({});
    }, "Check for noElement error");
    
    htmlObject = jQuery.jB.doLayout({
        type : "checkbox",
        id : "testDropDown",
        'class' : "testClass",
        label : "Test Label",
        items : [
            {label : "Opt 1", tabindex: 1},
            {label : "Opt 2", value : 2, tabindex: 2},
            {label : "Opt 3", value : 3, checked : true, tabindex: 3},
            {label : "Opt 4", disabled : true, tabindex: 4}
        ]
    });
    
    inputFields = htmlObject.find("input");
    
    ok(htmlObject.attr("id") === "testDropDown", "Found id element");
    ok(htmlObject.hasClass("testClass"), "Found testClass");
    ok(htmlObject.find(">:first-child").hasClass("fieldLabel"), "Found field label");
    ok(inputFields.eq(0).attr("tabindex") === "1", "Tabindex of 1st option set to 1");
    ok(inputFields.eq(1).attr("value") === "2", "Value of 2nd option set to 2");
    ok(inputFields.eq(1).attr("tabindex") === "2", "Tabindex of 2nd option set to 2");
    ok(inputFields.eq(2).attr("value") === "3", "Value of 3rd option set to 3");
    ok(inputFields.eq(2).attr("tabindex") === "3", "Tabindex of 3nd option set to 3");
    ok(inputFields.eq(2).is(":checked") === true, "Selected of 3rd option set to true");
    ok(inputFields.eq(3).attr("tabindex") === "4", "Tabindex of 4th option set to 4");
    ok(inputFields.eq(3).is(":disabled") === true, "Disabled of 4th option set to true");
});
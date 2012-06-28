(function($){
    $.jB.namespace("$.jB.util.validator");
    $.extend($.jB.util.validator, {
        rules : {
            email : /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            url : /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
            int : /[\d]+/
        },
        validate : function(cmp) {
            var defaults = {
                allowBlank : true,
                validator : "",
                minChar : -1,
                maxChar : -1
            };
            var settings = $.jB.util.intersect(defaults,cmp);
            settings = $.extend({},defaults,settings);

            var field = cmp.element.find("input").removeClass("ui-state-ok").removeClass("ui-state-error");
            /*
            function updateTips( o, t ) {

                o.title( t ).addClass( "ui-state-highlight" );
                setTimeout(function() {
                    o.removeClass( "ui-state-highlight", 1500 );
                }, 500 );
            }
            */

            function checkRegExp(o, regex, m) {
                if ( !( regex.test( o.val() ) ) ) {
                    o.addClass( "ui-state-error" );
                    //updateTips( n );
                    return false;
                }
                return true;
            }

            function OK(o,c,m) {
                if (!c) {
                    o.addClass( "ui-state-error" );
                    //updateTips( n );
                    return false;
                }
                return true;
            }

            var result = true;

            if (!settings.allowBlank) {
                result = result && OK(field,field.val().length != 0, "Must have a value");
                if (!result) {
                    return result;
                }
            }

            if (result && $.jB.util.validator.rules[settings.validator] !== undefined) {
                result = result && checkRegExp(field,$.jB.util.validator.rules[cmp.validator], "Must be a valid " + cmp.validator);
            }

            if (result && settings.minChar != -1) {
                result = result && OK(field,field.val().length >= cmp.minChar, "Must be no less than " + cmp.minChar + " characters");
            }

            if (result && settings.maxChar != -1) {
                result = result && OK(field,field.val().length <= cmp.maxChar, "Must be no more than " + cmp.maxChar + " characters");
            }

            if (result) {
                field.addClass("ui-state-ok");
            }

            return result;
        }

    });
})(jQuery);
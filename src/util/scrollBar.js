(function($) {
    $.jB.namespace("$.jB.util");
    $.extend($.jB.util, {
        scrollBar : function(target,params) {
            var settings = {
                marginOffset : 10,
                topOffset : 15,
                heightOffset : -5,
                rightOffset : 4
            };
            settings = $.extend({},settings, params);

            var bodyContainer = target.find(".jBContent");
            var body = $(bodyContainer.children()[0]);

            if (body.height() > bodyContainer.height()) {
                bodyContainer.parent().css({position : "relative"});
                body.css({paddingRight : 15});
                var moveWindow = function( event, ui ) {
                    if ( body.height() > bodyContainer.height() ) {
                        body.css( "margin-top", Math.round(
                            (100 - ui.value) / 100 * ( bodyContainer.height() - body.height() + settings.marginOffset )
                        ) + "px" );
                    } else {
                        body.css( "margin-top", 0 );
                    }
                };
                var slider = $("<div>").css({position:"absolute", top : settings.topOffset, right : settings.rightOffset, height: bodyContainer.height() - settings.heightOffset}).slider({
                    orientation : "vertical",
                    value : 100,
                    change : moveWindow,
                    slide: moveWindow
                }).appendTo(bodyContainer.parent());
                bodyContainer.mousewheel(function(e, delta) {
                    slider.slider("value", slider.slider("value") + (delta * 5));
                    return false;
                });
            }
        }
    });
})(jQuery);
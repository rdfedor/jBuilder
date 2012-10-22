(function($) {
    $.jB.extend("layout.border", {
        layout : "border",

        regions : {},
        regionHTML : {},

        init : function() {
            var that = this;

            this.element = jQuery("<div>").css({
                display: "block",
                height : "100%",
                width : "100%",
                position: "absolute",
                top : 0,
                left : 0
            });

            $.each(this.items, function(index,value) {
                var obj = $.jB.util.filter(['region'],value);
                that.regions[value.region] = obj;
                that.regionHTML[value.region] = jQuery("<div>").attr("class","ui-layout-" + value.region).css($.jB.util.intersect(['width','height'],obj));
            });

            if (this.regions.center === undefined) {
                throw new Error("Center region is not defined in border layout");
            }

            $(window).resize(function() {
                that.runViewportPositioning.call(that);
            });
        },

        events : {
            onResize : function(e) {
                var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
                cmp.runViewportPositioning.call(cmp);
                $.jB.util.events.triggerChildEvents("onResize",cmp.element.children());
                e.stopPropagation();
            },
            onRender : function(e) {
                var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
                cmp.runViewportPositioning.call(cmp);
                $.jB.util.events.triggerChildEvents("onRender",cmp.element.children());
                e.stopPropagation();
            }
        },

        runViewportPositioning : function() {
            var viewportSize = this.getViewportSize(),
                that = this;
            if (this.regionHTML.north !== undefined) {
                this.calculateNorthPosition(viewportSize);
            }

            if (this.regionHTML.south !== undefined) {
                this.calculateSouthPosition(viewportSize);
            }

            if (this.regionHTML.east !== undefined) {
                this.calculateEastPosition(viewportSize);
            }

            if (this.regionHTML.west !== undefined) {
                this.calculateWestPosition(viewportSize);
            }

            if (this.regionHTML.center !== undefined) {
                this.calculateCenterPosition(viewportSize);
            }

            $.each(this.regions, function(index,value) {
                var extendProps = {
                    height : that.regionHTML[index].height(),
                    width : that.regionHTML[index].width()
                };

                var objCmp = that.regionHTML[index].children();
                if (objCmp.length > 0) {
                    objCmp = $.jB.getCmp($.jB.util.getJBID(objCmp));
                    if (objCmp.events !== undefined && objCmp.events.onResize !== undefined) {
                        $.extend(objCmp,extendProps);
                        that.regionHTML[index].children().trigger('onResize');
                        return;
                    }
                }
                that.regionHTML[index] = that.regionHTML[index].html($.jB.doLayout($.extend({}, value, extendProps)).css({padding : 0, margin : 0}));

            });
        },

        doLayout : function() {
            var that = this;

            $.each(this.regionHTML, function(index,value) {
                that.element.append(value);
            });

            this.buildClassAttr();
            return this.element;
        },

        getViewportSize : function() {
            /*
            var e = window
                , a = 'inner';
            if ( !( 'innerWidth' in window ) )
            {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width : e[ a+'Width' ], height : e[ a+'Height' ]}
            */
            return {height : this.element.height(), width: this.element.width()};
        },

        calculateNorthPosition : function(doc) {
            var obj = this.regionHTML.north;
            var height = obj.height();
            var width = obj.width();

            var css = {
                position : "absolute",
                top : 5,
                left : 5,
                width : doc.width - 10
            };

            obj.css(css);
        },

        calculateSouthPosition : function(doc) {
            var obj = this.regionHTML.south;

            var css = {
                position : "absolute",
                bottom : 5,
                left : 5,
                width : doc.width - 10
            };

            obj.css(css);
        },

        calculateWestPosition : function(doc) {
            var obj = this.regionHTML.west;

            var css = {
                position : "absolute",
                left : 5,
                top : 5,
                height : doc.height - 10
            };
            var objHeight = 0;
            if (this.regionHTML.north !== undefined) {
                objHeight = this.regionHTML.north.height() + 5;
                css.top += objHeight;
                css.height -= objHeight;
            }

            if (this.regionHTML.south !== undefined) {
                objHeight = this.regionHTML.south.height() + 5;
                css.height -= objHeight;
            }

            obj.css(css);
        },

        calculateEastPosition : function(doc) {
            var obj = this.regionHTML.east;

            var css = {
                position : "absolute",
                right : 5,
                top : 5,
                height : doc.height - 10
            };

            var objHeight = 0;
            if (this.regionHTML.north !== undefined) {
                objHeight = this.regionHTML.north.height() + 5;
                css.top += objHeight;
                css.height -= objHeight;
            }

            if (this.regionHTML.south !== undefined) {
                objHeight = this.regionHTML.south.height() + 5;
                css.height -= objHeight;
            }

            obj.css(css);
        },

        calculateCenterPosition : function(doc) {
            var obj = this.regionHTML.center;

            var css = {
                position : "absolute",
                left : 5,
                top : 5,
                height : doc.height - 10,
                width : doc.width - 10
            };

            var objHeight = 0;
            var objWidth = 0;
            if (this.regionHTML.north !== undefined) {
                objHeight = this.regionHTML.north.height() + 5;
                css.top += objHeight;
                css.height -= objHeight;
            }

            if (this.regionHTML.south !== undefined) {
                objHeight = this.regionHTML.south.height() + 5;
                css.height -= objHeight;
            }

            if (this.regionHTML.west !== undefined) {
                objWidth = this.regionHTML.west.width() + 5;
                css.left += objWidth;
                css.width -= objWidth;
            }

            if (this.regionHTML.east !== undefined) {
                objWidth = this.regionHTML.east.width() + 5;
                css.width -= objWidth;
            }

            obj.css(css);
        }
    });

})(jQuery);
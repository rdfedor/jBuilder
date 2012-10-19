/*! jBuilder - v0.1.0 - 2012-10-19
* https://github.com/Nemesis9765/jBuilder
* Copyright (c) 2012 Roger Fedor; Licensed MIT */

(function($){
$.extend({
	jBuilder : {
        elements : {},
		aliases : {},
        layoutAlias : {},

        // Our custom loading function for adding new functionality to the jB core
		extend : function(classPath, params) {
            // Navigate through the classPath structure
			var path = classPath.split("."),
                next = $.jB,
                className = path[path.length - 1],
                x;

            for (x = 0 ; x < path.length - 1 ; x = x + 1) {
                if (next[path[x]] === undefined) {
                    next[path[x]] = {};
                }
                next = next[path[x]];
            }

            // Check to see whether or not the class already exists
            if (next[className] !== undefined) {
                throw new Error(className + " already exists");
            }

            // Check to see if the alias or layout alias already exists
            if (params.alias && params.layout === undefined) {
                if (this.aliases[params.alias] !== undefined) {
                    throw new Error(className + " alias already exists");
                }
                this.aliases[params.alias] = classPath;
            } else if (params.alias === undefined && params.layout) {
                if (this.layoutAlias[params.layout] !== undefined) {
                    throw new Error(className + " layout already exists");
                }
                this.layoutAlias[params.layout] = classPath;
            }

            // Create the function to instantiate a new plugin
            next[className] = function(cfg) {
                var that = this,
                    newParams = $.extend(true, {},params),
                    path,next,className,x,newClass;

                // Combine this object with some default functions
                $.extend(this, $.jB.util.defaultPluginFunctions);

                // Check to see if we're extending another, already existing, plugin
                if (newParams.extend !== undefined) {
                    path = newParams.extend.split(".");
                    next = $.jB;
                    className = path[path.length - 1];

                    for (x = 0 ; x < path.length - 1 ; x = x + 1) {
                        if (next[path[x]] === undefined) {
                            next[path[x]] = {};
                        }
                        next = next[path[x]];
                    }
                    newClass = new next[className](cfg);
                    newParams = $.extend({},newClass,newParams,{parent : newClass});
                }

                if (newParams.ref !== undefined && newParams.ref.constructor === Object) {
                    $.each(newParams.ref,function(index,value) {
                        var funcName = index.charAt(0).toUpperCase + index.slice(1);
                        that["get" + funcName] = function() {
                            return $(value,that.element).find(value);
                        };

                    });
                }

                // Create a unique id for this new element
                this.eleID = $.jB.util.generateUID();

                // Store this to be retrieved later on
                $.jB.elements[this.eleID] = this;

                // Combine the plugin into this object along with the new config passed via parameters
                $.extend(true, this,newParams,cfg, {cfg : cfg});
                // Check if the plugin has an init function and run it
                if ($.isFunction(this.init)) {
                    this.init();
                }
            };
		},
        // Converts a JSON form into HTML and renders it at a specific location
        build : function(obj) {
            // Convert our JSON to HTML
            var html = this.doLayout(obj),
                target;

            // Check to see if we have a renderTo variable set to say where we want the code
            target = null;
            /** @namespace obj.renderTo */
            if (obj.renderTo === undefined) {
                // renderTo was not set so store it in the body
                if (document.body !== null) {
                    target = $("body",document);
                } else {
                    target = $("body",document.documentElement);
                }
            } else {
                // renderTo was set so store the HTML in the appropriate location
                if (obj.renderTo.constructor === String) {
                    target = $("#" + obj.renderTo);
                } else if (obj.renderTo.constructor === $) {
                    target = obj.renderTo;
                } else {
                    throw new Error("renderTo is an unknown object");
                }
            }

            target.html(html);

            $.jB.util.events.triggerChildEvents("onRender",target);
        },
        // Converts a JSON form into HTML
        doLayout : function(arr, defaultCfg) {
            if (!$.isArray(arr)) {
                arr = [arr];
            }
            
            if (defaultCfg === undefined) {
                defaultCfg = {};
            } else {
                defaultCfg = $.jB.util.filter(["defaults"],defaultCfg);
            }
            
            var ret = $(""),
                that = this;
            
            $.each(arr,function(index,obj) {
            
                obj = $.extend({},defaultCfg,obj);
            
                if (obj.type !== undefined && $.jB.aliases[obj.type] === undefined && obj.layout === undefined) {
                    throw new Error("Type " + obj.type + " does not exist");
                } else if (obj.type === undefined && obj.layout !== undefined && $.jB.layoutAlias[obj.layout] === undefined) {
                    throw new Error("Layout " + obj.layout + " does not exist");
                }
            
                var path = "",
                    next = $.jB,
                    className, x, retObj;
                if (obj.type !== undefined) {
                    path = $.jB.aliases[obj.type].split(".");
                } else if (obj.layout !== undefined) {
                    path = $.jB.layoutAlias[obj.layout].split(".");
                }
                className = path[path.length - 1];
            
                for (x = 0 ; x < path.length - 1 ; x = x + 1) {
                    if (next[path[x]] === null) {
                        next[path[x]] = {};
                    }
                    next = next[path[x]];
                }
            
                retObj = new next[className](obj);
                that.elements[retObj.eleID] = retObj;
                ret = ret.add(retObj.doLayout());
                if (retObj.events !== undefined) {
                    $.each(retObj.events, function(index,value) {
                        retObj.element.bind(index,value);
                    });
                }
            });
            
            return ret;
        },
        getCmp : function(id) {
            return $.jB.elements[id];
        },
        namespace : function() {
            var a=arguments, o=null, i, j, d;
            for (i=0; i<a.length; i=i+1) {
                d=a[i].split(".");
                o=window;
                for (j=0; j<d.length; j=j+1) {
                    o[d[j]]=o[d[j]] || {};
                    o=o[d[j]];
                }
            }
            return o;
        }
	}
});

// Shorthand the jBuilder object for easy development
$.jB = $.jBuilder;
})(jQuery);

(function($){
    $.jB.extend("util.window",{
        tpl : "<div #attr#>#body#</div>",

        attributes : ['id','title', 'class'],

        doLayout : function() {

            this.element = $("<div>").html($.jB.doLayout(this.items));
            this.buildElementAttr();

            var filter = ['width','height', 'resizable', 'buttons','modal','minWidth', 'maxWidth'],
                cfg = {},
                that = this;
            $.each(filter, function(index,value) {
                if (that.cfg[value] !== undefined) {
                    cfg[value] = that.cfg[value];
                }
            });
            if (cfg.width !== undefined) {
                cfg.width = cfg.width + 40;
            }
            this.element.dialog(cfg);

            return this;
        }
    });

    $.extend($.jB, {
        window : function(params) {
            var obj = new $.jB.util.window(params);
            $("body").append(obj.doLayout());
            $(document).trigger("afterRender").unbind("afterRender");
            return obj;
        }
    });
})(jQuery);
(function($){
    "use strict";
    
    $.jB.namespace("$.jB.util.validator");
    $.extend($.jB.util.validator, {
        rules : {
            'email' : /(?:[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9\-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
            'url' : /[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi,
            'int' : /[\d]+/
        },
        validate : function(cmp) {
            var defaults, settings, field, result;
            
            defaults = {
                allowBlank : true,
                validator : "",
                minChar : -1,
                maxChar : -1
            };
            settings = $.jB.util.intersect(defaults,cmp);
            settings = $.extend({},defaults,settings);

            field = cmp.element.find("input").removeClass("ui-state-ok").removeClass("ui-state-error");

            function updateTips( m ) {
                cmp.element.attr("title", m );
            }


            function checkRegExp(o, regex, m) {
                if ( !( regex.test( o.val() ) ) ) {
                    o.addClass( "ui-state-error" );
                    updateTips( m );
                    return false;
                }
                return true;
            }

            function OK(o,c,m) {
                if (!c) {
                    o.addClass( "ui-state-error" );
                    updateTips( m );
                    return false;
                }
                return true;
            }

            result = true;

            if (!settings.allowBlank) {
                result = result && OK(field,field.val().length !== 0, "Must have a value");
                if (!result) {
                    return result;
                }
            } else if (settings.allowBlank && field.val().length === 0) {
                return result;
            }

            if (result && $.jB.util.validator.rules[settings.validator] !== undefined) {
                result = result && checkRegExp(field,$.jB.util.validator.rules[cmp.validator], "Must be a valid " + cmp.validator);
            }

            if (result && settings.minChar !== -1) {
                result = result && OK(field,field.val().length >= cmp.minChar, "Must be no less than " + cmp.minChar + " characters");
            }

            if (result && settings.maxChar !== -1) {
                result = result && OK(field,field.val().length <= cmp.maxChar, "Must be no more than " + cmp.maxChar + " characters");
            }

            if (result) {
                field.addClass("ui-state-ok");
            }

            return result;
        }

    });
})(jQuery);
(function($){
"use strict";

$.jB.namespace("$.jB.util");

$.extend($.jB.util,{
    intersect : function(params,obj) {
        if (params === undefined) {
            throw {
                name : "Intersect Error",
                level : "Critical",
                message : "Params must be defined"
                };
        }
        
        if (params.constructor === Object) {
            params = $.jB.util.getObjectKeys(params);
        }
        var newObj = {};
        $.each(params, function(index,item){
            if (obj[item] !== undefined) {
                newObj[item] = obj[item];
            }
        });

        return newObj;
    },
    filter : function(params,obj) {
        if (params.constructor === Object) {
            params = $.jB.util.getObjectKeys(params);
        }
        var newObj = {};
        $.each(obj, function(index,item){
            if ($.inArray(index,params) === -1 && (item.constructor === String || item.constructor === Object || 
                item.constructor === Number || item.constructor === Array)) {
                newObj[index] = item;
            }
        });

        return newObj;
    },
    getObjectKeys : function(obj) {
        var keys = [], key;
        for (key in obj) {
            keys.push(key);
        }
        return keys;
    }
});
})(jQuery);
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
(function($){
    $.jB.namespace("$.jB.util.events");
    $.extend($.jB.util.events,{
        findElementsByTrigger : function(name, obj) {
            if (obj === undefined) {
                obj = document;
            }

            var el = [];
            $.each($(obj).find("*"), function(index,value){
                var data = $.data(value,"events");
                if (data !== undefined && data[name] !== undefined) {
                    el.push(value);
                }
            });

            return el;
        },

        triggerChildEvents : function(name,obj) {
            $.each(this.findElementsByTrigger(name,obj),function(index,value) {
                $(this).trigger(name);
            });
        }
    });

})(jQuery);
(function($){
    "use strict";
    
    $.jB.namespace("$.jB.util");
    $.extend($.jB.util, {
        defaultPluginFunctions : {

            element : null,

            buildClassAttr : function() {
                this.element.addClass(this.eleID);
                if (this.alias !== undefined) {
                    this.element.addClass("jB" + this.alias);
                }

                return this;
            },
            buildStyleAttr : function(obj, onObject) {
                if (obj === undefined || obj === null) {
                    obj = this;
                }

                if (onObject === undefined || onObject === null) {
                    onObject = this.element;
                }

                function formatValue(val) {
                    if (val.constructor === Number) {
                        return val + "px";
                    }
                    return val;
                }

                var css = {};
                if (obj.width !== undefined) {
                    css.width = formatValue(obj.width);
                }

                if (obj.padding !== undefined && obj.padding.constructor !== Object) {
                    css.padding = formatValue(obj.padding);
                }else if (obj.padding !== undefined && obj.padding.constructor === Object) {
                    if (obj.padding.left !== undefined) {
                        css['padding-left'] = formatValue(obj.padding.left);
                    }
                    if (obj.padding.right !== undefined) {
                        css['padding-right'] = formatValue(obj.padding.right);
                    }
                    if (obj.padding.top !== undefined) {
                        css['padding-top'] = formatValue(obj.padding.top);
                    }
                    if (obj.padding.bottom !== undefined) {
                        css['padding-bottom'] = formatValue(obj.padding.bottom);
                    }
                }

                if (obj.margin !== undefined && obj.margin.constructor !== Object) {
                    css.margin = formatValue(obj.margin);
                } else if (obj.margin !== undefined && obj.margin.constructor === Object) {
                    if (obj.margin.left !== undefined) {
                        css["margin-left"] = formatValue(obj.margin.left);
                    }
                    if (obj.margin.right !== undefined) {
                        css["margin-right"] = formatValue(obj.margin.right);
                    }
                    if (obj.margin.top !== undefined) {
                        css.top = formatValue(obj.margin.top);
                    }
                    if (obj.margin.bottom !== undefined) {
                        css.bottom = formatValue(obj.margin.bottom);
                    }
                }


                if (obj.height !== undefined) {
                    css.height = formatValue(obj.height);
                    css.overflow = "hidden";
                }
                if (obj.style !== undefined) {
                    $(obj.style, function(index,value) {
                        css[index] = formatValue(value);
                    });
                }
                onObject.css(css);

                return this;
            },
            buildElementAttr : function(attributes,obj) {
                if (obj === undefined) {
                    obj = this;
                }

                if (attributes === undefined) {
                    attributes = this.attributes;
                }

                this.element.attr($.jB.util.intersect(attributes,obj));

                return this;
            },
            destroy : function() {
                $("." + this.eleID).remove();
                delete $.jB.elements[this.eleID];
            }
        }
    });
})(jQuery);
(function($){
    $.jB.namespace("$.jB.util");
    $.extend($.jB.util,{
        elementCount : 0,

        generateUID : function() {
            return "jB" + (1000 + $.jB.util.elementCount++);
        },
        getJBID : function(obj) {
            var jBID = obj.attr("class").match(/jB[\d]{4}/);
            return jBID !== undefined ? jBID[0] : undefined;
        }
    });
})(jQuery);
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for ( var i=types.length; i; ) {
            $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function() {
            if ( this.addEventListener ) {
                for ( var i=types.length; i; ) {
                    this.addEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i=types.length; i; ) {
                    this.removeEventListener( types[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function(fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
        if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaY = 0;
            deltaX = -1*delta;
        }

        // Webkit
        if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
        if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

})(jQuery);

(function($){
$.jB.extend("content.html", {
    alias : "html",

    attributes : ["id","class", "style"],

    'class' : "",

    doLayout : function() {
        var that = this;

        this.element = $("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (this.url !== undefined) {
            $.get(this.url, function(data) {
                that.element.html(data);
                that.element.parent().parent().trigger("onRender");
            });
        } else {
            this.element.html(this.text);
        }

        return this.element;
    }
});
})(jQuery);
(function($){
    $.jB.extend("content.iframe", {
        alias : "iframe",

        attributes : ["id","class", "style","src"],

        'class' : "",

        events : {
            onResize : function(e) {
                var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
                cmp.buildStyleAttr();

                e.stopPropagation();
            }
        },

        doLayout : function() {
            var that = this;

            this.element = $("<iframe>");

            if (this.url !== undefined) {
                this.src = this.url;
            }

            this.buildElementAttr().buildStyleAttr().buildClassAttr();

            return this.element;
        }
    });
})(jQuery);
(function($){
$.jB.extend("content.panel", {
    alias : "panel",

    events : {
        onResize : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            cmp.element.css({
                height : cmp.height,
                width : cmp.width
            });
            var newCSS = {
                height : cmp.height - 10,
                width : cmp.width - 25
            };
            if (cmp.label !== undefined) {
                newCSS.height -= 50;
            }

            cmp.element.children(".jBContent").css(newCSS);
        },
        onRender : function(e) {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));

            if (cmp !== undefined) {
                var defaultCfg = {topOffset : 40,heightOffset : 5, marginOffset : -20};
                if (cmp.label === undefined) {
                    defaultCfg = {topOffset : 15,heightOffset : 20, marginOffset : -20};
                }
                $.jB.util.scrollBar(cmp.element,defaultCfg);
            }

            e.stopPropagation();
        }
    },
    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Panel has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var content = $("<div>").addClass("jBContent").html($.jB.doLayout(this.items)).css({paddingLeft : 20, paddingRight : 20, marginTop : 10, height : this.height - 10,width : this.width - 25});
        var container = $("<div>").addClass("ui-widget-content ui-corner-all");

        if (this.label !== undefined) {
            container.append($("<div>").addClass("ui-widget-header ui-corner-all").css({padding : 5}).html(this.label));
        }

        this.element = container.append(content);
        this.buildStyleAttr().buildClassAttr();

        var cfg = $.jB.util.intersect(['height'],this);
        if (cfg.height !== undefined && this.label !== undefined) {
            cfg.height -= 60;
            this.buildStyleAttr(cfg,content);
        }

        return this.element;
    }
});
})(jQuery);
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
                that.runViewportPositioning(that);
            });
        },

        events : {
            onRender : function(e) {
                var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
                cmp.runViewportPositioning(cmp);
                $.jB.util.events.triggerChildEvents("onRender",cmp.element.children());
                e.stopPropagation();
            }
        },

        runViewportPositioning : function(cmp) {
            var viewportSize = cmp.getViewportSize();
            if (cmp.regionHTML.north !== undefined) {
                cmp.calculateNorthPosition(viewportSize);
            }

            if (cmp.regionHTML.south !== undefined) {
                cmp.calculateSouthPosition(viewportSize);
            }

            if (cmp.regionHTML.east !== undefined) {
                cmp.calculateEastPosition(viewportSize);
            }

            if (cmp.regionHTML.west !== undefined) {
                cmp.calculateWestPosition(viewportSize);
            }

            if (cmp.regionHTML.center !== undefined) {
                cmp.calculateCenterPosition(viewportSize);
            }

            $.each(cmp.regions, function(index,value) {
                var extendProps = {
                    height : cmp.regionHTML[index].height(),
                    width : cmp.regionHTML[index].width()
                };

                var objCmp = cmp.regionHTML[index].children();
                if (objCmp.length > 0) {
                    objCmp = $.jB.getCmp($.jB.util.getJBID(objCmp));
                    if (objCmp.events !== undefined && objCmp.events.onResize !== undefined) {
                        $.extend(objCmp,extendProps);
                        cmp.regionHTML[index].children().trigger('onResize');
                        return;
                    }
                }
                cmp.regionHTML[index] = cmp.regionHTML[index].html($.jB.doLayout($.extend({}, value, extendProps)).css({padding : 0, margin : 0}));

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
(function($){
$.jB.extend("layout.accordion", {
    layout : "accordion",

    attributes : ["id", "class", "method", "name", "action"],

    events : {
        onRender : function(e) {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            var tabs = cmp.element.children("div");
            $.each(tabs,function(index,value) {
                cmp.element.accordion("activate",index);
                $.jB.util.scrollBar($(value),{rightOffset : 3, heightOffset : 10,topOffset : 20});
            });
            cmp.element.accordion("activate",0);
            cmp.element.accordion({animated : true});
            e.stopPropagation();
        }
    },

    init : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }
    },

    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        var that = this;

        this.element = $("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        if (!$.isArray(this.items)) {
            this.items = [this.items];
        }

        $.each(this.items,function(index,obj) {
            var body = $.jB.doLayout($.jB.util.filter(['height','width'],obj), that.defaults);
            var bodyContainer = $("<div>").addClass("jBContent").html(body).css($.jB.util.intersect(['height','width'],obj)).css({overflow : "hidden"});

            $("<h3>").html($("<a>").attr("href","#").html(obj.label))
                .add($("<div>").html(bodyContainer))
                .appendTo(that.element);
        });

        this.element.accordion({autoHeight: false,animated : false});

        return this.element;
    }
});
})(jQuery);
(function($){
$.jB.extend("layout.tab", {
    layout : "tab",

    ref : {
        header : "ul li"
    },

    attributes : ["id", "class"],

    events : {
        onRender : function(e) {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            var tabs = cmp.element.children("div");
            $.each(tabs,function(index,value) {
                cmp.element.tabs("select",index);
                $.jB.util.scrollBar($(value),{rightOffset : 3, heightOffset : 0,topOffset : 20});
            });
            cmp.element.tabs("select",0);
            e.stopPropagation();
        }
    },

    init : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        if (this.defaults === undefined) {
            this.defaults = {};
        }
    },

    doLayout : function() {
        if (this.items === undefined) {
            throw new Error("Form has no elements");
        }

        var that = this;

        this.element = $("<div>");

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        var tabHeader = $("<ul>");
        var tabBody = $("");

        $.each(this.items,function(index,obj) {
            var body = $.jB.doLayout($.jB.util.filter(['height', 'width'],obj), this.defaults);
            var tabID = body.attr("class").match(/jB[\d]{4}/)[0];

            $("<li>").append($("<a>").attr("href", "#" + tabID).html(obj.label)).appendTo(tabHeader);

            var bodyContainer = $("<div>").addClass("jBContent").append(body).css($.jB.util.intersect(['height', 'width'],obj))
                .css("overflow","hidden");
            tabBody = tabBody.add($("<div>").html(bodyContainer).attr("id", tabID));
        });

        this.element.append(tabHeader).append(tabBody).tabs();

        return this.element;
    }
});
})(jQuery);
(function($){

"use strict";
    
$.jB.extend("form.panel", {
    alias : "form",

    attributes : ["id", "class", "method", "name", "action"],

    events : {
        submit : function() {
            $(this).find("form").children("div").trigger("keyup");

            var el = $(".ui-state-error", $(this));

            if (el.length > 0) {
                var dialog = new $.jB.window({
                    title : 'Error',
                    modal : true,
                    resizeable : false,
                    buttons : {
                        OK : function() {
                            $(this).dialog("destroy");
                        }
                    },
                    items : [{
                        type : "html",
                        text : "Elements of this form failed validation."
                    }]
                });
                return false;
            }
            return true;
        }
    },
    
    init : function() {
        if (this.items === undefined || this.items.length === 0) {
            throw new Error("Form has no elements");
        }
    },
    
    doLayout : function() {
        if (this.defaults === undefined) {
            this.defaults = {};
        }

        var form = $("<form>").attr($.jB.util.intersect(this.attributes,this)).append($.jB.doLayout(this.items, this.defaults));

        this.element = $("<div>").append(form);

        this.buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.password", {
    alias : "password",
    extend : "form.field.textfield",

    inputType : "password"
});

})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.select", {
    alias : "select",

    attributes : ["id","class"],
    inputAttributes : ['name', 'multiple', 'size', 'disabled', 'title', 'tabindex'],
    selectAttributes : ['label','value','disabled','selected'],

    init : function() {
        if (this.items === undefined) {
            throw new Error("Dropdown has no elements");
        }
    },

    doLayout : function() {
        var label = new $.jB.form.field.label(this.cfg),
            that = this,
            selectElement;

        this.element = $("<div>").append(label.doLayout());

        selectElement = $("<select>").attr($.jB.util.intersect(this.inputAttributes,this));

        $.each(this.items,function(index,opt) {
            selectElement.append($("<option>").text(opt.label).attr($.jB.util.intersect(that.selectAttributes,opt)));
        });
        this.element.append(selectElement);

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});

})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.radiogroup", {
    alias : "radiogroup",
    extend : "form.field.checkbox",

    inputType : "radio"
});

})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.label", {
    alias : "label",

    attributes : [],

    init : function() {
        if (this.width !== undefined) {
            delete this.width;
        }
    },

    doLayout : function() {
        this.element = $("<div>").addClass("fieldLabel");

        if (this.anchor !== undefined) {
            this.width = this.anchor;
        }

        if (this.noLabel === undefined || !this.noLabel) {
            this.element.html(this.label);
        }

        this.buildStyleAttr();

        return this.element;
    }
});
})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.checkbox", {
    alias : "checkbox",

    inputType : "checkbox",

    attributes : ["id","class"],
    inputAttributes : ['id', 'name', 'value', 'title', 'tabindex', 'disabled'],

    init : function() {
        if (this.items === undefined) {
            throw new Error(this.alias + " has no items");
        }
    },

    doLayout : function() {
        var label = new $.jB.form.field.label(this.cfg),
            that = this;

        this.element = $("<div>").append(label.doLayout());

        $.each(this.items,function(index,opt) {
            if (opt.value === undefined) {
                opt.value = opt.label;
            }

            if (opt.id === undefined) {
                opt.id = $.jB.util.generateUID();
            }

            var checkbox = $("<input>").attr("type",that.inputType)
                .attr($.jB.util.intersect(that.inputAttributes,opt))
                .add($("<label>").attr("for",opt.id).html(opt.label));

            that.element.append(checkbox);
        });

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);
(function($) {
    
"use strict";

$.jB.extend("form.field.datefield", {
    extend : "form.field.textfield",
    alias : "datefield",

    events : {
        onRender : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            $(this).find("input").datepicker($.jB.util.intersect(['dateFormat','buttonImage','buttonImageOnly','showOn','buttonText','showAnim','minDate','maxDate','showButtonPanel'],cmp));
        }
    }
});

})(jQuery);
(function($){

"use strict";
$.jB.extend("form.field.button", {
    alias : "button",

    attributes : ["id","class"],

    'class' : "",

    doLayout : function() {
        var that = this;

        this.type = this.inputType;

        this.element = $("<div>").html("&nbsp;");

        if (this.items === undefined) {
            this.items = [{
                text : this.text,
                handler : this.handler
            }];
        }

        $.each(this.items, function(index,obj){
            obj.id = $.jB.util.generateUID();
            var button = $("<button>").text(obj.text).attr("id",obj.id).button().click(obj.handler);
            that.element.append(button);
        });

        this.element.append($("<div>").addClass("clrLeft").html("&nbsp;"));

        this.buildElementAttr().buildStyleAttr().buildClassAttr();

        return this.element;
    }
});

})(jQuery);
(function($){

"use strict";

$.jB.extend("form.field.textfield", {
    alias : "textfield",

    inputType : "textfield",

    attributes : ["id","class"],
    inputAttributes : ['type','name', 'value', 'disabled', 'title', 'tabindex'],

    'class' : "",

    events : {
        keyup : function() {
            var cmp = $.jB.getCmp($.jB.util.getJBID($(this)));
            $.jB.util.validator.validate(cmp);
        }
    },

    doLayout : function() {
        var label = new $.jB.form.field.label(this.cfg),
            inputField;

        this.type = this.inputType;

        inputField = $("<input>").attr($.jB.util.intersect(this.inputAttributes,this)).css({
            borderWidth : 1,
            borderStyle : "solid"
        }).addClass("ui-corner-all");

        this.buildStyleAttr(null,inputField);

        this.element = $("<div>").append(label.doLayout()).append(inputField);

        this.buildElementAttr().buildClassAttr();

        return this.element;
    }
});
})(jQuery);
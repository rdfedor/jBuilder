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
                className = path[path.length - 1];

            for (var x = 0 ; x < path.length - 1 ; x++) {
                if (next[path[x]] == undefined) {
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

                var that = this;

                // Combine this object with some default functions
                $.extend(this, $.jB.defaultPluginFunctions);

                // Check to see if we're extending another, already existing, plugin
                if (params.extend !== undefined) {
                    var path = params.extend.split("."),
                        next = $.jB,
                        className = path[path.length - 1];

                    for (var x = 0 ; x < path.length - 1 ; x++) {
                        if (next[path[x]] == undefined) {
                            next[path[x]] = {};
                        }
                        next = next[path[x]];
                    }
                    params = $.extend(new next[className](cfg),params);
                }

                if (params.ref !== undefined && params.ref.constructor == Object) {
                    $.each(params.ref,function(index,value) {
                        var funcName = index.charAt(0).toUpperCase + index.slice(1);
                        that["get" + funcName] = function() {
                            return $(value,that.element).find(value);
                        };

                    });
                }

                // Create a unique id for this new element
                this.eleID = $.jB.generateUID();

                // Store this to be retrieved later on
                $.jB.elements[this.eleID] = this;

                // Combine the plugin into this object along with the new config passed via parameters
                $.extend(this,params,cfg, {cfg : cfg});
                // Check if the plugin has an init function and run it
            	if ($.isFunction(this.init)) {
            		this.init();
                }
            };
		},
        // Converts a JSON form into HTML and renders it at a specific location
        build : function(obj) {
            // Convert our JSON to HTML
            var html = this.doLayout(obj);

            // Check to see if we have a renderTo variable set to say where we want the code
            /** @namespace obj.renderTo */
            if (obj.renderTo === undefined) {
                // renderTo was not set so store it in the body
                if (document.body !== null) {
                    $("body",document).append(html);
                } else {
                    $("body",document.documentElement).append(html);
                }
            } else {
                // renderTo was set so store the HTML in the appropriate location
                if (obj.renderTo.constructor == String) {
                    $("#" + obj.renderTo).html(html);
                } else if (obj.renderTo.constructor == $) {
                    obj.renderTo.html(html);
                } else {
                    throw new Error("renderTo is an unknown object");
                }
            }

            $(document).trigger("afterRender").unbind("afterRender");
        },
        // Converts a JSON form into HTML
        doLayout : function(arr, defaultCfg) {
        	
        	if (!$.isArray(arr)) {
        		arr = [arr];
        	}

            if (defaultCfg === undefined) {
                defaultCfg = {};
            } else {
                defaultCfg = $.jB.filter(["defaults"],defaultCfg);
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
                    next = $.jB;
                if (obj.type !== undefined) {
                    path = $.jB.aliases[obj.type].split(".");
                } else if (obj.layout !== undefined) {
                    path = $.jB.layoutAlias[obj.layout].split(".");
                }
                var className = path[path.length - 1];

                for (var x = 0 ; x < path.length - 1 ; x++) {
                    if (next[path[x]] == null) {
                        next[path[x]] = {};
                    }
                    next = next[path[x]];
                }

                var retObj = new next[className](obj);
                that.elements[retObj.eleID] = retObj;
                ret = ret.add(retObj.doLayout());
        	});
        	
            return ret;
        }
	}
});

// Shorthand the jBuilder object for easy development
$.jB = $.jBuilder;
})(jQuery);
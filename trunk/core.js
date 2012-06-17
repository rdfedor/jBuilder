jQuery.extend({
	jBuilder : {
        elements : {},
		aliases : {},
        layoutAlias : {},

        // Our custom loading function for adding new functionality to the jBuilder core
		extend : function(classPath, params) {
            // Navigate through the classPath structure
			var path = classPath.split("."),
                next = jQuery.jBuilder,
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
                // Combine this object with some default functions
                jQuery.extend(this, jQuery.jBuilder.defaultPluginFunctions);

                // Check to see if we're extending another, already existing, plugin
                if (params.extend !== undefined) {
                    var path = params.extend.split("."),
                        next = jQuery.jBuilder,
                        className = path[path.length - 1];

                    for (var x = 0 ; x < path.length - 1 ; x++) {
                        if (next[path[x]] == undefined) {
                            next[path[x]] = {};
                        }
                        next = next[path[x]];
                    }
                    params = jQuery.extend(new next[className],params);
                }

                // Create a unique id for this new element
                this.eleID = jQuery.jBuilder.generateUID();

                // Store this to be retrieved later on
                jQuery.jBuilder.elements[this.eleID] = this;

                // Combine the plugin into this object along with the new config passed via parameters
                jQuery.extend(this,params,cfg, {cfg : cfg});
                // Check if the plugin has an init function and run it
            	if (jQuery.isFunction(this.init)) {
            		this.init();
                }
            };
		},
        // Converts a JSON form into HTML and renders it at a specific location
        build : function(obj) {
            // Convert our JSON to HTML
            var html = this.doLayout(obj);

            // Check to see if we have a renderTo variable set to say where we want the code
            if (obj.renderTo === undefined) {
                // renderTo was not set so store it in the body
                if (document.body !== null) {
                    jQuery("body",document).append(html);
                } else {
                    jQuery("body",document.documentElement).append(html);
                }
            } else {
                // renderTo was set so store the HTML in the appropriate location
                if (obj.renderTo.constructor == String) {
                    jQuery("#" + obj.renderTo).html(html);
                } else if (obj.renderTo.constructor == jQuery) {
                    obj.renderTo.html(html);
                } else {
                    throw new Error("renderTo is an unknown object");
                }
            }

            jQuery(document).trigger("afterRender").unbind("afterRender");
        },
        // Converts a JSON form into HTML
        doLayout : function(arr, defaultCfg) {
        	
        	if (!jQuery.isArray(arr)) {
        		arr = [arr];
        	}

            if (defaultCfg === undefined) {
                defaultCfg = {};
            } else {
                defaultCfg = jQuery.jBuilder.filter(defaultCfg,["defaults"]);
            }

        	var ret = "",
                that = this;
        	
        	jQuery.each(arr,function(index,obj) {

                obj = jQuery.extend({},defaultCfg,obj);

        		if (obj.type !== undefined && jQuery.jBuilder.aliases[obj.type] === undefined && obj.layout === undefined) {
                    throw new Error("Type " + obj.type + " does not exist");
                } else if (obj.type === undefined && obj.layout !== undefined && jQuery.jBuilder.layoutAlias[obj.layout] === undefined) {
                    throw new Error("Layout " + obj.layout + " does not exist");
                }

                var path = "",
                    next = jQuery.jBuilder;
                if (obj.type !== undefined) {
                    path = jQuery.jBuilder.aliases[obj.type].split(".");
                } else if (obj.layout !== undefined) {
                    path = jQuery.jBuilder.layoutAlias[obj.layout].split(".");
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
                ret += retObj.doLayout();
        	});
        	
            return ret;
        }
	}
});

// Shorthand the jBuilder object for easy development
jQuery.jB = jQuery.jBuilder;
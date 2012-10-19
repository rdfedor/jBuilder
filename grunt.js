/*global module:false*/
module.exports = function(grunt) {
  
  "use strict";
  
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:jquery-jBuilder.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: [
            '<banner:meta.banner>',
            '<file_strip_banner:src/<%= pkg.name %>.js>',
            'src/window.js',
            'src/util/*.js',
            'src/content/*.js',
            'src/layout/*.js',
            'src/form/**/*.js'
            ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    mindirect: {
        files: ['dist/<%= pkg.name %>.min.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {
        mangle: {toplevel: true},
        codegen: {
            ascii_only: true
        }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

};

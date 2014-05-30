/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  var RE_USE_STRICT_STATEMENT = /(^|\n)[ \t]*'use strict';?\s*/g,
  RE_CONSOLE_METHODS      = /console\.[\w]+\(.*?(\w*\(.*\))*\);/g,
  BANNER_TEMPLATE_STRING  = '/*! <%= pkg.name %>' +
        ' ( <%= grunt.template.today("yyyy-mm-dd") %> ) - <%= pkg.license %> */';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /**
     * Concatenation
     */
    concat: {
      dist: {
        files: {
          'public/devel/tmp/js/all.js': [
            // libs
            'public/devel/js/libs/zepto/zepto.js',
            'public/devel/js/libs/unveil/jquery.unveil.min.js',
            'public/devel/js/libs/tappivate/tappivate.js',

            // app
            'public/devel/js/common.js'
          ]
        },
        options: {
          process: function(content) {
            return content.replace(RE_USE_STRICT_STATEMENT, '$1').replace(RE_CONSOLE_METHODS, '');
          },
          stripBanners: false,
          banner: [BANNER_TEMPLATE_STRING,
            ';(function(window) {',
            '',
            '"use strict";',
            '',
            ''].join('\n'),
          footer: ['',
            '})(window);'].join('\n')
        }
      }
    },
    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'public/js/all.min.js': ['public/devel/tmp/js/all.js']
        }
      }
    },
    watch: {
      scss: {
        files:[
          'public/devel/sass/**/*.scss'
        ],
        tasks: [
          'compass', 'csscomb', 'csso'
        ]
      },
      js: {
        files:[
          'public/**/*.html',
          'public/devel/js/**/*.js'
        ],
        tasks: [
          'concat', 'uglify'
        ]
      }
    },
    compass: {
      dist: {
        options: {              // Target options
          sassDir: 'public/devel/sass/',
          cssDir: 'public/css',
          generatedImagesDir: 'public/img',
          imagesDir: 'img',
          imagesPath: 'public/img',
          noLineComments: false,
          outputStyle: 'compressed'
        }
      }
    },
    csscomb: {
      dynamic_mappings: {
        expand: true,
        cwd: 'public/css/',
        src: ['**/*.css'],
        dest: 'public/css/',
        ext: '.css'
      }
    },
    csso: {
      dynamic_mappings: {
        expand: true,
        cwd: 'public/css/',
        src: ['**/*.css'],
        dest: 'public/css/',
        ext: '.css'
      }
    },
    // Make ImageOptim, ImageAlpha and JPEGmini part of your automated build process
    imageoptim: {
      dist: {
        options: {
          // also run images through ImageAlpha.app before ImageOptim.app
          imageAlpha: false,
          // also run images through JPEGmini.app after ImageOptim.app
          jpegMini: false,
          // quit all apps after optimisation
          quitAfter: true
        },
        src: ['public/img/*']
      }
    },
    exec: {
      start: {
        command: 'http-server ./public & grunt watch'
      }
    }


  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-imageoptim');

  /**
   * local 開発環境
   */
  grunt.registerTask('start', ['exec:start']);


};

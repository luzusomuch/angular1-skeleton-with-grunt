'use strict';
var version = require('./package.json').version;
var port = require('./config/config.json').port;
var hostname = require('./config/config.json').hostname;
var devApiUrl = require('./config/config.json').devApiUrl;
var prodApiUrl = require('./config/config.json').prodApiUrl;
var showStatusesUnableToUpdate = require('./config/config.json').showStatusesUnableToUpdate;
var appPath = require('./bower.json').appPath || 'app';

// usemin custom step
var useminAutoprefixer = {
  name: 'autoprefixer',
  createConfig: function (context, block) {
    if (block.src.length === 0) {
      return {};
    } else {
      return require('grunt-usemin/lib/config/cssmin').createConfig(context, block); // Reuse cssmins createConfig
    }
  }
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  var serveStatic = require('serve-static');

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: appPath,
      dist: 'dist'
    },
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      ngconstant: {
        files: ['Gruntfile.js'],
        tasks: ['ngconstant:dev']
      },
      sass: {
        files: ['app/scss/**/*.scss'],
        tasks: ['sass:server']
      }
    },
    autoprefixer: {
      // src and dest is configured in a subtask called "generated" by usemin
    },
    wiredep: {
      app: {
        src: ['app/index.html'],
        ignorePath: /\.\.\/bower_components\//, // remove ../bower_components/ from paths of injected sass files
      },
      test: {
        src: 'test/karma.conf.js',
        exclude: [/angular-scenario/],
        ignorePath: /\.\.\//, // remove ../ from paths of injected javascripts
        devDependencies: true,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/app.js',
        'app/scripts/app/**/*.js',
        'app/scripts/components/**/*.js',
        'app/scripts/services/**/*.js',
        'app/scripts/filters/**/*.js'
      ]
    },
    sass: {
      options: {
        includePaths: [
          'app/bower_components'
        ]
      },
      server: {
        files: [
          {
            expand: true,
            cwd: 'app/scss',
            src: ['*.scss'],
            dest: 'app/assets/styles',
            ext: '.css'
          }
        ]
      }
    },
    sasslint: {
      options: {
        configFile: '.sass-lint.yml'
      },
      target: ['app/scss/*.scss']
    },
    concat: {
      // src and dest is configured in a subtask called "generated" by usemin
    },
    uglifyjs: {
      // src and dest is configured in a subtask called "generated" by usemin
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/**/*.js',
            '<%= yeoman.dist %>/assets/styles/**/*.css',
            '<%= yeoman.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg,mp4}',
            '<%= yeoman.dist %>/assets/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin', useminAutoprefixer] // Let cssmin concat files so it corrects relative paths to fonts and images
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/assets/styles/**/*.css'],
      js: ['<%= yeoman.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/assets/styles', '<%= yeoman.dist %>/assets/images', '<%= yeoman.dist %>/assets/fonts'],
        blockReplacements: {
          js: function (block){
            return '<script src="' + block.dest + '" defer><\/script>';
          }
        },
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|mp4|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        },
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/images',
          src: '**/*.{jpg,jpeg}', // we don't optimize PNG files as it doesn't work on Linux. If you are not on Linux, feel free to use '**/*.{png,jpg,jpeg}'
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },
    cssmin: {
        // src and dest is configured in a subtask called "generated" by usemin
    },
    ngtemplates: {
      dist: {
        cwd: 'app',
        src: ['scripts/app/**/*.html', 'scripts/components/**/*.html'],
        dest: '.tmp/templates/templates.js',
        options: {
          module: 'measureApp',
          usemin: 'scripts/app.js',
          //htmlmin: '<%= htmlmin.dist.options %>'
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: false,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          keepClosingSlash: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      fonts: {
        files: [{
          expand: true,
          dot: true,
          flatten: true,
          cwd: 'app',
          dest: '<%= yeoman.dist %>/assets/fonts',
          src: ['bower_components/font-awesome/fonts/*', 'bower_components/bootstrap/fonts/*']
        },
        {
          expand: true,
          dot: true,
          flatten: true,
          cwd: 'app',
          dest: '<%= yeoman.dist %>/assets/fonts',
          src: ['assets/fonts/*']
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.html',
            'scripts/**/*.html',
            'assets/images/**/*.{png,gif,webp,jpg,jpeg,svg,mp4}',
            'assets/img/**/*.{png,gif,webp,jpg,jpeg,svg,mp4}',
            'assets/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/assets/images',
          dest: '<%= yeoman.dist %>/assets/images',
          src: [
            'generated/*'
          ]
        }]
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    protractor: {
      options: {
        configFile: 'test/protractor.conf.js'
      },
      e2e: {
        options: {
          // Stops Grunt process if a test fails
          keepAlive: false
        }
      },
      continuous: {
        options: {
          keepAlive: true
        }
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    ngconstant: {
      options: {
        name: 'measureApp',
        deps: false,
        wrap: '\'use strict\';\n// DO NOT EDIT THIS FILE, EDIT THE GRUNT TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE\n{%= __ngModule %}'
      },
      dev: {
        options: {
          dest: 'app/scripts/app/app.constants.js'
        },
        constants: {
          ENV: 'dev',
          VERSION: version,
          apiUrl: devApiUrl,
          showStatusesUnableToUpdate: showStatusesUnableToUpdate
        }
      },
      prod: {
        options: {
          dest: '.tmp/scripts/app/app.constants.js'
        },
        constants: {
          ENV: 'prod',
          VERSION: version,
          apiUrl: prodApiUrl,
          showStatusesUnableToUpdate: showStatusesUnableToUpdate
        }
      }
    },
    connect: {
      options: {
        port: port,
        hostname: hostname,
      },
      dev: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              // require('connect-livereload')(),
              serveStatic('.tmp'),
              connect().use('/bower_components', serveStatic('./bower_components')),
              serveStatic(appPath)
            ];
          }
        }
      }
    }
  });

  grunt.registerTask('serve', [
    'clean:server',
    'wiredep',
    'jshint',
    'ngconstant:dev',
    'sass:server',
    'connect',
    'watch'
  ]);

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep:test',
    'ngconstant:dev',
    'sass:server',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep:app',
    'jshint',
    'ngconstant:prod',
    'useminPrepare',
    'ngtemplates',
    'sass:server',
    'imagemin',
    'svgmin',
    'concat',
    'copy:fonts',
    'copy:dist',
    'ngAnnotate',
    'cssmin',
    'autoprefixer',
    'uglify',
    'rev',
    'usemin'
    //'htmlmin'
  ]);

  grunt.registerTask('default', ['serve']);
};

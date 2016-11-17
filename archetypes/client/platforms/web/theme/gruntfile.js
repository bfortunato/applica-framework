module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['js/inc/**/*.js'],
                dest: 'js/app.js',
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'js/app.min.js': ['js/app.js']
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/inc/app.css": "less/app.less",
                },
                cleancss: true
            },

        },
        csssplit: {
            your_target: {
                src: ['css/inc/app.css'],
                dest: 'css/inc/app.css',
                options: {
                    maxSelectors: 4000,
                    suffix: '_'
                }
            },
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            target: {
                files: {
                    'css/app_1.min.css': ['css/inc/app_1.css'],
                    'css/app_2.min.css': ['css/inc/app_2.css'],
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: '',
                src: [
                    "**/*",
                    '!**/node_modules/**',
                    '!**/.idea/**',
                    '!**/*.text**',
                    '!**/*.txt**',
                    '!**/.DS_Store**',
                    '!**/less/**',
                    '!**/js/inc/**',
                    '!**/js/app.js**',
                    '!**/package.json**',
                    '!**/gruntfile.js**',
                    '!**/css/inc/**'
                ],
                dest: 'dist/'
            },
        },
        clean: ['**/.idea', '**/.DS_Store', 'dist'],
        watch: {
            less: {
                files: ['less/**/*.less'], // which files to watch
                tasks: ['less', 'csssplit', 'cssmin']
            },
            js: {
                files: ['js/inc/**/*.js'], // which files to watch
                tasks: ['concat', 'uglify']
            }

        }
    });

    // Load the plugin that provides the "less" task.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-csssplit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('dist', ['clean', 'copy']);

};
/**
 * Created by alpipego on 04.12.2016.
 */
module.exports = function (grunt) {
    var path = {
        src: 'src',
        tmp: 'tmp',
        dist: 'dist'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        path: path,

        sass: {
            default: {
                options: {
                    sourceMap: true,
                    includePaths: ['src']
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    src: '*.scss',
                    dest: '<%= path.tmp %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },

        postcss: {
            default: {
                options: {
                    processors: [
                        require('autoprefixer')({
                            browsers: ['> 1%', 'Last 2 versions']
                        }),
                        require('css-mqpacker')({
                            sort: true
                        }),
                        require('cssnano')({discardUnused: {fontFace: false}}),
                        require('postcss-flexibility')
                    ],
                    map: {
                        prev: '<%= path.tmp %>',
                        inline: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.tmp %>',
                    src: '*.css',
                    dest: '<%= path.dest %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },

        clean: {
            default: ['<%= path.tmp %>/*'],
            build: ['<%= path.tmp %>/*', '<%= path.dest %>/*'],
            options: {
                force: true
            }
        },

        watch: {
            options: {
                spawn: true
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['styles']
            },
            styles: {
                files: '<%= path.src %>/**/*.scss',
                tasks: ['styles']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'dest/**/*.css'
                    ]
                },
                options: {
                    watchTask: true,
                    // proxy: 'stage.nambaheins.dvlp',
                    online: true,
                    open: false,
                    notify: true
                }
            }
        }
    });

    grunt.registerTask('styles', ['sass', 'postcss:default']);
    grunt.registerTask('default', ['styles', 'browserSync', 'watch']);
    grunt.registerTask('build', ['sass', 'postcss:default']);
};

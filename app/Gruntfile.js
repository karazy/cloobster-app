'use strict';	

module.exports = function(grunt) {

	//automatically load grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({


		settings: {
			dev: {					
				serviceUrl: 'localhost'
			},
			prod: {
				serviceUrl: 'https://karazy-cloobster.appspot.com'
			},

			directory: {
				src: 'src/',
				server: '.tmp/',
				production: 'prod'
			}
		},		
		copy: {
			dev: {
				src: '**/*',
				cwd: '<%= settings.directory.src %>',
    			dest: '<%= settings.directory.server %>',
    			nonull: true,
    			expand: true
			},
			prodSrc: {

			},
			prodDest: {

			}
		},

		clean: {
			dev: '<%= settings.directory.server %>'
		},

		replace: {
			dev: {
				src: '<%= settings.directory.server %>/app/util/Configuration.js',
				overwrite: true,
				replacements: [
				{
					from: /(serviceUrl) : .*/,
					top: '$1 : \'<%= settings.dev.serviceUrl %>\','
				}
				]
				
			}
		},

		connect: {
	      options: {
	        port: 9000,
	        // Change this to '0.0.0.0' to access the server from outside.
	        hostname: '0.0.0.0',
	        livereload: 35729
	      },
	      livereload: {
	        options: {
	        	open: true,
	        	base: [
	        	'<%= settings.directory.server %>'
	        	]
	        }
	      }
	      // test: {
	      //   options: {
	      //     port: 9001,
	      //     base: [
	      //       '.tmp',
	      //       'test',
	      //       '<%= yeoman.app %>'
	      //     ]
	      //   }
	      // },
	      // dist: {
	      //   options: {
	      //     base: '<%= yeoman.dist %>'
	      //   }
	      // }
	    },

	    // Watches files for changes and runs tasks based on the changed files
    	watch: {
		    js: {
		        files: ['<%= settings.directory.src %>/**'],
		        tasks: ['copy:dev'],
		        options: {
		          livereload: true
		        }
		      },
		      // compass: {
		      //   files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
		      //   tasks: ['compass:server', 'autoprefixer']
		      // },
		      gruntfile: {
		        files: ['Gruntfile.js']
		      },
		      // livereload: {
		      //   options: {
		      //     livereload: '<%= connect.options.livereload %>'
		      //   },
		      //   files: [
		      //     '<%= yeoman.app %>/{,*/}*.html',
		      //     '.tmp/styles/{,*/}*.css',
		      //     '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
		      //   ]
		      // }
		    },

	});

	/**
	* Used for dev. Starts a webserver and watches changes.
	*/
	grunt.registerTask('serve', [
		'clean:dev',
		'copy:dev',
		'replace:dev',
		'connect:livereload:keepalive'
		'watch'
	]);

	/**
	* Used for production build.
	*/
	grunt.registerTask('build', [
		'clean:prod',
		'copy:prod',
		'string-replace:prod',
		'setversion',
		'compile',
		'copy:prod-dest'

	]);
}

// - source kopieren
// - CSS kopieren je nach Theme
//   - z.B. in verschiedenen Ordnern vorhalten und mittels Parameter auslesen
// - URL basierend auf environment setzen (Prod, QA etc) // grunt-text-replace oder grunt-string-replace
// - set version via git oder wie in preports
// - compile mit sencha (grunt-run oder grunt-contrib-commands)
// - copy to cordova or desktop
// - (optional) run cordova
// - (optional) add web server


// https://github.com/yoniholmes/grunt-text-replace
// replace: {
//   example: {
//     src: ['text/*.txt'],             // source files array (supports minimatch)
//     dest: 'build/text/',             // destination directory or file
//     replacements: [{
//       from: 'Red',                   // string replacement
//       to: 'Blue'
//     }, {
//       from: /(f|F)(o{2,100})/g,      // regex replacement ('Fooo' to 'Mooo')
//       to: 'M$2'
//     }, {
//       from: 'Foo',
//       to: function (matchedWord) {   // callback replacement
//         return matchedWord + ' Bar';
//       }
//     }]
//   }
// }
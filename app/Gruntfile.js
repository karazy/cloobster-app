'use strict';	

module.exports = function(grunt) {

	//automatically load grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({


		settings: {
			dev: {					
				serviceUrl: 'http://localhost:8888'
			},
			prod: {
				serviceUrl: 'https://karazy-cloobster.appspot.com'
			},
			directory: {
				src: 'src/',
				server: '.tmp/',
				production: 'production',
				cordova: '../../cordova',
				androidProd: {
					frizz: '../../android/FrizzDarmstadt',
					cloobster: '../../android/CloobsterAppAndroid'
				} 
			}
		},		
		copy: {
			source: {
				src: ['**/*', '!res/**/*', '!whitelabel/**/src/**/*'],
				cwd: '<%= settings.directory.src %>',
    			dest: '<%= grunt.option("copyDestination") %>',
    			nonull: true,
    			expand: true,
    			dot: true
			},
			dev: {
				src: ['**/*', '!res/**/*', '!whitelabel/**/src/**/*'],
				cwd: '<%= settings.directory.src %>',
    			dest: '<%= settings.directory.server %>',
    			nonull: true,
    			expand: true,
    			dot: true
			},
			resources: {
				src: ['**/*', '!*.scss', '!config.rb'],
				cwd: '<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>/',
    			dest: '<%= settings.directory.server %>/res/',
    			nonull: true,
    			expand: true	
			},
			prodSrc: {
				src: ['**/*', '!res/**/*', '!whitelabel/**/src/**/*'],
				cwd: '<%= settings.directory.src %>',
    			dest: '<%= settings.directory.production %>',
    			// nonull: true,
    			expand: true,
    			dot: true
			},
			resourcesProd: {
				src: ['**/*', '!*.scss', '!config.rb'],
				cwd: '<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>/',
    			dest: '<%= settings.directory.production %>/res/',
    			nonull: true,
    			expand: true
			},
			prodDest: {
				files: [
					//cordova general
					{
						src: ['**/*'],
						cwd: '<%= settings.directory.production %>',
		    			dest: '<%= settings.directory.cordova %>/www',
		    			nonull: true,
		    			expand: true
					},
					//android (old)
					{
						src: ['**/*'],
						cwd: '<%= settings.directory.production %>',
		    			dest: '<%= settings.directory.androidProd[grunt.option("whitelabel")] %>/assets/www',
		    			nonull: true,
		    			expand: true
					}
				]
			},
			//Copy whitelabel sources that differ from base cloobster
			whitelabelSrc: {
				src: ['**/*'],
				cwd: '<%= settings.directory.src %>/whitelabel/<%= grunt.option("whitelabel") %>/src/',
    			dest: '<%= grunt.option("copyDestination") %>',
    			nonull: true,
    			expand: true,
    			dot: true
			}
		},

		clean: {
			dev: '<%= settings.directory.server %>',
			prod: '<%= settings.directory.production %>'
		},

		replace: {
			development: {
				src: '<%= settings.directory.server %>/app/util/Configuration.js'
				,overwrite: true
				,replacements: [
					{
						from: /serviceUrl : .*/,
						to: 'serviceUrl : \'<%= grunt.option("server") %>\','
					}
					,{
						from: /whitelabelConfig.*/,
						to: 'whitelabelConfig : \'<%= grunt.option("whitelabel") %>\','
					}
					,{
						from: /version:.*/,
						to: 'version: \'<%= grunt.option("appVersion").trim() %>\','
					}

				]				
			}
			,production: {
				src: '<%= settings.directory.production %>/app/util/Configuration.js'
				,overwrite: true
				,replacements: [
					{
						from: /serviceUrl : .*/,
						to: 'serviceUrl : \'<%= grunt.option("server") %>\','
					}
					,{
						from: /whitelabelConfig.*/,
						to: 'whitelabelConfig : \'<%= grunt.option("whitelabel") %>\','
					}
					,{
						from: /version:.*,/,
						to: 'version: \'<%= grunt.option("appVersion").trim() %>\','
					}
				]				
			}
			// cloobster: {
			// 	src: '<%= settings.directory.server %>/app/util/Configuration.js',
			// 	overwrite: true,
			// 	replacements: [
			// 		{
			// 			from: /whitelabelConfig.*/,
			// 			to: 'whitelabelConfig : null,'
			// 		}
			// 	]				
			// },
			// frizz: {
			// 	src: '<%= settings.directory.server %>/app/util/Configuration.js',
			// 	overwrite: true,
			// 	replacements: [
			// 		{
			// 			from: /whitelabelConfig.*/,
			// 			to: 'whitelabelConfig : frizz,'
			// 		}
			// 	]				
			// }
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
	        	open: false,
	        	base: [
	        	'<%= settings.directory.server %>',
	        	'<%= settings.directory.src %>'
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
		        files: ['<%= settings.directory.src %>/app/**/*.js', '<%= settings.directory.src %>/whitelabel/**/*.js'],
		        tasks: [
		        	'debug',
		        	'copy:dev', 
		        	'bgShell:getVersion', 
		        	'replace:development',
		        	'copy:resources',
		        	'copy:whitelabelSrc'
		        ],
		        options: {
		          livereload: true,
		          //spawn no child processes, needed to access options
		          spawn: false
		        }
		      },
		    compass: {
		        files: ['<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>/*.{scss,sass}'],
		        tasks: ['compass:compile', 'copy:resources']
		    },
		    gruntfile: {
		        files: ['Gruntfile.js']
		    },
		      livereload: {
		        options: {
		          livereload: '<%= connect.options.livereload %>'
		        },
		        files: [
		          '<%= settings.directory.server %>/{,*/}*.html'
		          // '.tmp/styles/{,*/}*.css',
		          // '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
		        ]
		      }
		},
		    // Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {									
			// generatedImagesDir: '.tmp/images/generated',
			// imagesDir: '<%= yeoman.app %>/images',
			// javascriptsDir: '<%= yeoman.app %>/scripts',
			// fontsDir: '<%= yeoman.app %>/styles/fonts',
			// importPath: '<%= yeoman.app %>/bower_components',
			// httpImagesPath: '/images',
			// httpGeneratedImagesPath: '/images/generated',
			// httpFontsPath: '/styles/fonts',
			// relativeAssets: false,
			// assetCacheBuster: false,
			// raw: 'Sass::Script::Number.precision = 10\n'
			
		},
		// dist: {
		//   options: {
		//     generatedImagesDir: '<%= yeoman.dist %>/images/generated'
		//   }
		// },
			compile: {
				options: {
					cssDir: '<%= settings.directory.server %>/res/<%= grunt.option("whitelabel") %>',
					sassDir: '<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>',
					basePath: '<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>',
					debugInfo: true,
					//TODO env not working
					// environment: '<%= grunt.option("buildMode") %>',
					outputStyle: 'expanded'
				}
			}
		}
		,bgShell: {
			_defaults: {
				bg: true
			},

			senchaBuild: {
				cmd: 'sencha-3.0.0.250 app build package',
				bg: false,
				execOpts: {
			      cwd: '<%= settings.directory.production %>'
			    },				
			},

			getVersion: {
				cmd: 'git describe --always',
				bg: false,
				stdout: function(out) {
					console.log('Set version ' + out);
					grunt.option('appVersion', out);
				},
				stderr: true
			}
			// watchCoffee: {
			// 	cmd: 'coffee --watch --output lib/ src/'
			// },
			// runNode: {
			// 	cmd: 'node server.js',
			// 	bg: false
			// }
		}
	});

	/**
	* Used for dev. Starts a webserver and watches changes.
	*/
	grunt.registerTask('serve', function(server, whitelabel) {

		initParams(server, whitelabel);

		//set destination for copy task
		grunt.option('copyDestination', '<%= settings.directory.server %>');

		grunt.task.run([
			'clean:dev',
			'copy:dev',
			'bgShell:getVersion',
			'replace:development',
			'compass:compile',
			'copy:resources',
			'copy:whitelabelSrc',
			'connect:livereload',
			'watch'
		]);
	});

	/**
	* Used for production build.
	*/
	grunt.registerTask('build', function(server, whitelabel) {

		initParams(server, whitelabel);

		//set destination for copy task
		grunt.option('copyDestination', '<%= settings.directory.production %>');

		grunt.task.run([
			'clean:prod',
			'copy:production',
			'bgShell:getVersion',
			'replace:production',
			'compass:compile',
			'copy:resourcesProd',
			'copy:whitelabelSrc',
			'bgShell:senchaBuild'
			// 'copy:prodDest'
		]);
	});

	/**
	* Debug logic
	*/
	grunt.registerTask('debug', function() {

		console.log('DEBUG: runtime parameters:');
		console.log('Using server ' + grunt.option('server'));
		console.log('Using whitelabel ' + grunt.option('whitelabel'));
		console.log('Build mode ' + grunt.option('buildMode'));
	});

	/**
	* Initialize params and 
	*/
	function initParams(server, whitelabel) {
		var _server,
			_whitelabel,
			_mode,
			_options = {};

		if(!grunt.option('buildMode') || grunt.option('buildMode') != 'development' || grunt.option('buildMode') != 'production') {
			grunt.option('buildMode', 'development');
		}

		switch(server) {
			case 'localhost':
				_server = 'localhost';
				break;
			case 'production':
				_server = 'production';
			break;
			default:
				_server = 'localhost';			
		}

		if(_server == 'localhost') {
			grunt.option('server', '<%= settings.dev.serviceUrl %>');	
		} else if(server == 'production') {
			grunt.option('server', '<%= settings.prod.serviceUrl %>');
		} 
		

		switch(whitelabel) {
			case 'cloobster':
				_whitelabel = 'cloobster';
				break;
			case 'frizz':
				_whitelabel = 'frizz';
			break;
			default:
				_whitelabel = 'cloobster';			
		}

		grunt.option('whitelabel', _whitelabel);


		console.log('Using server ' + _server);
		console.log('Using whitelabel ' + _whitelabel);
		console.log('Build mode ' + grunt.option('buildMode'));
	}
}



// - source kopieren ok
// - CSS kopieren je nach Theme ok
//   - z.B. in verschiedenen Ordnern vorhalten und mittels Parameter auslesen
// - URL basierend auf environment setzen (Prod, QA etc) ok
// - Für build korrekte index kopieren desktop oder phone
// - set version via git oder wie in preports ok
// - compile mit sencha (grunt-run oder grunt-contrib-commands) ok
// - copy to cordova or desktop
// - (optional) run cordova
// - (optional) add web server ok
// - unterschiedliche whitelabel dateien berücksichtigen



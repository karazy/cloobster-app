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
				production: 'production',
				cordova: '../cordova'
			}
		},		
		copy: {
			dev: {
				src: ['**/*', '!res/**/*'],
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
				src: ['**/*', '!res/**/*'],
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
				src: ['**/*'],
				cwd: '<%= settings.directory.production %>',
    			dest: '<%= settings.directory.cordova %>/www',
    			nonull: true,
    			expand: true	
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
	        	open: true,
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
		        files: ['<%= settings.directory.src %>/app/**/*.js'],
		        tasks: ['copy:dev'],
		        options: {
		          livereload: true
		        }
		      },
		    compass: {
		        files: ['<%= settings.directory.src %>/res/css/{,*/}*.{scss,sass}'],
		        tasks: ['compass:server', 'copy:dev']
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
			cloobster: {
				options: {
					cssDir: '<%= settings.directory.server %>/res/cloobster',
					sassDir: '<%= settings.directory.src %>/res/cloobster',
					basePath: '<%= settings.directory.src %>/res/cloobster',
					debugInfo: true,
					environment: '<%= grunt.option("buildMode") %>',
					outputStyle: 'expanded'
				}
			},
			frizz: {
				options: {
					cssDir: '<%= settings.directory.server %>/res/frizz',
					sassDir: '<%= settings.directory.src %>/res/frizz',
					basePath: '<%= settings.directory.src %>/res/frizz',
					debugInfo: true,
					environment: '<%= grunt.option("buildMode") %>',
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

		// var _server,
		// 	_whitelabel,
		// 	_mode;

		// if(!grunt.option('buildMode') || grunt.option('buildMode') != 'development' || grunt.option('buildMode') != 'production') {
		// 	grunt.option('buildMode', 'development');
		// }

		// switch(server) {
		// 	case 'localhost':
		// 		_server = 'localhost';
		// 		break;
		// 	case 'production':
		// 		_server = 'production';
		// 	break;
		// 	default:
		// 		_server = 'localhost';			
		// }

		// if(_server == 'localhost') {
		// 	grunt.option('server', '<%= settings.dev.serviceUrl %>');	
		// } else if(server == 'production') {
		// 	grunt.option('server', '<%= settings.prod.serviceUrl %>');
		// } 
		

		// switch(whitelabel) {
		// 	case 'cloobster':
		// 		_whitelabel = 'cloobster';
		// 		break;
		// 	case 'frizz':
		// 		_whitelabel = 'frizz';
		// 	break;
		// 	default:
		// 		_whitelabel = 'cloobster';			
		// }

		// grunt.option('whitelabel', _whitelabel);


		// console.log('Using server ' + _server);
		// console.log('Using whitelabel ' + _whitelabel);


		grunt.task.run([
			'clean:dev',
			'copy:dev',
			'replace:development',
			'compass:'+_whitelabel,
			'copy:resources',
			'connect:livereload',
			'watch'
		]);
	});

	/**
	* Used for production build.
	*/
	grunt.registerTask('build', function(server, whitelabel) {

		initParams(server, whitelabel);

		grunt.task.run([
			'clean:prod',
			'copy:prodSrc',
			'replace:production',
			'compass:'+grunt.option('whitelabel'),
			'copy:resourcesProd',
			// 'setversion',
			'bgShell:senchaBuild'
			// 'copy:prodDest'
		]);
	});

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
	}
}



// - source kopieren ok
// - CSS kopieren je nach Theme ok
//   - z.B. in verschiedenen Ordnern vorhalten und mittels Parameter auslesen
// - URL basierend auf environment setzen (Prod, QA etc) ok
// - Für build korrekte index kopieren desktop oder phone
// - set version via git oder wie in preports
// - compile mit sencha (grunt-run oder grunt-contrib-commands)
// - copy to cordova or desktop
// - (optional) run cordova
// - (optional) add web server



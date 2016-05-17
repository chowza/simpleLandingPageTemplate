/**
 * This gulpfile has:
 *
 * - Jade markup
 * - Stylus with Autoprefixer
 * ==========
 * HOW TO USE
 * ==========
 *
 * To build to environment "dev" and run the local server, use the command:
 *
 *     gulp
 *
 * To build to specific environments:
 *
 *     gulp build --env dev [--silent]
 *     gulp build --env test
 *     gulp build --env prod
 *
/* === MODULES === */

    var gulp = require('gulp')

    // utils
    ,   gutil       = require('gulp-util')              // console logging
    ,   watch       = require('gulp-watch')             // watch for changes (gulp-watch didn't handle errors well)
    ,   runSequence = require('run-sequence')           // run tasks in order
    ,   connect     = require('gulp-connect')           // run local server
    ,   sourcemaps  = require('gulp-sourcemaps')        // map compiled code
    ,   rename      = require('gulp-rename')            // rename files or folders
    ,   del         = require("del")                    // delete files and folders
    ,   gulpif      = require('gulp-if')                // execute operations conditionally

    // javascript
    ,   glob        = require('glob')
    ,   browserify  = require('browserify')             // use require() in your js
    ,   watchify    = require('watchify')             // use require() in your js
    ,   source      = require('vinyl-source-stream')    // need this for browserify
    ,   buffer      = require('vinyl-buffer')           // need this for browserify too
    ,   concat      = require('gulp-concat')            // concat js files
    ,   uglify      = require('gulp-uglify')            // minify javascript
    ,   stripDebug  = require('gulp-strip-debug')       // remove console.log() from production build
    ,   es          = require('event-stream')
    ,   fs          = require('fs')
    ,   jsonfile    = require('jsonfile')
    ,   mkdirp      = require('mkdirp')

    // jade
    ,   jade        = require('gulp-jade')              // html preprocessor
    ,   minifyHtml  = require('gulp-minify-html')       // minify html

    // css
    ,   stylus      = require('gulp-stylus')            // css preprocessor
    ,   cssmin      = require('gulp-minify-css')        // minify css and combine media queries
    ,   autoprefixer= require('autoprefixer-stylus')        // minify css and combine media queries

    // configuration
    ,   args        = require('yargs').argv             // command line arguments (e.g. "gulp build --env dev")
    ,   config      = require('./gulp-config')          // settings and build paths
    ,   env         = 'local'                             // environment to build for (e.g. dev, test, prod)
    ;



/* === UTILS === */

    /**
     * Split error messages into readable lines.
     * @param  {Object} e Error message
     */
    function handleError(e) {
        var message = e.message.split('\n');

        for(var line in message) {
            gutil.log(message[line]);
        }

        gutil.log(e.stack);
        gutil.beep();
    }

    /**
     * Set the active environment using command line args (e.g. "gulp --env dev")
     */
    function init() {
        // set environment if specified
        env = !!args.env ? args.env : env;
        gutil.log('Building for', gutil.colors.yellow(env), 'environment.');
    }




/* === PREPROCESSOR TASKS === */

    // Set the active environment using command line args (e.g. "gulp --env dev")
    gulp.task('init', init);

    // Preprocess JavaScript files.

    gulp.task('watch-scripts',function(done){

            var src  = config.src + config.scripts.src,
                dest = config.environments[env].dest + config.scripts.dest,
                generateSourcemaps = (env === 'dev' || env ===  'local');
            glob(src,function(err,files){
              if (err){
                handleError(err)
                done(err)
              }

              var tasks = files.map(function(entry){
                var b = browserify({
                    entries: [entry],
                    debug: generateSourcemaps,
                    cache: {},
                    packageCache: {}
                });
                var w = watchify(b);
                w.on('update',rebundle);
                w.on('log',gutil.log);


                function rebundle(){
                    return w.bundle()
                    .on('error', handleError)
                    .pipe(source(entry))
                    .pipe(buffer())
                    .pipe(gulpif(env != 'dev' && env != 'local', stripDebug()))
                    .pipe(gulpif(env != 'dev' && env != 'local', uglify()))
                    .pipe(rename({dirname:''}))
                    .pipe(gulp.dest(dest))
                    .pipe(connect.reload())
                }

                return rebundle();
              })
              es.merge(tasks).on('end',done)
            })
        })

        // Preprocess JavaScript files.
        // Uses Coffeescript and Browserify.
        // If the environment is other than "dev", this will also minify.
        // If the environment is prod, console.log() calls are stripped.
        gulp.task('scripts', function(done) {

            var src  = config.src + config.scripts.src,
                dest = config.environments[env].dest + config.scripts.dest,
                generateSourcemaps = (env === 'dev' || env ===  'local');

            glob(src,function(err,files){
              if (err){
                handleError(err)
                done(err)
              }
              var tasks = files.map(function(entry){
                return browserify({ entries: [entry], debug: generateSourcemaps})
                    .bundle()
                    .on('error', handleError)
                    .pipe(source(entry))
                    .pipe(buffer())
                    .pipe(gulpif(env != 'dev' && env != 'local', stripDebug()))
                    .pipe(gulpif(env != 'dev' && env != 'local', uglify()))
                    .pipe(rename({dirname:''}))
                    .pipe(gulp.dest(dest))
              })
              es.merge(tasks).on('end',done)
            })

        });
    // Preprocess Jade files.
    // Files that start with an underscore (e.g. _template.jade) are ignored and treated as partials.
    gulp.task('markup', function() {

        var src  = config.src + config.markup.src,
            dest = config.environments[env].dest + config.markup.dest;

        // gutil.log('Rebuilding Jade.');
        gulp.src(src)
            .pipe(
                jade({ pretty: true, locals: config.environments[env] })
                .on('error', handleError)
            )
            .pipe(minifyHtml({
                empty: true
            }))
            .pipe(rename({dirname:''}))
            .pipe(gulp.dest(dest))
            .pipe(connect.reload());
    });

    // Preprocess stylesheets.
    // This will also concatenate media queries. This allows using media queries as
    // children while writing styles, instead of being forced to place unrelated
    // elements into a shared media query. See example styles for a demo.
    gulp.task('styles', function() {

        var src  = config.src + config.styles.src,
            dest = config.environments[env].dest + config.styles.dest;


        gulp.src(src)
            .on('error', handleError)
            .pipe(sourcemaps.init())
            .pipe(stylus({
                use:[autoprefixer()]
            }))
            .pipe(cssmin({sourceMap: true}))
            .pipe(sourcemaps.write())
            .pipe(rename({dirname:''}))
            .pipe(gulp.dest(dest))
            .pipe(connect.reload());
    });

    // Copy asset files (images, sounds, etc).
    gulp.task('assets', function() {

        var src  = config.src + config.assets.src,
            dest = config.environments[env].dest + config.assets.dest;

        // gutil.log('Copying assets.');

        gulp.src(src)
            .pipe(gulp.dest(dest));

    });


/* === CLEAN TASK === */

    gulp.task("clean",function(){
        var src  = config.environments[env].dest;
        return del([src]);
    });

/* === BUILD TASKS === */

    // Watch for changes.
    gulp.task('watch', function() {
        gutil.log('Watching for changes.');
        gulp.watch(config.src + config.assets.watch,  ['assets'] );
        gulp.watch(config.src + config.markup.watch,  ['markup'] );
        gulp.watch(config.src + config.styles.watch,  ['styles'] );
    });

    // Start the local server.
    gulp.task('connect', function() {
        console.log(config.environments[env].dest);
        connect.server({
            root: config.environments[env].dest,
            livereload: {
               debounceDelay: 50
            },
            port: 9000
        });
    });

    // Configure settings, copy assets and run preprocessors.
    gulp.task('build', ['init',"clean"], function() {
        return runSequence([ 'assets', 'markup', 'styles', 'scripts' ]);
    });

    // Build, start server and watch for changes.
    gulp.task('default', function() {
        runSequence([ 'init', 'build', 'connect', 'watch','watch-scripts']);
    });

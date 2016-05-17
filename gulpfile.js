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

var gulp = require('gulp');

// utils

var gutil = require('gulp-util');                 // console logging
var runSequence = require('run-sequence');        // run tasks in order
var connect = require('gulp-connect');            // run local server
var sourcemaps = require('gulp-sourcemaps');      // map compiled code
var rename = require('gulp-rename');              // rename files or folders
var del = require('del');                         // delete files and folders
var gulpif = require('gulp-if');                  // execute operations conditionally

// javascript
var glob = require('glob');                       // allow browserify to use globs (*)
var browserify = require('browserify');           // use require() in your js
var watchify = require('watchify');               // use require() in your js
var source = require('vinyl-source-stream');      // need this for browserify
var buffer = require('vinyl-buffer');             // need this for browserify too
var uglify = require('gulp-uglify');              // minify javascript
var stripDebug = require('gulp-strip-debug');     // remove console.log() from production build
var es = require('event-stream');

// jade
var jade = require('gulp-jade');                  // html preprocessor
var minifyHtml = require('gulp-minify-html');     // minify html

// css
var stylus = require('gulp-stylus');              // css preprocessor
var cssmin = require('gulp-minify-css');          // minify css and combine media queries
var autoprefixer = require('autoprefixer-stylus');// minify css and combine media queries

// configuration
var args = require('yargs').argv;                 // command line arguments
var config = require('./gulp-config');            // settings and build paths
var env = 'local';                                // environment to build for

// presets for babel, does not need to be required, but must be installed
// require('babel-preset-es2015');

/* === UTILS === */

/**
 * Split error messages into readable lines.
 * @param  {Object} e Error message
 */
function handleError(e) {
  // var message = e.message.split('\n');
  // gutil.log(message);
  // message.forEach(function logError(line) {
  //   gutil.log(line);
  // });

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

gulp.task('watch-scripts', function watchScripts(done) {
  var src = config.src + config.scripts.src;
  var dest = config.environments[env].dest + config.scripts.dest;
  var generateSourcemaps = (env === 'dev' || env === 'local');

  glob(src, function globFiles(err, files) {
    var tasks;
    if (err) {
      handleError(err);
      done(err);
    }

    tasks = files.map(function browserifyFiles(entry) {
      var b = browserify({
        entries: [entry],
        debug: generateSourcemaps,
        cache: {},
        packageCache: {}
      });
      var w = watchify(b);

      // uncomment for es6
      // w.transform('babelify', {
      //   sourceMaps: generateSourcemaps,
      //   presets: ['babel-preset-es2015'],
      //   compact: false
      // });
      // .transform('browserify-shim');

      function rebundle() {
        return w.bundle()
                .on('error', handleError)
                .pipe(source(entry))
                .pipe(buffer())
                .pipe(gulpif(env !== 'dev' && env !== 'local', stripDebug()))
                .pipe(gulpif(env !== 'dev' && env !== 'local', uglify()))
                .pipe(rename({ dirname: '' }))
                .pipe(gulp.dest(dest))
                .pipe(connect.reload());
      }
      w.on('update', rebundle);
      w.on('log', gutil.log);

      return rebundle();
    });
    es.merge(tasks).on('end', done);
  });
});

    // Preprocess JavaScript files.
    // Uses Coffeescript and Browserify.
    // If the environment is other than "dev", this will also minify.
    // If the environment is prod, console.log() calls are stripped.
gulp.task('scripts', function scripts(done) {
  var src = config.src + config.scripts.src;
  var dest = config.environments[env].dest + config.scripts.dest;
  var generateSourcemaps = (env === 'dev' || env === 'local');

  glob(src, function globFiles(err, files) {
    var tasks;
    if (err) {
      handleError(err);
      done(err);
    }
    tasks = files.map(function browserifyFiles(entry) {
      return browserify({ entries: [entry], debug: generateSourcemaps })
                // uncomment below for es6
            // .transform('babelify', {
            //   sourceMaps: generateSourcemaps,
            //   presets: ['babel-preset-es2015'],
            //   compact: false
            // })
            // .transform('browserify-shim')
            .bundle()
            .on('error', handleError)
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(gulpif(env !== 'dev' && env !== 'local', stripDebug()))
            .pipe(gulpif(env !== 'dev' && env !== 'local', uglify()))
            .pipe(rename({ dirname: '' }))
            .pipe(gulp.dest(dest));
    });
    es.merge(tasks).on('end', done);
  });
});

// Preprocess Jade files.
// Files that start with an underscore (e.g. _template.jade) are ignored
// and treated as partials.
gulp.task('markup', function markup() {
  var src = config.src + config.markup.src;
  var dest = config.environments[env].dest + config.markup.dest;

  // gutil.log('Rebuilding Jade.');
  gulp.src(src)
        .pipe(
            jade({ pretty: true, locals: config.environments[env] })
            .on('error', handleError)
        )
        .pipe(minifyHtml({
          empty: true
        }))
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest(dest))
        .pipe(connect.reload());
});

// Preprocess stylesheets.
gulp.task('styles', function styles() {
  var src = config.src + config.styles.src;
  var dest = config.environments[env].dest + config.styles.dest;

  gulp.src(src)
        .on('error', handleError)
        .pipe(sourcemaps.init())
        .pipe(stylus({
          use: [autoprefixer()]
        }))
        .pipe(cssmin({ sourceMap: true }))
        .pipe(sourcemaps.write())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest(dest))
        .pipe(connect.reload());
});

// Copy asset files (images, sounds, etc).
gulp.task('assets', function assets() {
  var src = config.src + config.assets.src;
  var dest = config.environments[env].dest + config.assets.dest;

  // gutil.log('Copying assets.');
  gulp.src(src)
        .pipe(gulp.dest(dest));
});


/* === CLEAN TASK === */

gulp.task('clean', function clean() {
  var src = config.environments[env].dest;
  return del([src]);
});

/* === BUILD TASKS === */

// Watch for changes.
gulp.task('watch', function watch() {
  gutil.log('Watching for changes.');
  gulp.watch(config.src + config.assets.watch, ['assets']);
  gulp.watch(config.src + config.markup.watch, ['markup']);
  gulp.watch(config.src + config.styles.watch, ['styles']);
});

// Start the local server.
gulp.task('connect', function serve() {
  connect.server({
    root: config.environments[env].dest,
    livereload: {
      debounceDelay: 50
    },
    port: 9000
  });
});

// Configure settings, copy assets and run preprocessors.
gulp.task('build', ['init', 'clean'], function build() {
  return runSequence(['assets', 'markup', 'styles', 'scripts']);
});

// Build, start server and watch for changes.
gulp.task('default', function defaultTask() {
  runSequence(['init', 'build', 'connect', 'watch', 'watch-scripts']);
});

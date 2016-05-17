# Simple Landing Page Template

A simple template for making pages in Jade, Stylus, Browserify and Gulp.

Includes:
  - social ready to be quickly hooked up
  - reset stylesheet
  - multiple build environments
  - browserify set up
  - eslint based on airbnb's js guide
  - es6 ready by uncommenting w.transform('babelify')

### Version
0.0.1

### Tech

* Gulp
* Browserify (including watchify script)
* Stylus (including autoprefixer)
* Jade
* ES2015 (needs manual hookup)

### For ES2015
In the gulp file uncomment out the two sections `w.transform('babelify')`
under the gulp tasks scripts and watch-scripts

### Installation

You need Gulp installed globally:

```sh
$ npm i -g gulp
```

```sh
$ sudo npm install
$ gulp # to develop with watchify
$ # gulp build --env prod
```

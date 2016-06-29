// Configuration settings for Gulp.
module.exports = {

  src: './src/', // source code root

    // Unique settings for each build environment (e.g. server settings)
  environments: {
    local: {
      dest: 'dist/local/',
      url: 'http://localhost:9000/',
      fbId: '',
      analyticsId: '',
      debug: true
    },
    dev: {
      dest: 'dist/dev/',
      url: '',
      fbId: '',
      analyticsId: '',
      debug: true
    },
    test: {
      dest: 'dist/test/',
      url: '',
      fbId: '',
      analyticsId: '',
      debug: true
    },
    prod: {
      dest: 'dist/prod/',
      url: '',
      fbId: '',
      analyticsId: '',
      debug: false
    }
  },

    // Images, sounds, etc
  assets: {
    src: 'asset/**/*',
    watch: 'asset/**/*',
    dest: 'asset'
  },

    // HTML/Pug markup
  markup: {
    src: 'view/**/!(_)*.pug', // ignore template files starting with underscore _
    watch: '**/*.pug',
    dest: ''
  },

    // Stylesheets
  styles: {
    src: 'view/**/*.styl',
    watch: '**/*.styl',
    dest: ''
  },

    // Javascript
  scripts: {
    src: 'view/**/*.js',
    watch: '**/*.js',
    dest: ''
  },

  readme: 'README.md'
};

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
            cmsUrl: "",
            fbId: '',
            analyticsId: '',
            debug: false
        }
    },

    // Images, sounds, etc
    assets: {
        src     : 'asset/**/*',
        watch   : 'asset/**/*',
        dest    : 'asset'
    },

    // HTML/Jade markup
    markup: {
        src     : '**/!(_)*.jade', // ignore template files starting with underscore _
        watch   : '**/*.jade',
        dest    : ''
    },

    // Stylesheets
    styles: {
        src     : '*.styl',
        watch   : '**/*.styl',
        dest    : ''
    },

    // Javascript
    scripts: {
        src     : 'index.js',
        watch   : '**/*.js',
        dest    : ''
    },

    readme  : 'README.md'
}

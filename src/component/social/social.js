/* global FB*/
/* global Global*/

function loadFacebook() {
  window.fbAsyncInit = function fbAsyncInit() {
    FB.init({
      appId: Global.fbId,
      xfbml: false,
      version: 'v2.6'
    });
  };
  (function fbScript(d, s, id) {
    var js;
    var fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}
function fbShare() {
  FB.ui({
    method: 'feed',
    name: '',
    picture: Global.url + '/asset/social/facebook.png',
    link: Global.url,
    caption: '',
    description: ''
  }, function res() {

  });
}

module.exports = {
  loadFacebook: loadFacebook,
  fbShare: fbShare
};

loadFacebook = function() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : Global.fbId,
            xfbml      : false,
            version    : 'v2.6'
        });
    };
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}
fbShare = function(){
  FB.ui({
      method: 'feed',
      name: '',
      picture: Global.url + '/asset/social/facebook.png',
      link: Global.url,
      caption: '',
      description: ''
  }, function(response){ console.log(response) });
}

module.exports = {
  loadFacebook: loadFacebook,
  fbShare: fbShare
}

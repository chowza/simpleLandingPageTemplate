loadFacebook = function() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '',
            xfbml      : false,
            version    : 'v2.4'
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
      picture: '',
      link: '',
      caption: '',
      description: ''
  }, function(response){ console.log(response) });
}

module.exports = {
  loadFacebook: loadFacebook,
  fbShare: fbShare
}

loadFacebook = function() {
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '903432469737348',
            xfbml      : false,
            version    : 'v2.4'
        });
    };
    console.log ("TEST")
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
      name: 'ON THE STAGE. ABOVE THE CROWD. INSIDE THE MUSIC.',
      picture: URL + 'img/shareLogo.jpg',
      link: URL,
      caption: 'Experience Pop Evil in VR',
      description: 'Pop Evil is giving fans a whole new way to experience a live performance. Check out this unreal VR experience: ON THE STAGE. ABOVE THE CROWD. INSIDE THE MUSIC. Experience a concert like never before with Pop Evil VR.'
  }, function(response){ console.log(response) });
}

module.exports = {
  loadFacebook: loadFacebook,
  fbShare: fbShare
}

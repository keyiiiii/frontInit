$(document).ready(function(){
  // lazy load img
  $('img').unveil(300, function() {
    $(this).addClass('am-fade-in');
  });
  // tapイベント
  $('body').tappivate();
});
watchRe = /https:\/\/www\.youtube\.com\/watch\?v/
watching = false;
currentURL = "";
skipperStarted = false;
tID = null;
videoTitle = null;

skipAdAutomatically = function(){ 

  preSkipButton = document.getElementsByClassName('videoAdUiPreSkipButton')[0];
  skipButton = document.getElementsByClassName('videoAdUiSkipButton')[0];

  play_button = document.getElementsByClassName('ytp-play-button')[0];
  muteButton = document.getElementsByClassName('ytp-mute-button')[0];
  if (muteButton.getAttribute("title") == "Unmute"){
    muteButton.click();
  }

  if (preSkipButton == null || skipButton == null){
    visit_advertiser_link = document.getElementsByClassName('videoAdUiVisitAdvertiserLinkText')[0];
    if (visit_advertiser_link != null){
      console.log("unskippable ad");
      tID = window.setInterval(function(){
        visit_advertiser_link = document.getElementsByClassName('videoAdUiVisitAdvertiserLinkText')[0];
        if (visit_advertiser_link != null){
          if (muteButton.getAttribute("title") == "Mute"){
            muteButton.click();
          }
        }
        else{
          muteButton.click();
          window.clearInterval(tID)
          tID = null;
        }
      }, 1000);
    }
    else{
      console.log("not an ad");
    }
    return;
  }

  muteButton.click();
  tID = window.setInterval(function(){
    visit_advertiser_link = null;
    play_button.click();
    currentTimeElement = document.getElementsByClassName('ytp-progress-bar')[0];
    totalTime = parseInt(currentTimeElement.getAttribute('aria-valuemax'));
    //console.log("total time");
    //console.log(totalTime);
    play_button.click();
    if (totalTime < 31){
      //console.log("short ad but skippable");
      visit_advertiser_link = document.getElementsByClassName('videoAdUiVisitAdvertiserLinkText')[0];
      if (visit_advertiser_link == null){
        if (muteButton.getAttribute("title") == "Unmute"){
          muteButton.click();
        }
        window.clearInterval(tID);
        tID = null;
      }
    }
    else{
      //console.log("long ad and skippable");
      currentTime = currentTimeElement.getAttribute('aria-valuenow');
      //console.log(currentTime);
      if (parseInt(currentTime)>31){
        muteButton.click();
        //console.log("time to click!!!");
        window.clearInterval(tID);
        tID = null;
        skipButton.click();
      }
      visit_advertiser_link = document.getElementsByClassName('videoAdUiVisitAdvertiserLinkText')[0];
      if (visit_advertiser_link == null){
        if (muteButton.getAttribute("title") == "Unmute"){
          muteButton.click();
        }
        window.clearInterval(tID);
        tID = null;
        console.log("either video was manually skipped or the normal video started playing");
      }
    }
  }, 1000);
}

console.log("testing");
//skipAdAutomatically();

watcher = window.setInterval(function(){  
  videoTitle = null;
  if (watchRe.exec(window.location.href) == null){
    //console.log("not watching video");
    currentURL = "";
    if (tID != null){
      window.clearInterval(tID);
      tID = null;
    }
  }
  else{
    //console.log("watching video");
    //console.log(currentURL);
    //console.log(currentURL != window.location.href);
    if(currentURL != window.location.href){ //the video has changed
      currentURL = window.location.href;
      if(tID != null){
        window.clearInterval(tID);
        tID = null;
      }
      //console.log("finding the mute button");
      waitForVideo = window.setInterval(function(){
        videoTitle = document.getElementById("eow-title");
        console.log("video title");
        console.log(videoTitle);
        if (videoTitle != null){
          console.log("starting skipper");
          window.clearInterval(waitForVideo);
          w = window.setTimeout(skipAdAutomatically, 2000);
        }
      }, 1000)
    }
  }
}, 1000);

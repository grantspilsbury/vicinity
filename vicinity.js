var Vicinity = function(done) {

  // defaults
  this.lat = 0;
  this.lng = 0;
  this.screenSize = "";
  this.orientation = "landscape"
  this.ad = {
    landingUrl: null,
    imgSrc: null,
    width: null,
    height: null,
    getBannerHtml: function() {
      return '<a href=' + this.landingUrl + '><img src=' + this.imgSrc + ' width=' + this.width + ' height=' + this.height + ' /></a>'
    }
  };

  this.getLatLng = function(vicinity, done) {
    getViaHtml5 = function(done) {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          vicinity.lat = position.coords.latitude;
          vicinity.lng = position.coords.longitude;
          done();
        }, function(e) {
          console.warn('ERROR(' + e.code + '): ' + e.message);
        });
      } else {
        console.warn("Browser doesn't support Geolocation");
      }
    };
    getViaHtml5(done);
  };

  this.getScreenSize = function(vicinity) {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    vicinity.screenSize = width + "x" + height;
  };

  this.getOrientation = function(vicinity) {
    vicinity.orientation = (window.innerHeight > window.innerWidth) ? "portrait" : "landscape";
  };

  this.formToXml = function (lat, lon, screenSize) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
      + "<AdRequest>"
      + "<type>html</type><pubReference>34</pubReference><advReference>adresfsghdkkf</advReference>"
      + "<ScreenSize>"+screenSize+"</ScreenSize><bannerWidth></bannerWidth><bannerHeight></bannerHeight>"
      + "<virtSize>0</virtSize><horiSize>?</horiSize><formatUrl>?</formatUrl>"
      + "<refresh>30</refresh><longitude>"+lon+"</longitude><latitude>"+lat+"</latitude>"
      + "<encryptType>?</encryptType><networkId>?</networkId><imei>357559048224673</imei>"
      + "<msisdn>27828781462</msisdn><socialType>FB</socialType><orientation>bottom</orientation>"
      + "</AdRequest>";
  };

  this.getAd = function (vicinity, done) {
    $.ajax({
      type: 'POST',
      contentType: 'application/xml',
      url: "//ad.vic-m.co:8080/AdService/Api/xml-api/getAd",
      dataType: "xml",
      data: vicinity.formToXml(vicinity.lat, vicinity.lng, vicinity.screenSize),
      success: function (data) {
        $(data).find('rAdContent').each(function () {
          vicinity.ad.landingUrl = $(this).find('landingurl').text();
          vicinity.ad.imgSrc = $(this).find('imgSrc').text();
          vicinity.ad.width = $(this).find('width').text();
          vicinity.ad.height = $(this).find('height').text();
        });
        done(vicinity);
      },
      error: function (xhr) {
        console.log("Ad not found ! Please contact to Ad Manager");
      }
    });
  };

  this.init = function(done) {
    var that = this;
    this.getScreenSize(that);
    this.getLatLng(that, function() {
      that.getAd(that, done)
    });
  };

  this.init(done);
};


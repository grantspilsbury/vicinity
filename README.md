#Vicinity

Copy the vicinity.js file to your server.
Copy the vicinity.css file to your server.

Copy the jquery.min.js file to your server. Note jquery v 1.11.1 is being used as older Blackberry's will not work on the latest version.

Include the following between the head tags of your html page
```html
  <link rel="stylesheet" type="text/css" href="vicinity.css">
  <script src="./jquery.min.js"></script>
```

Add the following between the body tags of your html page.

```html
  <div id="sticky" class="banner-sticky" style="position: fixed;">
  </div>
```

Add the following JS to the bottom of your html page, just above the closing body tag:

```html
  <script type="text/javascript" src="./vicinity.js"></script>
  
  <script type="text/javascript">

    var pubReference = 34;
    var sessionId = ""; // possibly get from a cookie

    new Vicinity (pubReference, sessionId, function(result) {
    // success function
      $(function() {
        $("#ad").html(result.ad.getBannerHtml());
        displayResults(result);
      })
    }, function(result) {
      // error function
      $(function() {
        console.log('error');
        console.log(result);
        displayResults(result);
      })
    });
  </script>
```

Make sure to change the pubReference to your specific publisher reference number.

Include a sessionId if your site stores the session ID e.g. in a cookie.

#Vicinity

Make sure you have a div called say 'ad' available where you want to display the banner.

```html
  <body>
    <div id="ad"></div>
  </body>
```

Add the following JS to your page:

```html
  <script type="text/javascript" src="./vicinity.js"></script>
  <script type="text/javascript">
    new Vicinity (function(result) {
      $(function() {
        $("#ad").html(result.ad.getBannerHtml());
      })
    });
  </script>
```

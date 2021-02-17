# readme.md
Page-Hit collects basic requester and navigation event data.  Every mouse click on the site triggers a Page Hit event.  Navigation Page Hit events are persisted for aggregation and analysis of user agents and site activity.

## Usage

1. Load `page-hit.js` at the top of the HTML page.

``` html

  <script async src="./page-hit/page-hit.js" ></script>

```

2. Initialize a PageHit instance at the bottom of the page.

``` javascript

  var pageHit = PageHit();
  pageHit.config.set.spListName("page_hit");
  pageHit.config.set.spMetadataType("SP.Data.Page_x005f_hitListItem");
  pageHit.pageContext.set();

```

### Vue Project Setup

1. Copy `page-hit.js` into the project's `./public` folder.

``` 
  mkdir ./public/page-hit
  cp ../page-hit/src/page-hit.js ./public/page-hit/

```
2. Follow the steps above in Usage for the project's `./public/index.html` file.

## Data Model
For a developer, the standard JSON format is simple and flat.  The format is easy to marshal into JavaScript as an object for browsers and apps.  Most open source libraries also support JSON, such as [Drill] (https://drill.apache.org/), [Zeppelin] (https://zeppelin.apache.org/), and [d3] (https://d3js.org).  

For a user who does not have programming skills, the open source product [ECharts] (https://echarts.apache.org) is an option to explore for interactive web-based visualization and analysis.  Even databases and spreadsheets may also import the JSON format for analysis and visualization.

### Page-Hit Data Points
The Page-Hit data points are the following:

 * APM (Access Policy Manager) Session Identifier
 * Timestamp
 * User Id
 * Geo Location
 * Browser
 * Operating System
 * Platform
 * Context Hyperlink Reference
 * Click Target

#### Mapping

  "apmSessionId":     Response.Cookie.MRHSession
  "timestamp":        Response.Header.Date
  "userId":           _spPageContextInfo.userId
  "geoLocation":      navigator.geolocation
  "browser":          navigator.userAgent
  "operatingSystem":  navigator.oscpu
  "platform":         navigator.platform
  "contextHref":      window.location.href
  "click":            document.event.target

#### JSON sample

``` json
  {
    "apmSessionId": "89697491a1aaf0874004f2feaada52de",
    "timestamp": 1573256951923,
    "userId": 4139,
    "geoLocation": {
      "lat": "", 
      "long": ""
    },
    "browser": "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0",
    "operatingSystem": "Linux x86_64",
    "platform": "Linux x86_64",
    "contextHref": "/sites/MCTSSA/Development/Pages/Home.aspx",
    "click": {
      "id": "google",
      "href": "https://google.com/"
    }
  }
```

### Session Data Points
Session Data Points are derived from Page-Hit data that is consolidated and aggregated by Session.

A process is executed at a specified time to produce Session Data Points for a time interval.

Session Data Points are the following:

 * User
 * Geographic Location
 * Browser
 * Operating System
 * Platform
 * Start Time
 * End Time
 * Click Hyperlink Path

#### Count Metrics
Several count metrics are available from the session data points.

Counts are available for the following:

  * Sessions
  * Browsers
  * Hyperlinks
  * Geographic Locations
  * Operating Systems
  * Platforms
  * Users

---
20210208

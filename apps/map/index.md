---
layout: laboratory
title: Map Laboratory by Tiven
excerpt: "A Laboratory for Map layer visualization by Tiven"
tags: [Map, Visualization, D3.js, Leaflet.js, Turf.js]
laboratory:
  title: "Map Laboratory"
  description: "In this laboratory there are many big data analysis application demos on web map. We used a lot of opensource tools, for example Leaflet.js Turf.js D3.js ..."
projects:
  - title: "D3.js Voronoi on Map"
    description: "Use 'voronoi' function of D3.js to visualize and analysis real-time air quality index (AQI) on leaflet map."
    page: "realtime-aqi-via-d3-voronoi-on-map.html"
    previewImage: "images/thumbs/D3.js-Voronoi-on-Map.jpg"
  - title: "Triangulated Irregular Network on Map"
    description: "Visualize the AQI to triangulated irregular network on leaflet map by 'tin' function of Turj.js."
    page: "realtime-aqi-via-turf-tin-on-map-local.html"
    previewImage: "images/thumbs/Triangulated-Irregular-Network-on-Map.jpg"
  - title: "Visualization by Hexagon on Map"
    description: "Use hexagon to analysis the AQI on map by 'hexGrid' function of Turf.js."
    page: "realtime-aqi-via-turf-hex-on-map.html"
    previewImage: "images/thumbs/Hexagon-on-Map.jpg"
  - title: "Visualization by Isolines on Map"
    description: "Use isolines to analysis the AQI on map by 'isolines' function of Turf.js."
    page: "realtime-aqi-via-turf-isolines-on-map.html"
    previewImage: "images/thumbs/AQI-Isolines-on-Map.jpg"
---

```javascript
(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        exports = factory( root, require('turf'), require('AQITurf') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['exports', 'turf', 'AQITurf'], factory);
    } else {
        // Browser globals
        factory( root, root.turf, root.AQITurf );
    }
}(this, function ( module, turf, AQITurf ) {

}));
```

<section id="four">
  <h2>Elements</h2>

  <section>

  </section>
  <section>
    <h4>Text</h4>
    <p>This is <b>bold</b> and this is <strong>strong</strong>. This is <i>italic</i> and this is <em>emphasized</em>.
    This is <sup>superscript</sup> text and this is <sub>subscript</sub> text.
    This is <u>underlined</u> and this is code: <code>for (;;) { ... }</code>. Finally, <a href="#">this is a link</a>.</p>
    <hr />
    <header>
      <h4>Heading with a Subtitle</h4>
      <p>Lorem ipsum dolor sit amet nullam id egestas urna aliquam</p>
    </header>
    <p>Nunc lacinia ante nunc ac lobortis. Interdum adipiscing gravida odio porttitor sem non mi integer non faucibus ornare mi ut ante amet placerat aliquet. Volutpat eu sed ante lacinia sapien lorem accumsan varius montes viverra nibh in adipiscing blandit tempus accumsan.</p>
    <header>
      <h5>Heading with a Subtitle</h5>
      <p>Lorem ipsum dolor sit amet nullam id egestas urna aliquam</p>
    </header>
    <p>Nunc lacinia ante nunc ac lobortis. Interdum adipiscing gravida odio porttitor sem non mi integer non faucibus ornare mi ut ante amet placerat aliquet. Volutpat eu sed ante lacinia sapien lorem accumsan varius montes viverra nibh in adipiscing blandit tempus accumsan.</p>
    <hr />
    <h2>Heading Level 2</h2>
    <h3>Heading Level 3</h3>
    <h4>Heading Level 4</h4>
    <h5>Heading Level 5</h5>
    <h6>Heading Level 6</h6>
    <hr />
    <h5>Blockquote</h5>
    <blockquote>Fringilla nisl. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan faucibus. Vestibulum ante ipsum primis in faucibus lorem ipsum dolor sit amet nullam adipiscing eu felis.</blockquote>
    <h5>Preformatted</h5>
    <pre><code>i = 0;

while (!deck.isInOrder()) {
print 'Iteration ' + i;
deck.shuffle();
i++;
}

print 'It took ' + i + ' iterations to sort the deck.';</code></pre>
  </section>
</section>
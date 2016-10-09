---
layout: laboratory
title: D3.js Laboratory by Tiven
excerpt: "A Laboratory for D3.js usage by Tiven"
tags: [D3.js, Sunburst]
laboratory:
  title: "D3.js Laboratory"
  description: "D3.js is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG, and CSS. D3’s emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation."
projects:
  - title: "Zoomable sequence sunburst of D3.js"
    description: "Zoomable sequence sunburst of D3.js"
    page: "zoom-sequence-sunburst.html"
    previewImage: "./images/zoom-sequence-sunburst.jpg"
  - title: "C3.js D3-based reusable chart library"
    description: "C3 makes it easy to generate D3-based charts by wrapping the code required to construct the entire chart. We don't need to write D3 code any more."
    page: "c3/index.html"
    previewImage: "/apps/map/images/thumbs/02.jpg"
---

## [Chart used C3.js][3]

We used C3.js that is a reusable chart library based [D3.js][1].

Import two librarys

```html
<link href="/libs/c3/0.4.11/c3.css" rel="stylesheet" type="text/css">

<script src="/libs/d3/3.5.17/d3.min.js" charset="utf-8"></script>
<script src="/libs/c3/0.4.11/c3.js"></script>
```

The simple javascript code

```javascript
var chart = c3.generate({
        data: {
          columns: [
            ['data1', 30, 200, 100, 400],
            ['data2', 50, 20,  10,  40]
          ],
          type: 'bar',
          selection: {
            enabled: true
          },
          onclick: function (d, element) {
            chart.transform('line');
          }
        },
        axis: {
          rotated: true,
        },
        zoom: {
          enabled: true
        }
      });
```

<br/>

## [Zoomable sequence sunburst used D3.js][2]

We created a zoomable sequence sunburst used D3.js.

```javascript
var colors = {
          "home": "#5687d1",
          "product": "#7b615c",
          "search": "#de783b",
          "account": "#6ab975",
          "other": "#a173d1",
          "end": "#bbbbbb"
        };
        
var zSeqSunburst = new ZoomSequenceSunburst("#chart", {
//  depth: 3,
    innerHeigh: 2,
    width: 750,
    height: 600,
    breadCrumb: {
      w: 75, h: 30, s: 3, t: 10
    }
  })
  .fill(function(d) {
    return colors[d.data.name];
  })
// .breadcrumbText(function(d) {
//    return d.value;
// })
  ;

  // Use d3.text and d3.csv.parseRows so that we do not need to have a header
  // row, and can receive the csv as an array of arrays.
  d3.text("visit-sequences.csv", function(text) {
    var csv = d3.csvParseRows(text);
    var json = buildHierarchy(csv);
    zSeqSunburst.create(json);
  });
```

[1]:https://d3js.org/
[2]:zoom-sequence-sunburst.html
[3]:c3/index.html

<!--
<section>
  <h4>Lists</h4>
  <div class="row">
    <div class="6u 12u$(xsmall)">
      <h5>Unordered</h5>
      <ul>
        <li>Dolor pulvinar etiam magna etiam.</li>
        <li>Sagittis adipiscing lorem eleifend.</li>
        <li>Felis enim feugiat dolore viverra.</li>
      </ul>
      <h5>Alternate</h5>
      <ul class="alt">
        <li>Dolor pulvinar etiam magna etiam.</li>
        <li>Sagittis adipiscing lorem eleifend.</li>
        <li>Felis enim feugiat dolore viverra.</li>
      </ul>
    </div>
    <div class="6u$ 12u$(xsmall)">
      <h5>Ordered</h5>
      <ol>
        <li>Dolor pulvinar etiam magna etiam.</li>
        <li>Etiam vel felis at lorem sed viverra.</li>
        <li>Felis enim feugiat dolore viverra.</li>
        <li>Dolor pulvinar etiam magna etiam.</li>
        <li>Etiam vel felis at lorem sed viverra.</li>
        <li>Felis enim feugiat dolore viverra.</li>
      </ol>
      <h5>Icons</h5>
      <ul class="icons">
        <li><a href="#" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
        <li><a href="#" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
        <li><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>
        <li><a href="#" class="icon fa-github"><span class="label">Github</span></a></li>
        <li><a href="#" class="icon fa-dribbble"><span class="label">Dribbble</span></a></li>
        <li><a href="#" class="icon fa-tumblr"><span class="label">Tumblr</span></a></li>
      </ul>
    </div>
  </div>
  <h5>Actions</h5>
  <ul class="actions">
    <li><a href="#" class="button special">Default</a></li>
    <li><a href="#" class="button">Default</a></li>
  </ul>
  <ul class="actions small">
    <li><a href="#" class="button special small">Small</a></li>
    <li><a href="#" class="button small">Small</a></li>
  </ul>
  <div class="row">
    <div class="6u 12u$(small)">
      <ul class="actions vertical">
        <li><a href="#" class="button special">Default</a></li>
        <li><a href="#" class="button">Default</a></li>
      </ul>
    </div>
    <div class="6u$ 12u$(small)">
      <ul class="actions vertical small">
        <li><a href="#" class="button special small">Small</a></li>
        <li><a href="#" class="button small">Small</a></li>
      </ul>
    </div>
    <div class="6u 12u$(small)">
      <ul class="actions vertical">
        <li><a href="#" class="button special fit">Default</a></li>
        <li><a href="#" class="button fit">Default</a></li>
      </ul>
    </div>
    <div class="6u$ 12u$(small)">
      <ul class="actions vertical small">
        <li><a href="#" class="button special small fit">Small</a></li>
        <li><a href="#" class="button small fit">Small</a></li>
      </ul>
    </div>
  </div>
  </section>

  <section>
  <h4>Table</h4>
  <h5>Default</h5>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item One</td>
          <td>Ante turpis integer aliquet porttitor.</td>
          <td>29.99</td>
        </tr>
        <tr>
          <td>Item Two</td>
          <td>Vis ac commodo adipiscing arcu aliquet.</td>
          <td>19.99</td>
        </tr>
        <tr>
          <td>Item Three</td>
          <td> Morbi faucibus arcu accumsan lorem.</td>
          <td>29.99</td>
        </tr>
        <tr>
          <td>Item Four</td>
          <td>Vitae integer tempus condimentum.</td>
          <td>19.99</td>
        </tr>
        <tr>
          <td>Item Five</td>
          <td>Ante turpis integer aliquet porttitor.</td>
          <td>29.99</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td>100.00</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <h5>Alternate</h5>
  <div class="table-wrapper">
    <table class="alt">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item One</td>
          <td>Ante turpis integer aliquet porttitor.</td>
          <td>29.99</td>
        </tr>
        <tr>
          <td>Item Two</td>
          <td>Vis ac commodo adipiscing arcu aliquet.</td>
          <td>19.99</td>
        </tr>
        <tr>
          <td>Item Three</td>
          <td> Morbi faucibus arcu accumsan lorem.</td>
          <td>29.99</td>
        </tr>
        <tr>
          <td>Item Four</td>
          <td>Vitae integer tempus condimentum.</td>
          <td>19.99</td>
        </tr>
        <tr>
          <td>Item Five</td>
          <td>Ante turpis integer aliquet porttitor.</td>
          <td>29.99</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td>100.00</td>
        </tr>
      </tfoot>
    </table>
  </div>
  </section>

  <section>
  <h4>Buttons</h4>
  <ul class="actions">
    <li><a href="#" class="button special">Special</a></li>
    <li><a href="#" class="button">Default</a></li>
  </ul>
  <ul class="actions">
    <li><a href="#" class="button big">Big</a></li>
    <li><a href="#" class="button">Default</a></li>
    <li><a href="#" class="button small">Small</a></li>
  </ul>
  <ul class="actions fit">
    <li><a href="#" class="button special fit">Fit</a></li>
    <li><a href="#" class="button fit">Fit</a></li>
  </ul>
  <ul class="actions fit small">
    <li><a href="#" class="button special fit small">Fit + Small</a></li>
    <li><a href="#" class="button fit small">Fit + Small</a></li>
  </ul>
  <ul class="actions">
    <li><a href="#" class="button special icon fa-download">Icon</a></li>
    <li><a href="#" class="button icon fa-download">Icon</a></li>
  </ul>
  <ul class="actions">
    <li><span class="button special disabled">Special</span></li>
    <li><span class="button disabled">Default</span></li>
  </ul>
  </section>

  <section>
  <h4>Form</h4>
  <form method="post" action="#">
    <div class="row uniform 50%">
      <div class="6u 12u$(xsmall)">
        <input type="text" name="demo-name" id="demo-name" value="" placeholder="Name" />
      </div>
      <div class="6u$ 12u$(xsmall)">
        <input type="email" name="demo-email" id="demo-email" value="" placeholder="Email" />
      </div>
      <div class="12u$">
        <div class="select-wrapper">
          <select name="demo-category" id="demo-category">
            <option value="">- Category -</option>
            <option value="1">Manufacturing</option>
            <option value="1">Shipping</option>
            <option value="1">Administration</option>
            <option value="1">Human Resources</option>
          </select>
        </div>
      </div>
      <div class="4u 12u$(small)">
        <input type="radio" id="demo-priority-low" name="demo-priority" checked>
        <label for="demo-priority-low">Low Priority</label>
      </div>
      <div class="4u 12u$(small)">
        <input type="radio" id="demo-priority-normal" name="demo-priority">
        <label for="demo-priority-normal">Normal Priority</label>
      </div>
      <div class="4u$ 12u(small)">
        <input type="radio" id="demo-priority-high" name="demo-priority">
        <label for="demo-priority-high">High Priority</label>
      </div>
      <div class="6u 12u$(small)">
        <input type="checkbox" id="demo-copy" name="demo-copy">
        <label for="demo-copy">Email me a copy of this message</label>
      </div>
      <div class="6u$ 12u$(small)">
        <input type="checkbox" id="demo-human" name="demo-human" checked>
        <label for="demo-human">I am a human and not a robot</label>
      </div>
      <div class="12u$">
        <textarea name="demo-message" id="demo-message" placeholder="Enter your message" rows="6"></textarea>
      </div>
      <div class="12u$">
        <ul class="actions">
          <li><input type="submit" value="Send Message" class="special" /></li>
          <li><input type="reset" value="Reset" /></li>
        </ul>
      </div>
    </div>
  </form>
  </section>

  <section>
  <h4>Image</h4>
  <h5>Fit</h5>
  <div class="box alt">
    <div class="row 50% uniform">
      <div class="12u$"><span class="image fit"><img src="../map/images/thumbs/01.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/01.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/02.jpg" alt="" /></span></div>
      <div class="4u$"><span class="image fit"><img src="../map/images/thumbs/03.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/01.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/02.jpg" alt="" /></span></div>
      <div class="4u$"><span class="image fit"><img src="../map/images/thumbs/03.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/03.jpg" alt="" /></span></div>
      <div class="4u"><span class="image fit"><img src="../map/images/thumbs/02.jpg" alt="" /></span></div>
      <div class="4u$"><span class="image fit"><img src="../map/images/thumbs/01.jpg" alt="" /></span></div>
    </div>
  </div>
  <h5>Left &amp; Right</h5>
  <p><span class="image left"><img src="/images/bio-photo.jpg" alt="" /></span>Fringilla nisl. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent.</p>
  <p><span class="image right"><img src="/images/bio-photo-alt.jpg" alt="" /></span>Fringilla nisl. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent. Donec accumsan interdum nisi, quis tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent tincidunt felis sagittis eget. tempus euismod. Vestibulum ante ipsum primis in faucibus vestibulum. Blandit adipiscing eu felis iaculis volutpat ac adipiscing accumsan eu faucibus. Integer ac pellentesque praesent.</p>
  </section>
-->
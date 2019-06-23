---
layout: page
title: Tag Index
excerpt: "An archive of posts sorted by tag."
search_omit: true
---

<script src="/assets/js/vendor/jquery-1.9.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.4/d3.layout.cloud.js"></script>


{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tags_list = site_tags | split:',' | sort %}


<div class="demo-blog">
<div class="demo-blog__posts mdl-grid page-content">

<div class="cloud mdl-cell mdl-cell--12-col"></div>

<div id="tags--index" class="blog__post mdl-cell mdl-cell--12-col">
{% for item in (0..site.tags.size) %}{% unless forloop.last %}
  {% capture this_word %}{{ tags_list[item] | strip_newlines }}{% endcapture %}
  <a href="#{{ this_word }}" class="tag--link">
  <button class="mdl-button mdl-js-button mdl-button--primary mdl-badge mdl-badge--overlap" data-badge="{{ site.tags[this_word].size }}">
    {{ this_word }}
  </button>
  </a>
{% endunless %}{% endfor %}
</div>

<h2 class="mdl-cell mdl-cell--12-col">Tags</h2>

<div class="blog__post mdl-cell mdl-cell--12-col">

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
  {% capture this_word %}{{ tags_list[item] | strip_newlines }}{% endcapture %}
  <h3 id="{{ this_word }}">{{ this_word }}</h3>
  <ul class="post-list mdl-list">
  {% for post in site.tags[this_word] %}{% if post.title != null %}
    <li><a href="{{ post.url }}">{% if post.series and post.series.title %}{{ post.series.title }} - {% endif %}{{ post.title }}</a><span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time></span></li>
  {% endif %}{% endfor %}
  </ul>
{% endunless %}{% endfor %}
</div>

<script type="text/javascript">
$("#tags--index").hide();
var words = [];

$(".blog__post.mdl-cell.mdl-cell--12-col a.tag--link").children().each(function (i, but){
  words.push({text: $(but).text().trim(), size: $(but).attr("data-badge")});
  });

var width = $(".cloud.mdl-cell.mdl-cell--12-col").width();

var fill = d3.scale.category20();

var layout = d3.layout.cloud()
    .size([width, 800])
    .words(words)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 10) * 10 - 50; })
    .font("Impact")
    .fontSize(function(d) { return d.size*4+8; })
    .on("end", draw);

layout.start();

function draw(words) {

  d3.select(".cloud.mdl-cell.mdl-cell--12-col").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })

      .on("mouseover", function(d,i) {
          d3.select(this)
              .style("cursor", function(d) { return 'pointer'; })
              .style("z-index", function(d) { return '1000'; })
              .transition()
              .duration(300)
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + 0 + ")scale(2)";
              })
              .style("opacity", 1);

      })
      .on("mouseout", function(d,i) {
          d3.select(this).transition()
              .style("z-index", function(d) { return '1'; })
              .duration(200)
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")scale(1)";
              })
              .style("opacity", .7);
      })
      .on("click", function(d,i) {
        window.location.href = "#"+d.text;
      });
}
</script>
</div>
</div>

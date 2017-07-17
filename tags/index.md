---
layout: page
title: Tag Index
excerpt: "An archive of posts sorted by tag."
search_omit: true
---

{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tags_list = site_tags | split:',' | sort %}

<div class="demo-blog">
<div class="demo-blog__posts mdl-grid page-content">

<h2 class="mdl-cell mdl-cell--12-col">Tag Index</h2>

<div class="blog__post mdl-cell mdl-cell--12-col">
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
    <li><a href="{{ post.url }}">{{ post.title }}<span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time></span></a></li>
  {% endif %}{% endfor %}
  </ul>
{% endunless %}{% endfor %}
</div>
</div>
</div>

---
layout: page
title: Articles
excerpt: "An archive of articles sorted by date."
search_omit: true
---

<div class="demo-blog">
<div class="demo-blog__posts mdl-grid">
<ul class="mdl-list">
{% for post in site.categories.articles %}
  <li class="mdl-list__item mdl-list__item--three-line">
  <article class="mdl-list__item-primary-content"><a href="{{ post.url }}">
  {% if post.star %}
  <i class="material-icons" role="presentation">star</i>
  {% endif %}
  {% if post.series %}{{ post.series.title }} - {% endif %}{{ post.title }}</a> <span class="entry-date"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time></span>
  {% if post.excerpt %} <span class="mdl-list__item-text-body">{{ post.excerpt | remove: '\[ ... \]' | remove: '\( ... \)' | markdownify | strip_html | strip_newlines | escape_once }}</span>
  {% endif %}</article></li>
{% endfor %}
</ul>
</div>
</div>

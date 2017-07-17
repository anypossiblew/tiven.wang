---
layout: page
title: "Search"
date:
modified:
excerpt:
image:
  feature:
search_omit: true
sitemap: false
---

<div class="demo-blog">
<div class="demo-blog__posts mdl-grid page-content">

<!-- Search form -->
<form method="get" action="/search/" data-search-form class="simple-search mdl-cell mdl-cell--12-col">
  <div style="margin: 0 auto;width: 420px;">
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="search" name="q" id="q" data-search-input id="goog-wm-qt" autofocus>
      <label class="mdl-textfield__label" for="sample3">Search...</label>
    </div>

    <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
      search
    </button>
  </div>
</form>

<!-- Search results placeholder -->
<h6 data-search-found class="mdl-cell mdl-cell--12-col">
  <span data-search-found-count></span> result(s) found for &ldquo;<span data-search-found-term></span>&rdquo;.
</h6>

<ul class="post-list mdl-cell mdl-cell--12-col" data-search-results></ul>

<!-- Search result template -->
<script type="text/x-template" id="search-result">
  <li><article>
    <a href="##Url##">##Title## </a>
    <br><span class="excerpt">##Excerpt##</span>
  </article></li>
</script>

</div>
</div>

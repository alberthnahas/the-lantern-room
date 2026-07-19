---
layout: default
title: Chapters
---

<section class="hero">
  <h1>The Lantern Room</h1>
  <p>{{ site.description }}</p>

  {% assign posts = site.posts | sort: 'day' %}
  {% assign total = site.total_days | default: 100 %}
  {% assign published = posts.size %}
  {% assign pct = published | times: 100.0 | divided_by: total %}
  <div class="progress-stats">
    <span>{{ published }} of {{ total }} chapters published</span>
    <span class="progress-track"><span class="progress-track-fill" style="width: {{ pct }}%;"></span></span>
  </div>
</section>

<div class="continue-card">
  <div>
    <div class="label">Continue reading</div>
    <div class="title"></div>
  </div>
  <a class="resume-btn" href="#">Resume &rarr;</a>
</div>

<div class="search-wrap">
  <input type="search" placeholder="Search chapters by title or day&hellip;" aria-label="Search chapters">
</div>

{% assign act_size = 25 %}
{% assign acts = posts | group_by_exp: "post", "post.day | minus: 1 | divided_by: act_size" %}

{% for act in acts %}
  {% assign act_num = act.name | plus: 1 %}
  {% assign act_start = act.name | times: act_size | plus: 1 %}
  {% assign act_end = act_num | times: act_size %}
  <p class="act-heading">Act {{ act_num }} &middot; Chapters {{ act_start }}&ndash;{{ act_end }}</p>
  <ol class="chapter-list">
    {% for post in act.items %}
    <li>
      <a href="{{ post.url | relative_url }}">
        <span class="day-num">Chapter {{ post.day }}</span>
        <span class="day-title">{{ post.chapter_title | default: post.title }}</span>
      </a>
    </li>
    {% endfor %}
  </ol>
{% endfor %}
<p class="no-results">No chapters match your search.</p>

---
layout: default
title: Chapters
---

<section class="hero">
  <h1>The Lantern Room</h1>
  <p>{{ site.description }}</p>
</section>

<ol class="chapter-list">
  {% assign posts = site.posts | sort: 'day' %}
  {% for post in posts %}
  <li>
    <a href="{{ post.url | relative_url }}">
      <span class="day-num">Day {{ post.day }}</span>
      <span class="day-title">{{ post.chapter_title | default: post.title }}</span>
    </a>
  </li>
  {% endfor %}
</ol>

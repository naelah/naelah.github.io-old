---
layout: page
title: Notes
permalink: /notes/
desc: 注意・ノート・Notes
---

<h2>Basic Programming Concepts</h2>
{% for post in site.tags.programming %}
  {% include themes/{{ site.amsf_theme }}/includes/page-item.html %}
{% endfor %}

<h2>Algorithms</h2>
{% for post in site.tags.algorithm %}
  {% include themes/{{ site.amsf_theme }}/includes/page-item.html %}
{% endfor %}
---
layout: page
title: Journal
permalink: /journal/
desc: 日記・ジャーナル・Journal
---

<h2>Captain's Log</h2>
{% for post in site.tags.personal %}
  {% include themes/{{ site.amsf_theme }}/includes/page-item.html %}
{% endfor %}

<h2>Travelogue</h2>
{% for post in site.tags.travelogue %}
  {% include themes/{{ site.amsf_theme }}/includes/page-item.html %}
{% endfor %}

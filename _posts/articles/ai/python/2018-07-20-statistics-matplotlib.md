---
layout: post
theme: IBMPlexSerif
title: "Statistics - matplotlib"
excerpt: ""
modified: 2018-07-17T11:51:25-04:00
categories: articles
tags: [Python]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/1591.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/dubai-united-arab-emirates-1591
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: "Matplotlib"
    url: https://matplotlib.org/
---

* TOC
{:toc}

## mplot3d

```python
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
```




[pyplot_summary]:https://matplotlib.org/api/pyplot_summary.html
[mplot3d-tutorial]:https://matplotlib.org/mpl_toolkits/mplot3d/tutorial.html
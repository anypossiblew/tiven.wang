---
layout: post
title: Git Commands
excerpt: "Git Common Commands"
modified: 2016-11-25T17:51:25-04:00
categories: articles
tags: [Git, Github]
image:
  feature: web/masthead-git.jpg
comments: true
share: true
---

* TOC
{:toc}

## How To

### How to push new component version

1. Create a fork for project in Github
2. Clone to local
  `git clone https://<github>/<me>/<my-repository>.git`
3. `git remote -v`
4. `git remote add upstream https://<github>/<original-account>/<original-repository>.git`
5. `git remote -v`
6. `git fetch upstream`
  Take the latest code from to forked repository.
7. `git rebase upstream/master`
  Placed code to upstream/master
8. `git push` This push changes to *https://\<github\>/\<original-account\>/\<original-repository\>.git*

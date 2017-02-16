---
layout: post
title: Git Best Practices
excerpt: "Git Best Practices"
modified: 2017-02-13T17:51:25-04:00
categories: articles
tags: [Git, Best Practices, Github]
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

### How to undo local changes of one file

You can use

`git checkout -- <filename>`

You can do it without the `--` (as suggested by nimrodm), but if the `<filename>` looks like a branch or tag (or other revision identifier), it may get confused, so using `--` is best.

You can also check out a particular version of a file:

```
git checkout v1.2.3 -- <filename>         # tag v1.2.3
git checkout stable -- <filename>         # stable branch
git checkout origin/master -- <filename>  # upstream master
git checkout HEAD -- <filename>           # the version from the most recent commit
git checkout HEAD^ -- <filename>          # the version before the most recent commit
```

> NOTE: If the file is already staged, you need to reset it, first. `git reset HEAD <filename>` ; `git checkout -- <filename>`

[Stackoverflow.com - Undo working copy modifications of one file in Git?](http://stackoverflow.com/questions/692246/undo-working-copy-modifications-of-one-file-in-git)

### How to resolve merge conflicts in Git

[Stackoverflow.com - How to resolve merge conflicts in Git?](http://stackoverflow.com/questions/161813/how-to-resolve-merge-conflicts-in-git)

[Handling and Avoiding Conflicts in Git](http://weblog.masukomi.org/2008/07/12/handling-and-avoiding-conflicts-in-git/)

### how can I git stash a specific file

[how can I git stash a specific file? [duplicate]](http://stackoverflow.com/questions/5506339/how-can-i-git-stash-a-specific-file)

[Stash only one file out of multiple files that have changed with Git?](http://stackoverflow.com/questions/3040833/stash-only-one-file-out-of-multiple-files-that-have-changed-with-git)

### Difference between git stash pop and git stash apply

`git stash pop` throws away the (topmost, by default) stash after applying it, whereas `git stash apply` leaves it in the stash list for possible later reuse (or you can then git stash drop it).

Another way to look at it: `git stash pop` is `git stash apply` && `git stash drop`.

[Difference between git stash pop and git stash apply](http://stackoverflow.com/questions/15286075/difference-between-git-stash-pop-and-git-stash-apply)

### What is the difference between 'git pull' and 'git fetch'

![Git Data Transport Commands](https://i.stack.imgur.com/XwVzT.png)

[What is the difference between 'git pull' and 'git fetch'?](http://stackoverflow.com/questions/292357/what-is-the-difference-between-git-pull-and-git-fetch)

---
layout: post
title: Git Best Practices
excerpt: "本文收集了常用的 Git Best Practices"
modified: 2017-02-13T17:51:25-04:00
categories: articles
tags: [Git, Best Practices, Github]
image:
  feature: /images/web/masthead-git.jpg
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
7. `git rebase upstream/master` Placed code to upstream/master
8. `git push` This push changes to *https://\<github\>/\<original-account\>/\<original-repository\>.git*

### Commits

#### How to undo local changes of one file

You can use

`git checkout -- <filename>`

You can do it without the `--` (as suggested by nimrodm), but if the `<filename>` looks like a branch or tag (or other revision identifier), it may get confused, so using `--` is best.

You can also check out a particular version of a file:

```sh
git checkout v1.2.3 -- <filename>         # tag v1.2.3
git checkout stable -- <filename>         # stable branch
git checkout origin/master -- <filename>  # upstream master
git checkout HEAD -- <filename>           # the version from the most recent commit
git checkout HEAD^ -- <filename>          # the version before the most recent commit
```

> NOTE: If the file is already staged, you need to reset it, first. `git reset HEAD <filename>` ; `git checkout -- <filename>`

[Stackoverflow.com - Undo working copy modifications of one file in Git?](http://stackoverflow.com/questions/692246/undo-working-copy-modifications-of-one-file-in-git)

#### How to remove local (untracked) files

[git clean](https://git-scm.com/docs/git-clean)

`git clean -d -f -f`


*https://stackoverflow.com/questions/61212/how-to-remove-local-untracked-files-from-the-current-git-working-tree*

#### How to resolve merge conflicts in Git

Here's a probable use-case, from the top:

You're going to pull some changes, but oops, you're not up to date:

```sh
git fetch origin
git pull origin master

From ssh://gitosis@example.com:22/projectname
 * branch            master     -> FETCH_HEAD
Updating a030c3a..ee25213
error: Entry 'filename.c' not uptodate. Cannot merge.
```

So you get up-to-date and try again, but have a conflict:

```sh
git add filename.c
git commit -m "made some wild and crazy changes" // you must commit the content which will be merged with remote commit.
git pull origin master

From ssh://gitosis@example.com:22/projectname
 * branch            master     -> FETCH_HEAD
Auto-merging filename.c
CONFLICT (content): Merge conflict in filename.c
Automatic merge failed; fix conflicts and then commit the result.
```

So you decide to take a look at the changes:

`git mergetool`

Oh me, oh my, upstream changed some things, but just to use my changes...no...their changes...

```sh
git checkout --ours filename.c
git checkout --theirs filename.c
git add filename.c
git commit -m "using theirs"
```

And then we try a final time

```sh
git pull origin master

From ssh://gitosis@example.com:22/projectname
 * branch            master     -> FETCH_HEAD
Already up-to-date.
```

Ta-da!

[Stackoverflow.com - How to resolve merge conflicts in Git?](http://stackoverflow.com/questions/161813/how-to-resolve-merge-conflicts-in-git)

[Handling and Avoiding Conflicts in Git](http://weblog.masukomi.org/2008/07/12/handling-and-avoiding-conflicts-in-git/)

[7.8 Git 工具 - 高级合并](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%AB%98%E7%BA%A7%E5%90%88%E5%B9%B6)

#### how can I git stash a specific file

[how can I git stash a specific file? [duplicate]](http://stackoverflow.com/questions/5506339/how-can-i-git-stash-a-specific-file)

[Stash only one file out of multiple files that have changed with Git?](http://stackoverflow.com/questions/3040833/stash-only-one-file-out-of-multiple-files-that-have-changed-with-git)

#### Difference between git stash pop and git stash apply

`git stash pop` throws away the (topmost, by default) stash after applying it, whereas `git stash apply` leaves it in the stash list for possible later reuse (or you can then git stash drop it).

Another way to look at it: `git stash pop` is `git stash apply` && `git stash drop`.

[Difference between git stash pop and git stash apply](http://stackoverflow.com/questions/15286075/difference-between-git-stash-pop-and-git-stash-apply)

#### How to undo last commit(s) in Git?

Undo a commit and redo

```
$ git commit -m "Something terribly misguided"              (1)
$ git reset HEAD~                                           (2)
<< edit files as necessary >>                               (3)
$ git add ...                                               (4)
$ git commit -c ORIG_HEAD                                   (5)
```

1. This is what you want to undo
2. This leaves your working tree (the state of your files on disk) unchanged but undoes the commit and leaves the changes you committed unstaged (so they'll appear as "Changes not staged for commit" in git status and you'll need to add them again before committing). If you only want to add more changes to the previous commit, or change the commit message1, you could use git reset --soft HEAD~ instead, which is like git reset HEAD~ but leaves your existing changes staged.
3. Make corrections to working tree files.
4. git add anything that you want to include in your new commit.
5. Commit the changes, reusing the old commit message. reset copied the old head to `.git/ORIG_HEAD`; commit with `-c ORIG_HEAD` will open an editor, which initially contains the log message from the old commit and allows you to edit it. If you do not need to edit the message, you could use the `-C` option.

[stackoverflow.com - How to undo last commit(s) in Git?](http://stackoverflow.com/questions/927358/how-to-undo-last-commits-in-git)

#### Viewing Unpushed Commits

`git log origin/master..HEAD`
You can also view the diff using the same syntax:

`git diff origin/master..HEAD`

[Viewing Unpushed Git Commits](http://stackoverflow.com/questions/2016901/viewing-unpushed-git-commits)

#### Viewing Uncommitted Changes

`git diff` - Show changes between commits, commit and working tree, etc

Here are some of the options it expose which you can use

*  `git diff` (no parameters)
  Print out differences between your working directory and the index.

*  `git diff –-cached`:
  Print out differences between the index and HEAD (current commit).

*  `git diff HEAD*`:
  Print out differences between your \*\*working directory and the HEAD.

*  `git diff --name-only`
  Show only names of changed files.

*  `git diff --name-status`
  Show only names and status of changed files.

*  `git diff --color-words`
  Word by word diff instead of line by line.

[Git, How to show uncommitted changes](http://stackoverflow.com/questions/35978550/git-how-to-show-uncommitted-changes)

### What is the difference between 'git pull' and 'git fetch'

![Git Data Transport Commands](https://i.stack.imgur.com/XwVzT.png)

[What is the difference between 'git pull' and 'git fetch'?](http://stackoverflow.com/questions/292357/what-is-the-difference-between-git-pull-and-git-fetch)

### Adding an existing project to Git Remote Repository using the command line

#### Add local to remote empty repository

* `git init`
* `git add .`
* `git commit -m "First commit"`
* `git remote add origin [remote repository URL]`
* `git remote -v`
* `git push origin master`

[GitHub Help - Adding an existing project to GitHub using the command line](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

#### Rebase local to remote codebase

`git pull --rebase` before pushing to rebase your local changes on the newest codebase.

```sh
To push the history leading to the current (detached HEAD) state now, use

    git push origin HEAD:<name-of-remote-branch>
```

### Which remote URL should I use

[Which remote URL should I use?](https://help.github.com/enterprise/2.8/user/articles/which-remote-url-should-i-use/)

### Branches

#### How to clone all remote branches?

First, clone a remote Git repository and cd into it:

```
$ git clone git://example.com/myproject
$ cd myproject
```

Next, look at the local branches in your repository:

```
$ git branch
* master
```

But there are other branches hiding in your repository! You can see these using the -a flag:

```
$ git branch -a
* master
  remotes/origin/HEAD
  remotes/origin/master
  remotes/origin/v1.0-stable
  remotes/origin/experimental
```

If you just want to take a quick peek at an upstream branch, you can check it out directly:

`$ git checkout origin/experimental`

But if you want to work on that branch, you'll need to create a local tracking branch which is done automatically by:

`$ git checkout experimental`

and you will see

```
Branch experimental set up to track remote branch experimental from origin.
Switched to a new branch 'experimental'
```

That last line throw some people "New branch" - huh? What it really means is a new local branch that gets the branch from the index and creates it locally for you. The previous line is actually more informative as it tells you that the branch is being set up to track the remote branch, which usually means the origin/branch_name branch

Now, if you look at your local branches, this is what you'll see:

```
$ git branch
* experimental
  master
```

You can actually track more than one remote repository using git remote.

```
$ git remote add win32 git://example.com/users/joe/myproject-win32-port
$ git branch -a
* master
  remotes/origin/HEAD
  remotes/origin/master
  remotes/origin/v1.0-stable
  remotes/origin/experimental
  remotes/win32/master
  remotes/win32/new-widgets
```

At this point, things are getting pretty crazy, so run gitk to see what's going on:

`$ gitk --all`

[How to clone all remote branches in Git?](http://stackoverflow.com/questions/67699/how-to-clone-all-remote-branches-in-git)

#### Delete branch

`git branch -d [local branch]`

`git push origin --delete [remote branch]`

[stackoverflow - How to delete a Git branch both locally and remotely?](http://stackoverflow.com/questions/2003505/how-to-delete-a-git-branch-both-locally-and-remotely)

[stackoverflow - I can't delete a remote master branch on github](http://stackoverflow.com/questions/12208751/i-cant-delete-a-remote-master-branch-on-git)

#### How to rename branch

If you want to rename a branch while pointed to any branch, do:

`git branch -m <oldname> <newname>`

If you want to rename the current branch, you can do:

`git branch -m <newname>`

A way to remember this, is `-m` or long name `--move` is for "move" (or `mv`), which is how you rename files.

[How do I rename a local Git branch?](https://stackoverflow.com/questions/6591213/how-do-i-rename-a-local-git-branch)

#### How to merge branches

`git checkout master` and `git merge dev` `git push`

[Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)

#### Rebase a branch

Assume the following history exists and the current branch is "topic":
```
        A---B---C topic
       /
  D---E---F---G master
```

From this point, the result of either of the following commands:

```
git rebase master
git rebase master topic
```

would be:
```
                A'--B'--C' topic
               /
  D---E---F---G master
```

=================

In case of conflict, git rebase will stop at the first problematic commit and leave conflict markers in the tree. You can use `git diff` to locate the markers (<<<<<<) and make edits to resolve the conflict. For each file you edit, you need to tell Git that the conflict has been resolved, typically this would be done with

`git add <filename>`

After resolving the conflict manually and updating the index with the desired resolution, you can continue the rebasing process with

`git rebase --continue`

Alternatively, you can undo the `git rebase` with

`git rebase --abort`

==================

See more by `git rebase --help`

#### Create Branch from Commit

You can create the branch via hash,

`git branch branchname <sha1-of-commit>`
`
or by using a symbolic ref.

`git branch branchname HEAD~3`

You can also use

`git checkout -b branchname <commit>`

======================

If you are not sure which commit you want to branch from in advance you can check commits out and examine their code (see source, compile, test) by

`git checkout <sha1-of-commit>`

once you find the commit you want to branch from you can do that from within the commit (i.e. without going back to the master first) just by creating a branch in the usual way:

`git checkout -b <branch_name>`


### Rewriting the most recent commit message

[https://help.github.com/articles/changing-a-commit-message/](https://help.github.com/articles/changing-a-commit-message/)

### Associating text editors with Git

For example, you can set your default editor in Git to use [Atom](https://atom.io/) if you have installed the editor.

`git config --global core.editor "C:/Users/USERNAME/AppData/Local/atom/bin/atom.cmd"`


[https://help.github.com/articles/associating-text-editors-with-git/](https://help.github.com/articles/associating-text-editors-with-git/)

### Remote

#### Remote origin already exists on 'git push' to a new repository

I have my project on GitHub at some location, `git@github.com:myname/oldrep.git`.

Now I want to push all my code to a new repository at some other location, `git@github.com:newname/newrep.git`.

I used the command:

`git remote add origin git@github.com:myname/oldrep.git`

but I am receiving this:

`fatal: remote origin already exists`.

Answers:

You are getting this error because "origin" is not available. "origin" is a convention not part of the command. "origin" is the local name of the remote repository.

For example you could also write:

```
git remote add myorigin git@github.com:myname/oldrep.git  
git remote add testtest git@github.com:myname/oldrep.git
```

then push the repository to the new remote repository:

`git push --set-upstream myorigin master`

See the manual:

[http://www.kernel.org/pub/software/scm/git/docs/git-remote.html](http://www.kernel.org/pub/software/scm/git/docs/git-remote.html)

To remove a remote repository you enter:

`git remote rm origin`

Again "origin" is the name of the remote repository if you want to remove the "upstream" remote:

`git remote rm upstream`

[Remote origin already exists on 'git push' to a new repository](http://stackoverflow.com/questions/1221840/remote-origin-already-exists-on-git-push-to-a-new-repository)

### Merge

#### Git refusing to merge unrelated histories

> "git merge" used to allow merging two branches that have no common base by default, which led to a brand new history of an existing project created and then get pulled by an unsuspecting maintainer, which allowed an unnecessary parallel history merged into the existing project. The command has been taught not to allow this by default, with an escape hatch --allow-unrelated-histories option to be used in a rare event that merges histories of two projects that started their lives independently.
{: .Tips}

You can use `--allow-unrelated-histories` to force the merge to happen.

[Git refusing to merge unrelated histories](https://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories)

### Tags
#### How to delete a git remote tag?

You just need to push an 'empty' reference to the remote tag name:

`git push origin :tagname`

Or, more expressively, use the `--delete` option:

`git push --delete origin tagname`

If you also need to delete the local tag, use:

`git tag --delete tagname`

[stackoverflow - How to delete a git remote tag?](https://stackoverflow.com/questions/5480258/how-to-delete-a-git-remote-tag)

## Gerrit

### Gerrit push to refs/heads/master prohibited

在使用 git 命令行时默认 push 到 refs/heads/master，所以一般没有权限。

Don't push to `refs/heads/master`, push to `refs/for/master` instead. This will trigger a change for code review.

If you wish to push directly to `refs/heads/master` (and thus bypass code review) we'll need +1 from your project lead.

Solution:
**Option 1**. Add option `push = HEAD:refs/for/master` in the `.git/config` file as

```
[remote "origin"]
	url = https://c5235715@git.wdf.sap.corp/HC/HSC/HSIC/s4hana-baidu-integration.git
	fetch = +refs/heads/*:refs/remotes/origin/*
	push = HEAD:refs/for/master
```

**Option 2**. Or set options in the `push` command

`git push [remote-url] HEAD:refs/for/master`

refer [Gerrit Code Review - Uploading Changes](https://gerrit-review.googlesource.com/Documentation/user-upload.html)

**Option 3**. Use the git-review, [git-review](https://www.mediawiki.org/wiki/Gerrit/git-review) is a command-line tool for Git / [Gerrit](https://www.mediawiki.org/wiki/Gerrit) to submit a change or to fetch an existing one.


### How to automatically add a Change-Id to commit messages

If the error information show as
```
Hint: To automatically insert Change-Id, install the hook:
****** [url]:hooks/commit-msg ${gitdir}/hooks/
And then amend the commit:
git commit --amend
```

Solution:

Just download it from : http://www.example.com/r/tools/hooks/commit-msg and then copy it to your `.git/hooks` folder.

Or you can download it from [gerrit review](https://gerrit-review.googlesource.com/tools/hooks/commit-msg)


If you add the commit hook after making the commit locally, which is probably the case, you need to amend your last commit. Simply amending the last commit without making any real change will add the Change-ID to your log message.

```
git commit -a --amend
git log -1 // this is to check that the Change-ID is present in your log message
git push origin HEAD:refs/for/master
```

If you are like me and have a lot of projects at create clones every now and then you might want to setup your git installation so the commit-msg hook is installed by default. You can do this by copying the commit-msg to your git template folder. On my Win7 system it can be found here:

`C:\Program Files (x86)\Git\share\git-core\templates\hooks`

The next time you create a new clone you do not need to download the commit-msg again.


## Best Practices
[Version Control Best Practices](https://www.git-tower.com/learn/git/ebook/en/command-line/appendix/best-practices)

### Commit Related Changes

A commit should be a wrapper for related changes. For example, fixing two different bugs should produce two separate commits. Small commits make it easier for other team members to understand the changes and roll them back if something went wrong. With tools like the staging area and the ability to stage only parts of a file, Git makes it easy to create very granular commits.

### Commit Often

Committing often keeps your commits small and, again, helps you commit only related changes. Moreover, it allows you to share your code more frequently with others. That way it’s easier for everyone to integrate changes regularly and avoid having merge conflicts. Having few large commits and sharing them rarely, in contrast, makes it hard both to solve conflicts and to comprehend what happened.

### Don’t Commit Half-Done Work

You should only commit code when it’s completed. This doesn’t mean you have to complete a whole, large feature before committing. Quite the contrary: split the feature’s implementation into logical chunks and remember to commit early and often. But don’t commit just to have something in the repository before leaving the office at the end of the day. If you’re tempted to commit just because you need a clean working copy (to check out a branch, pull in changes, etc.) consider using Git’s “Stash” feature instead.

### Test Before You Commit

Resist the temptation to commit something that you “think” is completed. Test it thoroughly to make sure it really is completed and has no side effects (as far as one can tell). While committing half-baked things in your local repository only requires you to forgive yourself, having your code tested is even more important when it comes to pushing / sharing your code with others.

### Write Good Commit Messages

Begin your message with a short summary of your changes (up to 50 characters as a guideline). Separate it from the following body by including a blank line. The body of your message should provide detailed answers to the following questions: What was the motivation for the change? How does it differ from the previous implementation? Use the imperative, present tense („change“, not „changed“ or „changes“) to be consistent with generated messages from commands like git merge.

### Version Control is not a Backup System

Having your files backed up on a remote server is a nice side effect of having a version control system. But you should not use your VCS like it was a backup system. When doing version control, you should pay attention to committing semantically (see “related changes”) – you shouldn’t just cram in files.

### Use Branches

Branching is one of Git’s most powerful features – and this is not by accident: quick and easy branching was a central requirement from day one. Branches are the perfect tool to help you avoid mixing up different lines of development. You should use branches extensively in your development workflows: for new features, bug fixes, experiments, ideas…

### Agree on a Workflow

Git lets you pick from a lot of different workflows: long-running branches, topic branches, merge or rebase, git-flow… Which one you choose depends on a couple of factors: your project, your overall development and deployment workflows and (maybe most importantly) on your and your teammates’ personal preferences. However you choose to work, just make sure to agree on a common workflow that everyone follows.

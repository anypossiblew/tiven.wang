---
layout: slides
theme: svo
transition: slide
title: Version Control with Git
excerpt: "Powerful Tools and Techniques for Collaborative Software Development. Although some familiarity with revision control systems will be good background material, a reader who is not familiar with any other system will still be able to learn enough about basic Git operations to be productive in a short while. More advanced readers should be able to gain insight into some of Git’s internal design and thus master some of its more powerful techniques."
modified: 2017-02-23T17:00:00-00:00
categories: articles
tags: [Git, Reading]
---

<section>
  <p class="Question">Version Control with Git</p>
  <p class="Author">Jon Loeliger & Matthew McCullough</p>
</section>

<section>
  <p class="Subject">I</p>
  <p class="Question">Introduction</p>
</section>

<section>
  <p class="Subject">II</p>
  <p class="Question">Basic Git Concepts</p>
</section>

<section>
   <img data-src="https://i.stack.imgur.com/XwVzT.png" style="background: white;">
</section>

<section>
  <p class="Subject">5</p>
  <p class="Question">File Management and the Index</p>
</section>

<section>
  <p class="Subject">git add</p>
  <p class="Object">git status</p>
  <p class="Object">git add</p>
  <p class="Object">git ls-files --stage</p>
  <p class="Object">git rm --cached &lt;filename&gt;</p>
  <p class="Object">git rm &lt;filename&gt;</p>
</section>

<section>
  <p class="Subject">IV</p>
  <p class="Question">Commits</p>
</section>

<section>
  <p class="Subject">Commit</p>
  <p class="Attributive">is used to</p>
  <p class="Object">record changes to a repository</p>
</section>

<section>
  <p class="Subject">ref</p>
  <p class="Attributive">is</p>
  <p class="Object">an SHA1 hash ID that refers to an object within the Git object store. </p>
  <p class="Object fragment fade-up">local topic branch names, remote tracking branch names, tag names ...</p>
  <p class="Attributive fragment fade-up">git symbolic-ref HEAD</p>
  <p>
    <span class="fragment fade-up">master</span>
    <span class="fragment fade-up">,origin/master</span>
    <span class="fragment fade-up">,v1.0.0</span>
    <span class="fragment fade-up">,HEAD</span>
    <span class="fragment fade-up">,ORIG_HEAD</span>
    <span class="fragment fade-up">,FETCH_HEAD</span>
    <span class="fragment fade-up">,MERGE_HEAD</span>
    <span class="fragment fade-up">,master~3^2^</span>
  </p>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">Branches</p>
</section>

<section>
  <p class="Subject">Branch</p>
  <p class="Attributive">is</p>
  <p class="Object">the fundamental means of launching a separate line of development within a software project.</p>
  <p class="Subject">for</p>
  <ul>
    <li class="fragment fade-up">individual customer release</li>
    <li class="fragment fade-up">a development phase</li>
    <li class="fragment fade-up">a single feature or research</li>
    <li class="fragment fade-up">the work of an individual contributor</li>
  </ul>
</section>

<section>
  <p class="Subject">Branch</p>
  <p class="Attributive">conflict</p>
  <p class="Object">uncommitted changes when checking out new branch</p>
  <p class="Attributive">solve</p>
  <ul>
    <li class="fragment fade-up">git commit; git checkout <i>new-branch</i></li>
    <li class="fragment fade-up">git checkout -m <i>new-branch</i></li>
  </ul>
</section>

<section>
  <p class="Subject">Branch</p>
  <ul>
    <li class="fragment fade-up">git checkout -b <i>new-branch</i> <i>start-point</i></li>
    <li class="fragment fade-up">= git branch <i>new-branch</i> <i>start-point</i> + git checkout <i>new-branch</i></li>
    <li class="fragment fade-up">detached HEAD</li>
    <li class="fragment fade-up">git merge <i>dev</i> (at master)</li>
  </ul>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">Diffs</p>
</section>

<section>
  <img data-src="/images/web/git-diff.jpg">
</section>

<section>
  <p class="Subject">Diff</p>
  <ul>
    <li class="fragment fade-up">git diff</li>
    <li class="fragment fade-up">git diff <i>commit</i></li>
    <li class="fragment fade-up">git diff --cached <i>commit</i></li>
    <li class="fragment fade-up">git diff <i>commit1</i> <i>commit2</i></li>
    <li class="fragment fade-up">git diff <i>master</i>..<i>dev</i></li>
    <li class="fragment fade-up">git diff --stat <i>master~5</i> <i>master</i> Documentation/git-add.txt</li>
    <li class="fragment fade-up">git diff -S"searchTerm" <i>master~50</i></li>
  </ul>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">Merges</p>
</section>

<section>
  <p class="Subject">Merge with conflicts</p>
  <p class="Attributive">be solved by</p>
  <ul>
    <li class="fragment fade-up">git diff</li>
    <li class="fragment fade-up">git status</li>
    <li class="fragment fade-up">git ls-files -u</li>
    <li class="fragment fade-up">git diff --ours</li>
    <li class="fragment fade-up">git diff --theirs</li>
    <li class="fragment fade-up">git diff --base</li>
    <li class="fragment fade-up">git diff $(git merge-base HEAD MERGE_HEAD)</li>
    <li class="fragment fade-up">git log --merge --left-right -p <i>[file]</i></li>
    <li class="fragment fade-up">git checkout --ours / --theirs <i>[file]</i></li>
    <li class="fragment fade-up">git reset --hard HEAD / ORIG_HEAD</li>
    <li class="fragment fade-up">git checkout -m</li>
  </ul>
</section>

<section>
  <p class="Subject">Merge Strategies</p>
  <p class="Attributive">git merge -s [strategy] [branch]</p>
  <ul>
    <li class="fragment fade-up">Already up-to-date</li>
    <li class="fragment fade-up">Fast-forward</li>
    <li class="fragment fade-up">Resolve</li>
    <li class="fragment fade-up">Recursive</li>
    <li class="fragment fade-up">Octopus</li>
    <li class="fragment fade-up">Ours</li>
    <li class="fragment fade-up">Subtree</li>
  </ul>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">Altering Commits</p>
</section>

<section>
  <p class="Subject">Altering Commits</p>
  <ul>
    <li class="fragment fade-up">git reset --soft <i>commit</i></li>
    <li class="fragment fade-up">git reset --mixed <i>commit</i></li>
    <li class="fragment fade-up">git reset --hard <i>commit</i></li>
    <li class="fragment fade-up">git cherry-pick <i>commit</i></li>
    <li class="fragment fade-up">git revert <i>commit</i></li>
    <li class="fragment fade-up">git commit --amend</li>
    <li class="fragment fade-up">git rebase <i>master</i> <i>dev</i></li>
  </ul>
</section>

<section>
  <p class="Subject">V</p>
  <p class="Question">The Stash and the Reflog</p>
</section>

<section>
  <p class="Subject">Stash</p>
  <p class="Attributive">"interrupted work flow"    "pull into a dirty tree"</p>
  <ul>
    <li class="fragment fade-up">git stash save <i>"message"</i></li>
    <li class="fragment fade-up">git stash pop = git stash apply + drop</li>
    <li class="fragment fade-up">git stash drop</li>
    <li class="fragment fade-up">git stash apply</li>
    <li class="fragment fade-up">git stash show</li>
    <li class="fragment fade-up">git stash lish</li>
    <li class="fragment fade-up">git stash --include-untracked</li>
    <li class="fragment fade-up">git stash --all</li>
  </ul>
</section>

<section>
  <p class="Subject">Reflog</p>
  <p class="Attributive"></p>
  <ul>
    <li class="fragment fade-up">git reflog show</li>
    <li class="fragment fade-up">git reflog <i>branch</i></li>
  </ul>
</section>

<section>
  <p class="Question">Thank you</p>
  <p class="Author"><a href="http://tiven.wang">@tiven.wang</a></p>
</section>

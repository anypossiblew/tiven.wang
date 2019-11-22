---
layout: post
theme: XiuKai
title: "Scrum Practice"
excerpt: "What's agile development? How to use it in your project?"
modified: 2019-10-15T17:00:00-00:00
categories: articles
tags: [Agile, DevOps]
image:
  vendor: twitter
  feature: /media/EDtNFeAXoAEpXoq?format=jpg&name=small
  credit: "@FoodPhotoAward"
  creditlink: https://twitter.com/FoodPhotoAward
comments: true
share: true
references:
  - title: "devops"
    url: "https://devops.com/"
---

* TOC
{:toc}

敏捷开发的核心是迭代开发（iterative development）。敏捷一定是采用迭代开发的方式。

迭代开发将一个大任务，分解成多次连续的开发，本质就是逐步改进。

![](/images/devops/agile/ScrumModel.jpg)
{: .center.middle}

一个 Sprint 指一次迭代。

1. 首先需要确定一个 Product Backlog（对应我们的 TB）（按优先顺序排列的一个产品需求列表），这个是由 Product Owner 负责的；Product Owner 对应的是我们的业务顾问。

2. Scrum Team （我们的 UI 开发团队）根据 Product Backlog （TB）列表，做工作量的预估和安排；

3. 有了 Product Backlog （TB）列表，我们需要通过 Sprint Planning Meeting（Sprint计划会议） 来从中挑选出一个 Story 作为本次迭代完成的目标，这个目标的时间周期是 1~4 个星期，然后把这个 Story 进行细化，形成一个 Sprint Backlog（对应我们的开发 TB）

4. 在 Scrum Team （UI 开发团队） 完成（Planning Meeting）计划会议上选出的 Sprint Backlog 过程中，需要进行 Daily Scrum Meeting（每日站立会议），每次会议控制在 15 分钟左右，每个人都必须发言，并且要向所有成员当面汇报你昨天完成了什么，并且向所有成员承诺你今天要完成什么，同时遇到不能解决的问题也可以提出。每个人回答完成后，要走到黑板（形式待定）前更新自己的 Sprint burn down（Sprint燃尽图）；

5. 做到每日集成（Integration），也就是每天都要有一个可以成功编译、并且可以演示的版本；这需要团队开发成员运用代码管理工具 Git 来管理代码，每日提交自己代码，最终团队所有成员的代码都能合到一个版本里并成功运行出这一天的演示版本。

6. 当一个 Story 完成，也就是 Sprint Backlog 被完成，也就表示一次 Sprint 完成，这时，我们要进行 Srpint Review Meeting（演示会议），也称为评审会议，产品负责人和客户都要参加，每一个 Scrum Team 的成员都要向他们演示自己完成的软件产品（这个会议非常重要，一定不能取消）；

7. 最后就是 Sprint Retrospective Meeting（回顾会议），也称为总结会议，以轮流发言方式进行，每个人都要发言，总结并讨论改进的地方，放入下一轮 Sprint 的产品需求中；

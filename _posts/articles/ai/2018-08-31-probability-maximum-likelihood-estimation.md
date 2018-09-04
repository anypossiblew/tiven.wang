---
layout: post
theme: Merriweather
title: "Probability - Maximum Likelihood Estimation"
excerpt: "maximum likelihood estimation in probability theory"
modified: 2018-08-31T11:51:25-04:00
categories: articles
tags: [Probability, Math]
image:
  vendor: gstatic
  feature: /prettyearth/assets/full/2381.jpg
  credit: Google Earth
  creditlink: https://earthview.withgoogle.com/tanbar-australia-2381
comments: true
share: true
mathjax: true
references:
  - id: 1
    title: " PennState Eberly College of Science - Probability Theory and Mathematical Statistics / Maximum Likelihood Estimation"
    url: https://onlinecourses.science.psu.edu/stat414/node/191/
  - id: 1
    title: "简书 - 深入浅出最大似然估计（Maximum Likelihood Estimation）"
    url: https://www.jianshu.com/p/f1d3906e4a3e
---

* TOC
{:toc}

最大似然估计(maximum likelihood estimation) 是利用已知的样本的结果，在使用某个模型的基础上，反推最有可能导致这样结果的模型参数值。

举个通俗的例子：假设一个袋子装有白球与红球，比例未知，现在抽取 10 次（每次抽完都放回，保证事件独立性），假设抽到了 7 次白球和 3 次红球，在此数据样本条件下，可以采用最大似然估计法求解袋子中白球的比例（最大似然估计是一种“模型已定，参数未知”的方法）。当然，这种数据情况下很明显，白球的比例是 70% ，但如何通过理论的方法得到这个答案呢？一些复杂的条件下，是很难通过直观的方式获得答案的，这时候理论分析就尤为重要了，这也是学者们为何要提出最大似然估计的原因。

抽象理论化后的问题就是，假设抽中白球的概率为 $$p$$，在我们这个问题中那么抽中红球的概率则为 $$1-p$$。又假设在我们的 $$a+b$$ 次抽样中，抽中白球的次数为 $$a$$，抽中红球的次数为 $$b$$。那么我们本次抽样的条件概率公式为

$$p^a(1-p)^b$$

那么使此条件概率最大的参数就是最有可能的概率分布模型，那么就是说我们要求解 $$p$$ 使此公式值最大。为了方便数学计算我们用 $$x$$ 表示 $$p$$ 公式重新表示为 

$$f(x)=x^a(1-x)^b$$

下面我们通过求此函数的导数解函数的最大值

$$\frac{d}{dx}\left(x^a\left(1-x\right)^b\right)$$

使用微分乘法定则 : $$\left(f\cdot g\right)'=f\:'\cdot g+f\cdot g'$$ $$f=x^a,\:g=\left(1-x\right)^b$$

$$f'(x)=\frac{d}{dx}\left(x^a\right)\left(1-x\right)^b+\frac{d}{dx}\left(\left(1-x\right)^b\right)x^a$$

再由

$$\frac{d}{dx}\left(x^a\right)=ax^{a-1}$$

$$\frac{d}{dx}\left(\left(1-x\right)^b\right)=-b\left(1-x\right)^{b-1}$$

代入公式

$$=ax^{a-1}\left(1-x\right)^b+\left(-b\left(1-x\right)^{b-1}\right)x^a$$

化简

$$=ax^{a-1}\left(1-x\right)^b+\left(-b\left(1-x\right)^{b-1}\right)x^a$$

接下来要做的就是求解

$$ax^{a-1}\left(1-x\right)^b+\left(-b\left(1-x\right)^{b-1}\right)x^a=0$$

先变换一下公式为 

$$=\frac{(1-x)ax^{a-1}\left(1-x\right)^b}{1-x}-\frac{bx^a\left(1-x\right)^b}{1-x}$$

然后 

$$=\frac{(1-x)ax^{a-1}-bx^a}{1-x}\left(1-x\right)^b$$

然后

$$=\frac{(a-ax-bx)x^{a-1}}{1-x}\left(1-x\right)^b$$

现在求解此方程就等价于求解

$$a-ax-bx=0$$

那么

$$x=\frac{a}{a+b}$$

至此我们之前的例子中的白球的比例是 70% 是怎么来的从理论上就解释清楚了。

## 最大似然估计

我们现在再把此理论抽象到更高级别，假设理想中的概率分布模型是 $$f(x;\theta)$$，现在进行 $$n$$ 独立抽样的结果为 $$(x_1,x_2,\dots,x_n)$$ 那么此结果的条件概率记为

$$\displaystyle f(x_1,x_2,\dots,x_n;\theta)=\prod_{i=1}^nf(x_i;\theta)$$

因为此问题中要求解的是参数 $$\theta$$ 所以我们定义似然 $$L$$ 为

$$L(\theta;x_1,x_2,\dots,x_n)=f(x_1,x_2,\dots,x_n;\theta)=\prod_{i=1}^nf(x_i;\theta)$$

两边取 $$ln$$, 取 $$ln$$ 是为了将右边的乘号变为加号（根据 [Ln Rules][rapidtables/Ln_Rules]），方便求导。

$$\displaystyle \ln L(\theta;x_1,x_2,\dots,x_n)=\ln \prod_{i=1}^nf(x_i;\theta)=\sum_{i=1}^n\ln f(x_i;\theta)$$

此结果通常称之为对数似然。对取样个数取个平均值称为平均对数似然

$$\frac{1}{n} \ln L(\theta;x_1,x_2,\dots,x_n)$$

最大似然估计的过程，就是找一个合适的 $$\theta$$，使得平均对数似然的值为最大。

## 正态分布的似然函数

举例，正态分布的似然函数

正态分布的公式，当 $$\mu$$ (期望) 为 0 ，$$\sigma^1$$ (方差) 为 1 时，分布称为标准正态分布：

$$f(x;\mu,\sigma^2)=\dfrac{1}{\sigma \sqrt{2\pi}}\text{exp} \left\lgroup-\dfrac{(x-\mu)^2}{2\sigma^2}\right\rgroup$$

将此正态分布函数代入似然函数得到

$$\displaystyle L(\mu,\sigma^2)=\left[\dfrac{1}{\sigma \sqrt{2\pi}}\right]^n\text{exp} \left[-\dfrac{1}{2\sigma^2}\sum_{i=1}^n (x_i-\mu)^2\right]$$

两边取对数（根据 [Ln Rules][rapidtables/Ln_Rules]）得

$$\displaystyle \text{ln}L(\mu,\sigma^2)=-n\text{ln}\left(\sigma \sqrt{2\pi}\right) + \left(-\dfrac{1}{2\sigma^2}\sum_{i=1}^n (x_i-\mu)^2\right)\text{ln} e$$

然后

$$\displaystyle = -\frac{n}{2}\text{ln}\sigma^2 -n\text{ln}\sqrt{2\pi} - \left(\dfrac{1}{2\sigma^2}\sum_{i=1}^n (x_i-\mu)^2\right)$$

假设 $$\mu$$ (期望) 为 0 ，我们求似然相对于变量 $$\sigma^2$$ (方差) 的偏导数 (将 $$\sigma^2$$ 看作一个变量)(根据导数规则 [Derivative Rules][rapidtables/derivative_Rules])

$$\displaystyle \dfrac{\partial\text{ln}L(0,\sigma^2)}{\partial\sigma^2} =-\frac{n}{2\sigma^2} - \left(-\dfrac{1}{2(\sigma^2)^2}\sum_{i=1}^n x_i^2\right)=0$$

公式两边乘以 $$2(\sigma^2)^2$$

$$\displaystyle -n\sigma^2+\sum_{i=1}^nx_i^2=0$$

那么结果就是

$$\displaystyle \sigma^2 = \dfrac{\sum_{i=1}^n x_i^2}{n}$$

如果加上参数 $$\mu$$ 则

$$\displaystyle \hat{\sigma}^2 = \dfrac{\sum_{i=1}^n (x_i-\mu)^2}{n}$$

如果对 $$\mu$$ 求偏导数

$$\displaystyle \dfrac{\partial\text{ln}L(\mu,\sigma^2)}{\partial\mu} = -\dfrac{1}{2\sigma^2}\sum_{i=1}^n2(x_i-\mu)$$

然后

$$=-\dfrac{1}{\sigma^2}\sum_{i=1}^n(x_i-\mu)=0$$

则 

$$\sum_{i=1}^n(x_i-\mu)=\sum_{i=1}^nx_i-n\mu=0$$

最终

$$\hat{\mu}=\frac{\sum_{i=1}^nx_i}{n}$$


[rapidtables/Ln_Rules]:https://www.rapidtables.com/math/algebra/ln/Ln_Rules.html
[rapidtables/derivative_Rules]:https://www.rapidtables.com/math/calculus/derivative.html
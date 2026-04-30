---
title: Convex Optimization
subtitle:
date: 2026-04-30T22:57:02+08:00
slug: c37d08d
draft: false
description:
keywords:
comment: true
weight: 0
tags:
  - 优化
  - 凸优化
categories:
  - 数学
hiddenFromHomePage: false
hiddenFromSearch: false
hiddenFromRelated: false
hiddenFromFeed: false
summary:
featuredImagePreview:
featuredImage:
password:
message:
repost:
  enable: false
  url:

# See details front matter: https://fixit.lruihao.cn/documentation/content-management/introduction/#front-matter
---

凸优化学习笔记.

参考 [EE364b - Convex Optimization II](https://web.stanford.edu/class/ee364b/)

<!--more-->

## Introduction

最优化的常见形式为
$$
\begin{aligned}
\operatorname{minimize}\quad & f_0(\boldsymbol{x}) \\
\operatorname{subject\ to}\quad & f_i(\boldsymbol{x}) \le b_i,\quad i=1,\ldots,m.
\end{aligned}
$$
其中 $\boldsymbol{x}=(x_1,\cdots ,x_n)$ 是问题的变量，$f_0:\mathbb R^n \to \mathbb R$ 是我们想要最小化的目标函数（损失），$f_i:\mathbb R^n \to \mathbb R$ 是约束函数，常数 $b_i$ 是限制. 称向量 $\boldsymbol{x^*}$ 是最优的，或称其为问题的解，当且仅当对于任意满足 $f_i(\boldsymbol{z}) \le b_i$ 的向量 $\boldsymbol{z}$ 均有 $f_0(\boldsymbol{z}) \ge f_0(\boldsymbol{x^*})$.

当 $f$ 均为线性函数时这就是线性规划问题，否则就是非线性规划. 我们要研究的凸优化就是 $f$ 为凸函数时的最优化问题，凸函数的定义、答案的求解和其它内容均会在之后讲解.

## Convex Sets

在这一章里，我们需要在了解一些基础概念的同时感性理解什么是凸性.

### Affine

我们都知道，空间中两点 $\boldsymbol{x_1},\boldsymbol{x_2}$ 能唯一确定一条直线，直线上的点均可表示为 $\theta \boldsymbol{x_1}+(1-\theta)\boldsymbol{x_2}$,$\theta \in \mathbb R$，当参数 $\theta \in [0,1]$ 时表示以 $\boldsymbol{x_1},\boldsymbol{x_2}$ 为端点的线段上的点.

{{< figure src="/images/c37d08d/img1.svg" title="$\boldsymbol{x_1}$ 与 $\boldsymbol{x_2}$ 确定的直线" >}}

集合 $C \subseteq \mathbb R^n$ 是**仿射集（affine set）** 当且仅当对于任意 $\boldsymbol{x_1} \ne \boldsymbol{x_2} \in C$ 和 $\theta \in \mathbb R$ 均有 $\theta \boldsymbol{x_1} + (1-\theta)\boldsymbol{x_2} \in C$. 通俗地讲，$C$ 中任意两点所在直线上的点均在 $C$ 中. 这个定义可以扩展到有限个变量的和 $\theta_1 \boldsymbol{x_1} + \cdots \theta_k \boldsymbol{x_k} \in C$，其中 $\theta_1 + \cdots + \theta_k = 1$，若 $C$ 是仿射集，我们也称 $C$ 是仿射的. 值得说明的是，这样的系数和为 $1$ 的线性组合也叫 **仿射组合（affine combination）**.

若 $C$ 是一个仿射集，那么将其平移至经过原点后的集合是一个子空间，形式化地，设 $C$ 是一个仿射集且 $\boldsymbol{x_0} \in C$，则
$$
V=C-\boldsymbol{x_0}=\{\boldsymbol{x}-\boldsymbol{x_0}:\boldsymbol{x} \in C\}
$$
是子空间.
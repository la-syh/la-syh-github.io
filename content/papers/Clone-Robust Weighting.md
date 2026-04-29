---
title: Clone Robust Weighting
subtitle:
date: 2026-04-29T23:17:51+08:00
slug: 40c1f6f
draft: false
description:
keywords:
comment: true
weight: 0
tags:
  - 推荐系统
categories:
  - 论文笔记
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

[文章链接](https://arxiv.org/pdf/2602.24024)

<!--more-->

如今 AI 生成内容越来越容易，攻击者总可以批量生成一些内容相似的文章来使平台的推荐算法产生偏好. 这导致之前将内容简单分为完全重复和不相关两类的算法出现了问题： AI 可以大量生成用词、语气等完全不同但主旨相同的文章，这迫使我们修改算法，将原先简单的“相同或无关”转为对内容相似度的评价.

## Clone-Robust Weighting Functions

首先形式化一下问题：现在有一个内容聚合器，每当用户刷新界面，聚合器就会从所有内容构成的全集 $M$ 中选出一个有限集 $S$，并依某个概率分布 $\pi_S$ 独立重复[^1]选取 $k$ 个内容展示给用户. 集合 $M$ 应当是一个伪度量空间，带有距离函数 $d:E \times E \to \mathbb R_{\ge 0}$，也就是存在 $x \ne y$ 使得 $d(x,y) = 0$，这在两个用户发表相同内容时是必要的.

现在的问题在于如何选择概率分布 $\pi_S$，一个平凡的方案是用均匀分布，但是这样会被攻击者通过多次发布相同内容成功攻击，此时拥有一个评价内容相似度的伪度量 $d$ 是至关重要的，我们假设 $d$ 是被公布的，并研究它应该如何影响 $\pi_S$.

形式化地，引入一个权重函数（weighting function）$f$，它对给定的有限集 $S$ 生成一个概率分布 $p_S \in \Delta (S)$，其中 $\Delta (S)$ 是集合 $S$ 上所有概率分布的全体，也就是说
$$
f:S \in \bigcup_{n \ge 1} \mathcal P_n(M) \to p_S \in \Delta (S)
$$
其中 $\mathcal P_n(M)$ 表示 $M$ 的所有势为 $n$ 的子集构成的集族，$\Delta(S) = \{p_S:S \to [0,1], \sum_{x \in S}p_S(x)=1\}$ 是所有 $S$ 上的概率分布构成的集合.

理想的权重函数 $f$ 应当具有什么性质？
- $f$ 应当对同构的内容给出相同的被展示概率.
- 进一步的，相似的内容理应具有相似的概率，也就是说 $f$ 应当连续.
- 为了防范重复内容攻击，加入一个内容后，概率只应在小范围内重新分配，也就是存在一个阈值 $\alpha > 0$ 使得距离大于 $\alpha$ 的内容被展示的概率不会变化.
- 最后，每个内容被展示的概率都应该大于 $0$，此时攻击者不能通过某些手段将某个帖子的被展示概率降为 $0$.

上面的性质可以形式化为类 Lipschitz 条件，按照这样定义 Clone-Robust Weighting Function 为

**定义 1（Clone-Robust Weighting Function）** 阈值 $\alpha > 0$ 为一个 disambiguation factor，$n \in \mathbb N_{>0}$，$L_n,L_n',L_n'' > 0$ 为 Lipschitz 常数，一个权重函数 $f$ 如果对所有 $S \in \mathcal P_n(M)$ 均有 $\forall x,y \in S,z \in M-S$，
- **Symmetry**: 对自等距映射 $\sigma:S \to S$ 总有 $f(S)(x)=f(S)(\sigma(x))$
- **Lipschitz Clone Fairness**: $|f(S)(x)-f(S)(y)| \le L_n d(x,y)$
- **Lipschitz Continuity**: 对任意双射 $\pi :S \to \pi(S) \subseteq M$ 均有 $|f(S)(x)-f(\pi(S))(\pi(x))| \le L_n' \max_{x \in S} d(x,\pi(x))$
- **$\alpha$-Lipschitz Locality**: 如果 $d(x,y) > \alpha$，则 $|f(S \cup \{z\})(y) - f(S)(y)| \le L_n'' d(x,z)$
- **Positivity**: $f(S)(x) > 0$

对任意 $n \in \mathbb N_{>0}$ 均满足上述条件的 $f$ 被称为 **$\alpha$-clone-robust weighting function**.

[^1]: 这里假设统一内容被重复选取的概率极小，也就是 $k^2\|p_S\|_2{}^2 \ll 1$.

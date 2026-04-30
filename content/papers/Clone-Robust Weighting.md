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

[^1]: 这里假设统一内容被重复选取的概率极小，也就是 $k^2\|p_S\|_2{}^2 \ll 1$.

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

**DEFINITION 1（Clone-Robust Weighting Function）** 阈值 $\alpha > 0$ 为一个 disambiguation factor，$n \in \mathbb N_{>0}$，$L_n,L_n',L_n'' > 0$ 为 Lipschitz 常数，一个权重函数 $f$ 如果对所有 $S \in \mathcal P_n(M)$ 均有 $\forall x,y \in S,z \in M-S$，
- **Symmetry**: 对自等距映射 $\sigma:S \to S$ 总有 $f(S)(x)=f(S)(\sigma(x))$
- **Lipschitz Clone Fairness**: $|f(S)(x)-f(S)(y)| \le L_n d(x,y)$
- **Lipschitz Continuity**: 对任意双射 $\pi :S \to \pi(S) \subseteq M$ 均有 $|f(S)(x)-f(\pi(S))(\pi(x))| \le L_n' \max_{x \in S} d(x,\pi(x))$
- **$\alpha$-Lipschitz Locality**: 如果 $d(x,y) > \alpha$，则 $|f(S \cup \{z\})(y) - f(S)(y)| \le L_n'' d(x,z)$
- **Positivity**: $f(S)(x) > 0$

对任意 $n \in \mathbb N_{>0}$ 均满足上述条件的 $f$ 被称为 **$\alpha$-clone-robust weighting function**.


## Construction based on Neighborhood Graphs

设 $S \subseteq M$ 是有限集，$r \ge 0$ 是半径，定义 **$r$-近邻图**（$r$-neighborhood graph）$G_r(S)=\big(S,E_r(S)\big)$ 是点集为 $S$，边集为 $E_r(S) = \{ (x,y) \in S^2 : d(x,y) \le r \}$. 显然这张图中的边不具有传递性，但是当 $d(x,y),d(y,z) \le r$ 时总有 $d(x,z) \le 2r$，因此若在 $G_r(S)$ 中有边 $x \sim y$ 和 $y \sim z$，那么 $G_{2r}(S)$ 中必然有边 $x \sim z$.

定义图 $G=(V,E)$ 中 $x$ 的邻居为 $N_G[x]=\{x\} \cup \{y \in V : (x,y) \in E\}$ 并依此定义 $x$ 所在的等价类 $[x]_G=\{y \in V : N_G[y]=N_G[x]\}$.

**DEFINITION 2（Graph Weighting Functions）** 一个图上权重函数 $w$ 是一个给有限无向图上顶点赋概率分布的函数，也就是说
$$
w:(V,E) \in \mathcal G \to p_V \in \Delta(V)
$$
其中 $\mathcal G$ 表示所有有限无向图，$\Delta(V)=\{p_V:V \to [0,1]:\sum_{x \in V}p_V(x)=1\}$，当 $w$ 满足
- **Symmetry** 对任意图同构 $\sigma:\mathcal G \to \mathcal G$ 均有 $w(G)(x)=w(\sigma(G))(\sigma(x))$
- **Locality** 对任意 $y \in V(G)-N_G[x]$ 和 $z \in [x]_G$ 均有 $w(G)(y)=w(G-\{z\})(y)$
- **Positivity** 对任意 $x \in V(G)$ 均有 $w(G)(x) > 0$.[^2]
时，该 graph weighting function 就被称作 **clone-robust graph weighting function**.

[^2]: 这里的 **Positivity** 在原论文中并未提及，但如果没有这条性质，Theorem 1 中对应正性的证明存在问题.

{{< figure src="/images/40c1f6f/img1.svg" title="$w^{\text{CU}}$ 示意图" width="60%" >}}

一个平凡的构造是让每个等价类具有相同的概率，等价类内部再将概率均分给每个结点. 形式化地，设 $V/\equiv_G$ 表示图 $G$ 的所有等价类构成的集合，则
$$
w^{\text{CU}}(G)(x)=\frac{1}{|V/\equiv_G| \cdot |[x]_G|}, \qquad x \in V
$$

我们关心 clone-robust graph weighting function 的原因是它可以给出任意伪度量下的 clone-robust weighting function，这由下面的定理 1 导出.

{{< admonition theorem "THEOREM 1" true >}}
设 $w$ 是一个 clone-robust graph weighting function，$\alpha > 0$ 为一个正半径，$\nu$ 是一个 $[0,\alpha]$ 上的概率密度函数，有上界 $\bar\nu$. 此时对任意有限集 $S \subseteq M$ 和任意 $x \in S$，定义
$$
f_{\nu,w}(S)(x)=\int_0^\alpha \nu(r)w(G_r(S))(x) \d r
$$
则 $f_{\nu,w}$ 是一个 $\alpha$-clone-robust weighting function.
{{< /admonition >}}

这个定义的通俗解释是：对每一个 $[0,\alpha]$ 的半径 $r$ 求出点 $x$ 在图 $G_r(S)$ 中的权重后做加权平均，如果 $\nu$ 比较尖锐，那么在某个半径处的权重就会很大，而若 $\nu$ 较为平滑，那么扰动带来的权重变化也更可控，因此规定上界 $\bar\nu$ 实际上是为控制 Lipschitz 常数.

{{< admonition proof "PROOF" true>}}
首先这个定义是 well-defined 的，因为不同的 $G_r(S)$ 只有有限个，$r$ 从 $0$ 增加到 $\alpha$ 的过程中，每经过某个 $d(u,v)$ 才会使图的形态发生改变. 形式化地，记 $\mathcal D_S^x = \{d(x,z):z \in S, z \ne x\}$ 与 $\mathcal D = \bigcup_{x \in S} \mathcal D_S^x$，并设 $\mathcal D_S$ 中元素为 $0<r_1 < r_2 < \cdots < r_k<\infty$，则 $r \in [r_i,r_{i+1})$ 时图 $G_r(S)$ 是相同的. 并且 $f_{\nu, w}(S)$ 自然地成为一个概率分布函数.

我们依次证明每条性质，核心的思路在于坏半径构成的集合很小.

- **Symmetry** 对于等距自映射 $\sigma$，$\sigma$ 是 $G_r(S)$ 的自同构，因此有 $w(G_r(S))(\sigma(x))=w(G_r(S))(x)$，带入定义式即可得到 $f_{\nu, w}(x) = f_{\nu, w}(\sigma(x))$.
- **Lipschitz Clone Fairness** **待填充**
- **Positivity** 由 $w$ 的 **Positivity** 和 $\nu$ 的非负性自然给出.
{{< /admonition >}}

更进一步地，$f_{\nu,w}(S)(x)$ 可以在 $\mathcal O \Big(|S|^2(W(|S|)+C_v+C_d+\log |S|)\Big)$ 的时间复杂度内被计算，其中 $W(i)$ 是 **待填充**

## Design Space of Graph Weighting Functions

现在 clone-robust graph weighting function 只有三条限制 Symmetry、Locality 和 Positivity，这导致存在大量满足条件的函数，事实上有如下引理.

{{< admonition lemma "LEMMA 1" true>}}
设 $w$ 是任意一个满足 Symmetry 和 Positivity 的 graph weighting function. 对图 $G \in \mathcal G$ 定义 $G/\equiv$ 表示将每个等价类缩点后的新图，$P_G(x\to y)=1/\big(1+\deg_G(x)\big)\big[y \in N_G[x]\big]$ 表示 the lazy random walk kernel，则

$$
\tilde{w}(G)(x):=\frac{w(G/\equiv)([x]_G)}{\big| [x]_G \big|}
$$
和
$$
\hat{w}(G)(x):=\sum_{y \in V(G)} \tilde{w}(G)(y)P_G(y \to x)
$$
都是 clone-robust graph weighting function.
{{< /admonition >}}

其中 $\tilde{w}$ 表示将图中 $w$ 对等价类中每个的权重求和再平均分配，$\hat{w}$ 在 $\tilde{w}$ 的基础上再将每个点的权重平均分配到每个邻居上. 这两个构造都专门针对的等价类，那么可不可以加强限制，要求添加邻居结点时更远的权重保持不变？下面的引理否认了这一点.

{{< admonition lemma "LEMMA 2" true>}}
不存在 graph weighting function $w$ 同时满足
- **symmetry**
- **strong locality** 对任意图 $G \in \mathcal G$ 和点 $x,y,z \in V(G)$ 且 $y \in N_G[x],z \notin N_G[x]$ 均有 $w(G)(z)=w(G-\{y\})(z)$
{{< /admonition >}}

### Explainability of Existing Weighting Functions
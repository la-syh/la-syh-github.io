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

## 概览

我们的目标是构造一个合适的函数 $f$ 给每一个可能的待推送内容构成的有限集 $S$ 赋一个概率分布，给出每条内容被推送的概率. 核心问题有两个：

1. 什么样的 $f$ 是好的
2. 如何构造这样的函数
  
对于第一点，我们给出了 Clone-Robust Weighting Function 的定义，它不局限于欧氏空间而是可以用于任意伪度量空间，其性质削弱了使用大量相似内容的攻击. 对于第二点，文章采用了图论方法：对每个半径 $r$ 将 $S$ 转为近邻图 $G_r(S)$ 再用一个图权重函数 $w$ 给顶点赋权. 只要 $w$ 满足一些基本条件且本身可以高效计算，那么就可以给出一个可以高效计算的 $f$.

于是问题转化为寻找合适的 $w$，限制很弱导致了满足条件的 $w$ 很多. 但文章还希望 $w$ 能够有较好的可解释性，能够解释两个内容之间共享或转移了多少权重.

为此，文章先建立了图上共享系数的框架并先后考察了
- 基于 maximal clique cover 的构造
- 基于信息论/最大熵的构造

这些尝试均有不足之处，文章也到此结束.

**结论**： 我们已经能在任意伪度量空间上构造 clone-robust weighting，但要找到同时满足 clone-robust、可解释、non-negative sharing 的图权重规则，仍然很难，是未来工作。


## Clone-Robust Weighting Functions

首先形式化一下问题：现在有一个内容聚合器，每当用户刷新界面，聚合器就会从所有内容构成的全集 $M$ 中选出一个有限集 $S$，并依某个概率分布 $\pi_S$ 独立重复[^1]选取 $k$ 个内容展示给用户. 集合 $M$ 应当是一个伪度量空间，带有距离函数 $d:M \times M \mapsto \mathbb R_{\ge 0}$，也就是存在 $x \ne y$ 使得 $d(x,y) = 0$，这在两个用户发表相同内容时是必要的.

[^1]: 这里假设同一内容被重复选取的概率极小，也就是 $k^2\|p_S\|_2{}^2 \ll 1$.

现在的问题在于如何选择概率分布 $\pi_S$，一个平凡的方案是用均匀分布，但是这样会被攻击者通过多次发布相同内容成功攻击，此时拥有一个评价内容相似度的伪度量 $d$ 是至关重要的，我们假设 $d$ 是被公布的，并研究它应该如何影响 $\pi_S$.

形式化地，引入一个权重函数（weighting function）$f$，它对给定的有限集 $S$ 生成一个概率分布 $p_S \in \Delta (S)$，其中 $\Delta (S)$ 是集合 $S$ 上所有概率分布的全体，也就是说
$$
f:S \in \bigcup_{n \ge 1} \mathcal P_n(M) \mapsto p_S \in \Delta (S)
$$
其中 $\mathcal P_n(M)$ 表示 $M$ 的所有势为 $n$ 的子集构成的集族，$\Delta(S) = \{p_S:S \mapsto [0,1], \sum_{x \in S}p_S(x)=1\}$ 是所有 $S$ 上的概率分布构成的集合.

理想的权重函数 $f$ 应当具有什么性质？
- $f$ 应当对同构的内容给出相同的被展示概率.
- 进一步的，相似的内容理应具有相似的概率，也就是说 $f$ 应当连续.
- 为了防范重复内容攻击，加入一个内容后，概率只应在小范围内重新分配，也就是存在一个阈值 $\alpha > 0$ 使得距离大于 $\alpha$ 的内容被展示的概率被距离线性控制.
- 最后，每个内容被展示的概率都应该大于 $0$，此时攻击者不能通过某些手段将某个帖子的被展示概率降为 $0$.

上面的性质可以形式化为类 Lipschitz 条件，按照这样定义 Clone-Robust Weighting Function 为

{{< admonition definition "DEFINITION 1 (Clone-Robust Weighting Function)" true>}}
给定阈值 $\alpha > 0$ 和权重函数 $f$，若对于任意 $n \in \mathbb N_{>0}$，存在 Lipschitz 常数 $L_n,L_n',L_n'' > 0$，使得对任意 $S \in \mathcal P_n(M)$ 以及任意 $x,y \in S,z \in M-S$ 均满足：
- **Symmetry**: 对自等距映射 $\sigma:S \mapsto S$ 总有 $f(S)(x)=f(S)(\sigma(x))$
- **Lipschitz Clone Fairness**: $|f(S)(x)-f(S)(y)| \le L_n d(x,y)$
- **Lipschitz Continuity**: 对任意双射 $\pi :S \mapsto \pi(S) \subseteq M$ 均有 $|f(S)(x)-f(\pi(S))(\pi(x))| \le L_n' \max_{x \in S} d(x,\pi(x))$
- **$\alpha$-Lipschitz Locality**: 如果 $d(x,y) \ge \alpha$，则 $|f(S \cup \{z\})(y) - f(S)(y)| \le L_n'' d(x,z)$
- **Positivity**: $f(S)(x) > 0$

则称 $f$ 为 **$\alpha$-clone-robust weighting function**.
{{< /admonition >}}

## Construction based on Neighborhood Graphs

设 $S \subseteq M$ 是有限集，$r \ge 0$ 是半径，定义 **$r$-近邻图**（$r$-neighborhood graph）$G_r(S)=\big(S,E_r(S)\big)$ 是点集为 $S$，边集为 $E_r(S) = \{ (x,y) \in S^2 : d(x,y) \le r \}$ 的无向图. 显然这张图中的边不具有传递性，但是当 $d(x,y),d(y,z) \le r$ 时总有 $d(x,z) \le 2r$，因此若在 $G_r(S)$ 中有边 $x \sim y$ 和 $y \sim z$，那么 $G_{2r}(S)$ 中必然有边 $x \sim z$.

定义图 $G=(V,E)$ 中 $x$ 的邻居为 $N_G[x]=\{x\} \cup \{y \in V : (x,y) \in E\}$ 并依此定义 $x$ 所在的等价类 $[x]_G=\{y \in V : N_G[y]=N_G[x]\}$.

{{% admonition definition "DEFINITION 2 (Graph Weighting Functions)" true %}}
一个图上权重函数 $w$ 是一个给有限无向图上顶点赋概率分布的函数，也就是说
$$
w:(V,E) \in \mathcal G \mapsto p_V \in \Delta(V)
$$
其中 $\mathcal G$ 表示所有有限无向图，$\Delta(V)=\{p_V:V \mapsto [0,1]:\sum_{x \in V}p_V(x)=1\}$，当 $w$ 满足
- **Symmetry** 对任意图同构 $\sigma:\mathcal G \mapsto \mathcal G$ 均有 $w(G)(x)=w(\sigma(G))(\sigma(x))$
- **Locality** 对任意 $y \in V(G)-N_G[x]$ 和 $z \in [x]_G$ 均有 $w(G)(y)=w(G-\{z\})(y)$
- **Positivity**[^2] 对任意 $x \in V(G)$ 均有 $w(G)(x) > 0$.

时，该 graph weighting function 就被称作 **clone-robust graph weighting function**. 注意原文只要求 Symmetry 和 Locality；但 THEOREM 1 的 Positivity 证明要求 $w$ 具有 Positivity，所以这里采用加强版定义。
[^2]: 这里的 **Positivity** 在原论文中并未提及，但如果没有这条性质，Theorem 1 中对应 Positivity 的证明存在问题.
{{% /admonition %}}


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

更进一步，$f_{\nu,w}(S)(x)$ 可以在 $\mathcal O \Big(|S|^2(W(|S|)+C_\nu+C_d+\log |S|)\Big)$ 的时间复杂度内被计算，其中 $W(i)$ 是 $w$ 在 $i$ 个点的图上的最坏计算复杂度，$C_\nu$ 是计算 $\nu$ 的累积分布函数 CDF 在单点处的复杂度，$C_d$ 是计算一次距离 $d(x,y)$ 的复杂度.

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

其中 $\tilde{w}$ 表示将图中 $w$ 对等价类缩点，在新图中按照 $w$ 得到权重并平均分配给类内结点，$\hat{w}$ 在 $\tilde{w}$ 的基础上再将每个点的权重平均分配到每个邻居上. 这两个构造都专门针对的等价类，那么可不可以加强限制，要求添加邻居结点时更远的权重保持不变？下面的引理否认了这一点.

{{< admonition lemma "LEMMA 2" true>}}
不存在 graph weighting function $w$ 同时满足
- **symmetry**
- **strong locality** 对任意图 $G \in \mathcal G$ 和点 $x,y,z \in V(G)$ 且 $y \in N_G[x],z \notin N_G[x]$ 均有 $w(G)(z)=w(G-\{y\})(z)$
{{< /admonition >}}

### Explainability of Existing Weighting Functions

接下来的这一小节主要是复述 [[Berriaud and Wattenhofer, 2025]](https://arxiv.org/abs/2502.03576) 这篇文章中引入的函数的可解释性相关内容，并在下一小节试图将其迁移到本文中的 graph weighting function 中.

为了理解权重的分配方式，我们自然地想要得知两个不同的元素之间会共享多少权重，为此我们将引入**共享系数（sharing coefficient）** 来量化两个元素之间相互影响权重的程度. [[Berriaud and Wattenhofer, 2025]](https://arxiv.org/abs/2502.03576) 中构造的函数针对有限集 $S \subseteq \mathbb R^n$ 和欧式距离的度量，定义
$$
g_r(S)(x)=\frac{1}{\operatorname{Vol}\!\Big(\bigcup_{y\in S} B_r(y)\Big)}
\int_{B_r(x)} \frac{1}{|S\cap B_r(z)|} \d z
$$
其中 $B_r(\cdot)$ 表示半径为 $r > 0$ 的球，$\operatorname{Vol}(X)$ 表示$X \in \mathbb R^n$ 的 $n$ 维 Lebesgue 测度. 这个式子的含义为：空间中的每个点都会向与它距离不超过 $r$ 的 $S$ 中元素投票，若有多个则将票均分，$|S\cap B_r(z)|$ 就是以点 $z$ 为球心的球中有多少个 $S$ 中的点，统一除以体积是为了将和归一化.

$g_r$ 的共享系数是容易定义的：对于两个元素 $x,y \in S$，他们的共享系数表示 $x$ 的权重中有多少是与 $y$ 竞争得到的，更准确地，表示在旧的归一化尺度下 $y$ 对 $x$ 的权重造成的损失.

{{< admonition definition "DEFINITION 3 (SHARING COEFFICIENT OF $g_r$)" true >}}
对于有限集 $S \subseteq \mathbb R^n$ 和互异元素 $x \ne y \in S$，定义 $x$ 与 $y$ 的共享系数 $\chi_{g_r, S}(x,y)$ 为
$$
\chi_{g_r, S}(x,y):=\frac{1}{\operatorname{Vol}\!\Big( \bigcup_{u \in S}B_r(u) \Big)}
\int_{B_r(x)\cap B_r(y)} \Big(\frac{1}{|S\cap B_r(z)|-1}-\frac{1}{|S\cap B_r(z)|}\Big)\d z
$$
{{< /admonition >}}

更进一步地，在这样的定义下
$$
g_r(S)(x)-\sum_{y \ne x}\chi_{g_r, S}(x,y)=\frac{1}{\operatorname{Vol}\!\Big( \bigcup_{y \in S}B_r(y) \Big)}
\int_{B_r(x)-\bigcup_{y\ne x}B_r(y)} \frac{1}{|S \cap B_r(z)|} \d z \ge 0
$$

形式化地记作 $g_r(S)(x)=\chi_{g_r, S}(x,x)+\sum_{y \ne x} \chi_{g_r, S}(x,y)$，注意这里 $\chi_{g_r, S}(x,x)$ 的定义不由 DEFINITION 3 中的式子给出，而是由 $g_r(S)(x)-\sum_{y \ne x}\chi_{g_r, S}(x,y)$ 定义. 这个性质记作 additive property.

然后我们就可以知道删除 $x$ 对其他元素 $y$ 的影响，
$$
g_r(S-\{x\})(y)=(g_r(S)(y)+\chi_{g_r, S}(x,y)) \cdot (1+\eta_{r,S,x})
$$
其中非负常数 $\eta_{r,S,x}$ 定义为
$$
\eta_{r,S,x}=\frac{\chi_{g_r,S}(x,x)}{1-\chi_{g_r,S}(x,x)}
$$
简单来说就是先将 $x,y$ 竞争的部分加回到 $y$，而又由于删去 $x$ 后总体积可能发生变化，因此需要再将归一化系数调整一下，在式子中表现为乘 $(1+\eta_{r,S,x})$.

直觉上来说，距 $x$ 越近的元素与 $x$ 的共享系数理应越大，但这是不成立的，因为 clone 会稀释共享权重，例如下图中 $\boldsymbol{y_1}$ 距 $\boldsymbol{x}$ 更近，但由于 $\boldsymbol{y_2}$ 的稀释，它与 $\boldsymbol{x}$ 的共享系数小于更远的 $\boldsymbol{z}$.

{{< figure src="/images/40c1f6f/img2.svg" title="共享权重的稀释" width="50%">}}

但我们其实可以得到一个更几何的单调性：

{{< admonition lemma "LEMMA 3 (SHARING DOMINATION)" true>}}
若 $S \subseteq \mathbb R^n$ 是有限集且互异元素 $x,y,z \in S$ 满足
$$
B_r(x) \cap B_r(z) \subseteq B_r(x) \cap B_r(y)
$$
那么总有
$$
\chi_{g_r,S}(x,y) \ge \chi_{g_r,S}(x,z)
$$
{{< /admonition >}}

这些内容是对固定的半径 $r$ 来讲的，事实上，将半径从 $0$ 到 $\alpha$ 积分就可以得到一个欧氏空间上的更一般形式. 若 $\nu$ 是 $[0,\alpha]$ 上的概率密度函数，定义
$$
f_\nu(S)(x)=\int_0^\alpha \nu(r) g_r(S)(x) \d r
$$
于是共享系数 $\chi_{g_r}$ 可以自然地扩展到 $\chi_{f_\nu}$：

{{< admonition definition "DEFINITION 4 (SHARING COEFFICIENT OF $f_\nu$)" true >}}
$$
\begin{aligned}
\chi_{f_\nu, S}(x,y):=\int_0^\alpha \nu(r) \chi_{g_r,S}(x,y) \d r\\
\chi_{f_\nu,S}(x,x):=\int_0^\alpha \nu(r)\chi_{g_r,S}(x,x)\d r
\end{aligned}
$$
{{< /admonition >}}

注意此时归一化系数的调整项 $\eta_{r,S,x}$ 对于不同的半径 $r$ 是不同的，因此删除 $x$ 对 $y$ 的影响是
$$
f_\nu(S-\{x\})(y)=f_\nu(S)(y)+\chi_{f_\nu,S}(x,y)+\int_0^\alpha \nu(r) \eta_{r,S,x}\big( g_r(S)(y)+\chi_{g_r,S}(x,y) \big) \d r
$$

既然这篇文章中的欧氏构造天然可以解释权重的共享，那么我们新的 graph-based weighting function 能不能有类似的共享系数定义？

### Sharing Coefficient for Graph Weighting Functions

这一小节尝试将上一小节中 $g_r$ 和 $f_\nu$ 的共享系数定义迁移到 clone-robust graph weighting function 上，这会对 $w$ 提出额外的要求：
- 从 $w$ 中删去一点 $x$ 后，与之不相邻的点的权重应当以相同的比例增加.
- 共享系数应当非负，也就是说删除 $x$ 后 $y$ 的权重不会减少.
- 共享系数应当是对称函数，即 $\chi_{w,G}(x,y)=\chi_{w,G}(y,x)$.
- 仿照 $\chi_{g_r}$，若 $y$ 与 $x$ 的共享范围包含 $z$ 与 $x$ 的共享范围，那么前者的共享系数应当不小于后者.

这分别对应了接下来的四个公理，下面我们逐一展示.

根据 locality 的要求，删除 clone 的影响应局限在邻域内，因此两个不相邻的点之间共享系数理应为 $0$，也就是说
$$
\chi_{w,G}(x,y)=0, \qquad \text{if } (x,y) \notin E(G)
$$
而若两点之间有边，衡量它们之间的共享系数就应该通过删除其中一个点来衡量另一个点的权重变化，但是由于删除点 $x$ 后，剩下点的权重必须重新归一化，这迫使 $G-N_G[x]$ 中点的权重也会发生变化，因此我们需要引入假设

{{% admonition axiom "AXIOM 1 (MULTIPLICATIVE RESCALING)" true %}}
若对任意有限图 $G$ 和点 $x \in V(G)$ 均存在 $\eta_{G,x} \ge 0$ 使得对于任意 $y \in V(G)-N_G[x]$ 都有
$$
w(G-\{x\})(y) = w(G)(y) \cdot (1+\eta_{G,x})
$$ 
则称 $w$ 满足 **multiplicative rescaling**.

此时删去一个连通分量 $C$ 对剩下点的权重的影响也都是乘同一个归一化系数[^3]，
$$
w(G-C)(y)=\frac{w(G)(y)}{1-\sum_{x \in C}w(G)(x)}=w(G)(y) \cdot (1+\eta_{G,C}), \qquad \text{where } y \in G - C
$$
[^3]: 下面第一个等号右侧在原文中分母为 $\sum_{x \in C}w(G)(x)$，是一个笔误.
{{% /admonition %}}

当 $w$ 满足公理 1 时，我们就可以定义 $w$ 的共享系数 $\chi_{w,G}$.

{{< admonition definition "DEFINITION 5 (SHARING COEFFICIENT FOR GRAPH WEIGHTING FUNCTIONS)" true >}}
设 $w$ 是满足公理 1 的 graph weighting function，$G \in \mathcal G$ 是一个有限图，$x \ne y \in V(G)$ 是图中的两个点，定义 $x,y$ 的 *vertex-based sharing coefficient* 为
$$
\chi_{w,G}(x,y):=\frac{w(G-\{x\})(y)}{1+\eta_{G,x}}-w(G)(y)
$$
其中 $\eta_{G,x} \ge 0$ 定义为
$$
\eta_{G,x}=\begin{cases}
\frac{w(G-\{x\})(z)}{w(G)(z)}-1, & \text{if there exists } z \in V(G)-N_G[x],\\
0, & \text{otherwise}
\end{cases}
$$

在这个定义下，若 $(x,y) \notin E(G)$，则自然地有 $\chi_{w,G}(x,y)=0$.
{{< /admonition >}}

如果 $x$ 和 $y$ 真的共享权重，那么删除 $x$ 后 $y$ 应该拿回一部分权重，因此 $\chi_{w,G}(x,y)$ 应当为正数，将该性质视作公理 2：

{{< admonition axiom "AXIOM 2 (NON-NEGATIVE VERTEX SHARING)" true >}}
设 $w$ 是符合公理 1 的 clone-robust graph weighting function，且对于任意有限图 $G\in \mathcal G$ 和其中两个点 $x,y \in V(G)$，若 $\chi_{w,G}(x,y) \ge 0$ 恒成立，或等价地写作
$$
w(G-\{x\})(y) \ge w(G)(y) \cdot (1+\eta_{G,x})
$$
那么就称 $w$ 满足 *non-negative vertex sharing*.
{{< /admonition >}}

注意到
$$
w(G)(x)-\sum_{y \ne x}\chi_{w,G}(x,y)=\frac{\eta_{G,x}}{1+\eta_{G,x}} \ge 0
$$
因此可以定义 $x$ 的 *private weight* 为 
$$
\chi_{w,G}(x,x):=\frac{\eta_{G,x}}{1+\eta_{G,x}}
$$
于是就有和上一节 $\chi_{g_r}$ 类似的可加性
$$
w(G)(x)=\chi_{w,G}(x,x)+\sum_{y \ne x} \chi_{w,G}(x,y)
$$

共享系数理应对称，将这个要求视作公理 3：

{{< admonition axiom "AXIOM 3 (SHARING SYMMETRY)" true >}}
clone-robust graph weighting function $w$ 若对于任意有限图 $G \in \mathcal G$ 和其中任意两个点 $x,y \in V(G)$ 都有 $\chi_{w,G}(x ,y)=\chi_{w,G}(y,x)$，那么就称 $w$ 满足 *sharing symmetry*.
上式可以等价地化为
$$
\frac{w(G-\{x\})(y)}{1+\eta_{G,x}}-\frac{w(G-\{y\})(x)}{1+\eta_{G,y}}=w(G)(y)-w(G)(x)
$$
{{< /admonition >}}

最后，仿照 $g_r$ 的共享系数定义，若 $y$ 与 $x$ 的共享范围包含 $z$ 与 $x$ 的共享范围，那么前者的共享系数应当不小于后者，将这个要求视作公理 4：

{{< admonition axiom "AXIOM 4 (SHARING DOMINATION)" true >}}
设 $w$ 是满足公理 1 的 clone-robust graph weighting function，如果对于任意有限图 $G \in \mathcal G$ 和其中任意三个点 $x,y,z \in V(G)$ 满足 $N_G[x] \cap N_G[z] \subseteq N_G[x] \cap N_G[y]$，则 $\chi_{w,G}(x,y) \ge \chi_{w,G}(x,z)$ 恒成立，那么就称 $w$ 满足 *sharing domination*.
上式可以等价地写作
$$
w(G-\{x\})(y)-w(G-\{x\})(z) \ge \big( w(G)(y)-w(G)(z) \big) \cdot (1+\eta_{G,x})
$$
{{< /admonition >}}

需要满足的公理已经列出，现在剩下的唯一问题就是找到满足这些公理的 graph weighting function. 令人沮丧的是本文尚未找到这样的函数，在这一小节的末尾，我们尝试验证 $w^{\text{CU}}$ 是否满足这些公理.

{{< figure src="/images/40c1f6f/img3.svg" title="$w^{\text{CU}}$ 的共享系数示意图" width="30%" >}}

在上图中，删去 $a$ 会导致剩下的三个点成为新等价类，从而 $w^{\text{CU}}(G-\{a\})(c)=\frac{1}{3}$，因此 $1+\eta_{G,a}=\frac{w^{\text{CU}}(G-\{a\})(c)}{w^{\text{CU}}(G)(c)}=2$，据此得到 
$$
\chi_{w^{\text{CU}},G}(a,b)=\frac{w^{\text{CU}}(G-\{a\})(b)}{1+\eta_{G,a}}-w^{\text{CU}}(G)(b)=\frac{1}{6}-\frac{1}{3}=-\frac{1}{6}
$$

非常遗憾，$w^{\text{CU}}$ 不满足公理 2. 进一步地，$\chi_{w^{\text{CU}},G}(b,a)=\frac{1}{2}-\frac{1}{3}=\frac{1}{6} \ne \chi_{w^{\text{CU}},G}(a,b)$，这表明 $w^{\text{CU}}$ 也不满足公理 3.

回顾 $w^{\text{CU}}$ 失败的原因，主要问题在于删去某个点后可能会导致其邻居的等价类发生改变，这会进一步影响距离为 $2$ 的点所在等价类，这一现象告诉我们依据等价类分配权重的函数难以满足公理 2 和 3，为了克服这一困难，需要设计基于邻域而非等价类的权重函数.

### Constructions based on Maximal Clique Covers

本节把视角转换到极大团上：给每个极大团均匀分配权重，极大团内再次均匀分配. 形式化地，设 $\mathcal K(G)$ 表示图 $G$ 的所有极大团构成的集合，则
$$
w^{\text{MCCA}}(G)(x)=\frac{1}{|\mathcal K(G)|} \sum_{K \in \mathcal K(G)} \frac{\big[x \in K\big]}{|K|}
$$
这样的均匀分配可能还是有些粗糙，某个点可能同时存在于很多极大团中导致其权重异常高. 设 $c(v)=|\{K \in \mathcal K(G): v \in K\}|$ 表示包含点 $v$ 的极大团数量，每次只向 $v$ 分配 $\frac{1}{c(v)}$ 的权重，那么就得到另一函数
$$
w^{\text{MCCP}}(G)(v)=\frac{1}{|\mathcal K(G)|} \sum_{K \in \mathcal K(G)} \frac{\big[v \in K\big]}{c(v) \cdot P_K}
$$
其中 $P_K:=\sum_{v \in K} \frac{1}{c(v)}$ 表示极大团 $K$ 中所有点的比例和，这样做保证了 $\sum_v w^{\text{MCCP}}(G)(v)=1$.

这两个函数是否满足前面列出的四条公理呢？很遗憾，$w^{\text{MCCA}}$ 和 $w^{\text{MCCP}}$ 都不满足公理 2. 这表明基于极大团的构造也难以满足我们对于共享系数的要求. 只需要验证先前用来测试 $w^{\text{CU}}$ 的那张图就可以得出这一遗憾的结果. $w^{\text{MCCA}}$ 的失败是因为点 $b$ 在多个极大团里分配到了过高的权重，$w^{\text{MCCP}}$ 虽然缓解了这一问题但仍未解决.

有没有可能让每个点仅存在于一个团中呢？我们改用 *clique-partitions* 而非 *maximal clique cover* 是否可行？但问题是 clique-partition 有很多种，为了保持 symmetry，我们必须在这些 clique-partition 中做某种对称随机化，朴素的随机顺序方法最终又会退化到类似于 $w^{\text{MCCP}}$ 的形式.

### A Neighborhood-Based Maximum Entropy Principle

给图上结点赋权本质上是在选择一个概率分布，如果没有额外信息，经典原则是选择 Shannon entropy 最大的分布，也就是均匀分布，但这没有考虑图结构，也没有考虑 locality 的要求. 一个简单的想法是把等价类作为基本单元，设 $\mathcal E(G)$ 是图 $G$ 的等价类划分，对每个等价类 $E \in \mathcal E(G)$ 聚合概率
$$
p_E:=\sum_{x \in E} \pi(x)
$$
之后定义 class-Shannon entropy $H_G^E$ 为概率分布 $p_E$ 的 Shannon entropy:
$$
H_G^E(\pi)=-\sum_{E \in \mathcal E(G)} p_E \log_2(p_E)
$$
最大化 class-Shannon entropy 就得到了 $w^{\text{CU}}$，这是在之前就尝试过的构造. 为了避免等价类，我们借鉴 [[Posner and Rodemich, 1972]](https://projecteuclid.org/ebooks/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Sixth-Berkeley-Symposium-on-Mathematical-Statistics-and/chapter/Epsilon-entropy-of-probability-distributions/bsmsp/1200514364) 的想法. 这里的 idea 是：我们不要求精确知道落在哪个点，只要求知道它落在哪个直径不超过 $\epsilon$ 的小块里，而在图里直径小于 $\epsilon$ 对应 $G_\epsilon$ 中的团.

具体地，设 $S \subseteq M$ 是有限集，$(S,\Sigma)$ 是离散 $\sigma$-代数，其中 $\Sigma=2^S$. $\mu:\Sigma\mapsto [0,1]$ 是离散概率测度. 对于 $\epsilon > 0$，设 $\mathcal A_\epsilon(S)$ 表示 $S$ 的所有直径不超过 $\epsilon$ 的划分构成的集合，换句话说，$S$ 的划分 $U=\{U_i\}_{i \in I} \in \mathcal A_\epsilon(S)$ 当且仅当 $\operatorname{diam}(U_i) =\max_{x,y \in U_i}d(x,y) \le \epsilon$ 对所有 $i \in I$ 成立.

此时划分 $U=\{U_i\}_{i \in I} \in \mathcal A_\epsilon(S)$ 的熵被定义为
$$
H(U,\mu) :=-\sum_{i \in I}p_i\log_2 p_i,\qquad \text{where } p_i=\mu(U_i)
$$
其中 $p_i=\mu(U_i)$ 表示从所有点中按照分布 $\mu$ 随机抽取出的元素在集合 $U_i$ 中的概率. 当我们允许把两两之间距离不超过 $\epsilon$ 的点合并，描述结果所需的最少信息量为
$$
H_\epsilon(\mu):=\min_{U \in \mathcal A_\epsilon(S)} H(U,\mu)
$$

迁移到图上，两两之间距离不超过 $\epsilon$ 对应了 $G_\epsilon$ 中的团，设 $G=(V,E)$ 是一个有限图，$\pi:V \mapsto [0,1]$ 是一个概率分布，设 $G$ 中的团划分构成集合 $\mathcal C(G)$，那么定义 graph entropy 为
$$
H_G(\pi):=\min_{U \in \mathcal C(G)} H(U,\pi)
$$
基于最大熵原则，我们要选取一个概率分布 $\pi$ 使得上述熵最大化，定义集合 
$$
\Delta^h(G):=\arg\max_{\pi \in \Delta(V)} H_G(\pi)
$$
是能使熵最大化的分布构成的集合. 这样表述的定义其实隐含了一个性质：能使熵最大化的概率分布不唯一. 例如只有两个点与连接它们的边构成的图中，任意分布都是最大熵分布，理论上来讲，我们希望概率分布是对称的，但是这个例子中分布却可以是不对称的. 事实上集合 $\Delta^h(G)$ 本身有一定的对称性.

{{< admonition lemma "LEMMA 4" true >}}
集合 $\Delta^h(G)$ 是对称的，也就是说，对任意图同构 $\sigma:V\mapsto V$ 和概率分布 $\pi \in \Delta^h(G)$，总有 $\pi \circ \sigma \in \Delta^h(G)$，并且在等价类内重新分配概率后的分布仍然在 $\Delta^h(G)$ 中，并且在保持各等价类概率之和不变的情况下添加新结点同样可行.
{{< /admonition >}}

那么如何从 $\Delta^h(G)$ 中选出那个我们想要的对称的概率分布呢？一个直观的想法是再从中最大化普通 Shannon entropy，但这样是不可行的，普通 Shannon entropy 对等价类内的 clone 数量敏感，它倾向于给 clone 数多的等价类更多权重，这会破坏 locality. 最终作者改用了先前提出的 class-Shannon entropy，最后再用 ordinary Shannon entropy 作为很弱的第二层 tie-breaker.

最终定义 clone-robust entropy-maximizing graph weighting function 为
$$
h:(V,E)\in \mathcal G \mapsto \arg\max_{\pi \in \Delta^h(G)} \lim_{\delta \to 0}H_G^E(\pi)+\delta H(\pi)
$$
这里的 $\delta H(\pi)$ 应理解为无穷小 tie-breaker：先最大化 $H_G^E$，若仍不唯一再最大化 ordinary Shannon entropy。

这个构造在理论上很漂亮，但确实难以计算. 对给定的分布 $\pi$ 计算 $H_G(\pi)$ 已经是 NP-hard，更别说还要在 $\Delta^h(G)$ 中最大化 $H_G^E(\pi)$ 了. 这样的构造能否满足四条公理？不知道. 它确实倾向于惩罚那些容易被覆盖的点，因此它解决了我们先前给出的例子，但它的问题在于删除一个点后最优的 clique partition 可能发生跳变，我们没有理论保证它始终满足公理 2.

## Conclusion

我们在本文中引入了 clone-robust graph weighting function 的概念，并证明了它可以给出任意伪度量下的 clone-robust weighting function. 之后我们提出了四条公理来约束共享系数，最后尝试了几种构造但都未能满足这些公理. 我们有推测
1. 任何基于 maximal clique cover 的构造都无法满足公理 2
2. 即使是 entropy-based rule，也可能存在某个有限图违反了公理 2

未来的工作可能包含
- 证明或反驳这些推测.
- 找到真正满足这些公理的 graph weighting function.
- 系统研究更好的 clone-resistant graph entropy，不局限于 clique-based formulations.
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
  - 最优化
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
其中 $\boldsymbol{x}=(x_1,\cdots ,x_n)$ 是问题的变量，$f_0:\mathbb R^n \to \mathbb R$ 是我们想要最小化的目标函数(损失)，$f_i:\mathbb R^n \to \mathbb R$ 是约束函数，常数 $b_i$ 是限制. 称向量 $\boldsymbol{x^*}$ 是最优的，或称其为问题的解，当且仅当对于任意满足 $f_i(\boldsymbol{z}) \le b_i$ 的向量 $\boldsymbol{z}$ 均有 $f_0(\boldsymbol{z}) \ge f_0(\boldsymbol{x^*})$.

当 $f$ 均为线性函数时这就是线性规划问题，否则就是非线性规划. 我们要研究的凸优化就是 $f$ 为凸函数时的最优化问题，凸函数的定义、答案的求解和其它内容均会在之后讲解.

## Convex Sets

在这一章里，我们需要在了解一些基础概念的同时感性理解什么是凸性.

### Affine and convex sets

我们都知道，空间中两点 $\boldsymbol{x_1},\boldsymbol{x_2}$ 能唯一确定一条直线，直线上的点均可表示为 $\theta \boldsymbol{x_1}+(1-\theta)\boldsymbol{x_2}$, $\theta \in \mathbb R$，当参数 $\theta \in [0,1]$ 时表示以 $\boldsymbol{x_1},\boldsymbol{x_2}$ 为端点的线段上的点.

{{< figure src="/images/c37d08d/img1.svg" title="$\boldsymbol{x_1}$ 与 $\boldsymbol{x_2}$ 确定的直线" >}}

#### Affine

集合 $C \subseteq \mathbb R^n$ 是**仿射集(affine set)** 当且仅当对于任意 $\boldsymbol{x_1} \ne \boldsymbol{x_2} \in C$ 和 $\theta \in \mathbb R$ 均有 $\theta \boldsymbol{x_1} + (1-\theta)\boldsymbol{x_2} \in C$. 通俗地讲，$C$ 中任意两点所在直线上的点均在 $C$ 中. 这个定义可以扩展到有限个变量的和 $\theta_1 \boldsymbol{x_1} + \cdots \theta_k \boldsymbol{x_k} \in C$，其中 $\theta_1 + \cdots + \theta_k = 1$，若 $C$ 是仿射集，我们也称 $C$ 是仿射的. 值得说明的是，这样的系数和为 $1$ 的线性组合也叫 **仿射组合(affine combination)**.

若 $C$ 是一个仿射集，那么将其平移至经过原点后的集合是一个子空间，形式化地，设 $C$ 是一个仿射集且 $\boldsymbol{x_0} \in C$，则
$$
V=C-\boldsymbol{x_0}=\{\boldsymbol{x}-\boldsymbol{x_0}:\boldsymbol{x} \in C\}
$$
是子空间. 证明考虑 $\alpha \boldsymbol{v_1}+\beta \boldsymbol{v_2}+\boldsymbol{x_0}=\alpha(\boldsymbol{v_1}+\boldsymbol{x_0})+\beta(\boldsymbol{v_2}+\boldsymbol{x_0})+(1-\alpha-\beta)\boldsymbol{x_0} \in C$.

{{< admonition example "EXAMPLE" true >}}
线性方程组 $\boldsymbol{A}\boldsymbol{x}=\boldsymbol{b}$ 的解集是仿射集. 这是因为 $\boldsymbol{A}(\theta\boldsymbol{x_1}+(1-\theta)\boldsymbol{x_2})=\theta\boldsymbol{A}\boldsymbol{x_1}+(1-\theta)\boldsymbol{A}\boldsymbol{x_2}=\boldsymbol{b}$. 更进一步还可以得到解集 $S$ 对应的子空间 $S-\boldsymbol{x_0}$ 恰为 $\boldsymbol{A}$ 的零空间，并且任意仿射集都可以写成某个线性方程组的解集.
{{< /admonition >}}

对于一个集合 $C \subseteq \mathbb R^n$，怎么将其扩充至最小的仿射集 $\aff C$？只需将 $C$ 中元素的所有仿射组合加入集合即可，也就是
$$
\aff C = \{\theta_1\boldsymbol{x_1}+\cdots +\theta_k\boldsymbol{x_k} : \boldsymbol{x_i} \in C,\theta_1 + \cdots + \theta_k = 1\}
$$
$\aff C$ 也叫做 $C$ 的**仿射包(affine hull)**，满足对于任意仿射集 $S$，若 $C \subseteq S$ 则必有 $\aff C \subseteq S$.

接下来定义仿射维度与相对内部的概念，集合 $C \subseteq \mathbb R^n$ 的**仿射维度(affine dimension)** 被定义为 $\aff C$ 的维度，其**相对内部(relative interior)** 被定义为集合 $C$ 相对于 $\aff C$ 的内部，记作
$$
\relint C = \{\boldsymbol{x} \in C : B(\boldsymbol{x},r) \cap \aff C \subseteq C \text{ for some } r > 0\}
$$
其中 $B(\boldsymbol{x},r)=\{ \boldsymbol{y}: \|\boldsymbol{y}-\boldsymbol{x}\| \le r \}$ 是以 $\boldsymbol{x}$ 为球心，$r$ 为半径的球.

类似地可以定义**相对边界(relative boundary)** 为 $\cl C - \relint C$，其中 $\cl C$ 为 $C$ 的闭包，即把所有可以由 $C$ 中点逼近的点也加进集合的结果.

{{< admonition example "EXAMPLE" true >}}
考虑 $\mathbb R^3$ 中的一个矩形 $C=\{\boldsymbol{x} \in \mathbb R^3 : -1 \le x_1,x_2 \le 1, x_3 = 0\}$，其仿射包为整个 $(x_1,x_2)$-平面 $\{\boldsymbol{x} \in \mathbb R^3:x_3=0\}$，$C$ 的内部为空集但相对内部为
$$
\relint C = \{\boldsymbol{x} \in \mathbb R^3:-1 < x_1,x_2 < 1, x_3 = 0\}
$$
$C$ 的边界就是其本身，但其相对边界为 $\{\boldsymbol{x}\in\mathbb R^3:\max\{|x_1|,|x_2|\}=1,x_3=0\}$.
{{< /admonition >}}

#### convex

凸集和仿射集的定义类似，仿射集要求整条直线在集合中而凸集只要求线段在集合中，形式化地，集合 $C$ 是**凸集(convex set)** 当且仅当对于任意 $\boldsymbol{x_1,x_2} \in C,\theta \in [0,1]$ 都有 $\theta\boldsymbol{x_1}+(1-\theta)\boldsymbol{x_2} \in C$. 类似于仿射组合，定义 $\theta_1\boldsymbol{x_1}+\cdots + \theta_k\boldsymbol{x_k}$ 满足 $\theta_1 + \cdots \theta_k = 1$ 且 $\theta_i \ge 0$ 为点 $\boldsymbol{x_1},\cdots \boldsymbol{x_k}$ 的一个**凸组合(convex combination)** . 集合 $C$ 的**凸包(convex hull)** 为 $C$ 中元素的所有凸组合构成的集合，记作
$$
\conv C = \{\theta_1\boldsymbol{x_1} + \cdots + \theta_k \boldsymbol{x_k}:\boldsymbol{x_i} \in C,\ \theta_i \ge 0,\ \theta_1 + \cdots + \theta_k = 1\}
$$
显然，凸包必然是凸集，并且是包含 $C$ 的最小凸集，下图展示了一个凸包的示例.

{{< figure src="/images/c37d08d/img2.svg" title="凸包示例" >}} 

事实上，凸组合的表述可以扩展到无穷项求和、积分形式、概率分布. 设 $\theta_i \ge 0$ 且 $\sum_{i=1}^{\infty} \theta_i = 1$，$C \subseteq \mathbb R^n$ 是凸集且 $\boldsymbol{x_i} \in C$，那么只要 $\sum \theta_i\boldsymbol{x_i}$ 收敛就必有 $\sum \theta_i \boldsymbol{x_i} \in C$. 更一般地，若 $p:\mathbb R^n \to \mathbb R$ 且 $\forall \boldsymbol{x} \in C$，$p(\boldsymbol{x}) \ge 0$ 且 $\int_C p(\boldsymbol{x}) \d \boldsymbol{x}=1$，则必有 $\int_C p(\boldsymbol{x})\boldsymbol{x}\d \boldsymbol{x} \in C$，如果积分存在.

最一般的表述是概率形式，将 $\boldsymbol{x}$ 视作随机向量，$\mathbb P(\boldsymbol{x} \in C)=1$，则必然有 $\mathbb E[\boldsymbol x] \in C$.

#### cone

集合 $C \subseteq \mathbb R^n$ 是**锥(cone)** 或**非负齐次(集)(nonnegative homogeneous)** 当且仅当 $\forall \boldsymbol{x} \in C,\theta \ge 0$ 都有 $\theta \boldsymbol{x} \in C$. 若 $C$ 既是凸集又是锥，那么称 $C$ 为**凸锥(convex cone)**. 形如 $\theta_1 \boldsymbol{x_1} + \cdots +\theta_k\boldsymbol{x_k}$，$\theta_i \ge 0$ 的组合叫做**锥组合(conic combination)** 或非负线性组合，显然 $C$ 是凸锥当且仅当它包含自身元素的所有锥组合，类似定义集合 $C$ 的**锥包(conic hull)** 为 $\{\theta_1\boldsymbol{x_1}+\cdots + \theta_k\boldsymbol{x_k}:\boldsymbol{x_i} \in C,\theta_i \ge 0\}$.

### Some important examples
#### Hyperplanes and halfspaces

$\mathbb R^n$ 中的**超平面(hyperplane)** 指的是，给出法向量 $\boldsymbol{a} \ne \boldsymbol{0}$ 和一个超平面上的点 $\boldsymbol{x_0}$ 后，该超平面就可以被表示为
$$
\{\boldsymbol{x}:\boldsymbol{a}^T(\boldsymbol{x}-\boldsymbol{x_0})=0\}=\{\boldsymbol{x}:\boldsymbol{a}^T\boldsymbol{x}=b\}, \quad \text{where } b=\boldsymbol{a}^T\boldsymbol{x_0}
$$

它将空间划分为两个**半空间(halfspace)**，$\mathbb R^3$ 上的超平面就是我们熟知的平面，$\mathbb R^2$ 上的超平面实际上是直线. (闭)半空间有形式
$$
\{\boldsymbol{x}:\boldsymbol{a}^T\boldsymbol{x}\le b\}
$$
其中 $\boldsymbol{a} \ne \boldsymbol{0}$，相应地有开半空间 $\{\boldsymbol{x}:\boldsymbol{a}^T\boldsymbol{x} < b\}$.

#### Euclidean balls and ellipsoids

$\mathbb R^n$ 中的**欧氏球(Euclidean ball)**(或简称球)有形式
$$
B(\boldsymbol{x_c},r)=\{\boldsymbol{x}:\|\boldsymbol{x}-\boldsymbol{x_c}\|_2 \le r\}
$$
表示以 $\boldsymbol{x_c}$ 为球心，$r$ 为半径的球，另一常见表述为 $\{\boldsymbol{x_c}+r\boldsymbol{u}:\|\boldsymbol{u}\|_2 \le 1\}$. 根据 L2 范数的三角形不等式容易证明球是凸集.

和球类似的还有椭球，其形式为 $\{\boldsymbol{x_c}+\boldsymbol{A}\boldsymbol{u}:\|\boldsymbol{u}\|_2 \le 1\}$，其中可逆矩阵 $\boldsymbol{A}$ 对向量 $\boldsymbol{u}$ 做了一个仿射变换，稍加推导可以得出形式
$$
\{\boldsymbol{x}:(\boldsymbol{x}-\boldsymbol{x_c}^T)\boldsymbol{P}^{-1}(\boldsymbol{x}-\boldsymbol{x_c}) \le 1\}
$$
其中 $\boldsymbol{P}=\boldsymbol{A}\boldsymbol{A}^T$ 为正定矩阵，$\sqrt{\lambda_i}$ 是椭球的每个半轴被拉伸的倍率，其中 $\lambda_i$ 表示 $\boldsymbol{P}$ 的特征值，当 $\boldsymbol{P}=r^2\boldsymbol{I}$ 时椭球退化为半径为 $r$ 的球.

#### Norm balls and norm cones

在 $\mathbb R^n$ 上的任一范数都可以导出对应的**范数球(norm ball)**，球心为 $\boldsymbol{x_c}$，半径为 $r$ 的范数球定义为 $\{\boldsymbol{x}:\|\boldsymbol{x}-\boldsymbol{x_c}\| \le r\}$，类似地可以定义**范数锥(norm cone)** 为 $\{(\boldsymbol{x},t):\|\boldsymbol{x}\| \le t\} \subseteq \mathbb R^{n+1}$.

{{< admonition example "EXAMPLE" true >}}
*The second-order cone* 是欧几里得范数下的范数锥，也就是 
$$
C=\{(\boldsymbol{x},t) \in \mathbb R^{n + 1}:\|\boldsymbol{x}\|_2 \le t \}
$$
它也被叫做 *quadratic cone*、*Lorentz cone* 或 *ice-cream cone*.
{{< /admonition >}}

#### Polyhedra

**多面体(polyhedron)** 是有限个线性等式与不等式的解集，也就是
$$
\mathcal P = \{\boldsymbol{x}:\boldsymbol{A}\boldsymbol{x} \le \boldsymbol{b}, \boldsymbol{C}\boldsymbol{x}=\boldsymbol{d}\}
$$
其中 $\le$ 表示逐个元素的不等号均成立，换句话说就是 $\boldsymbol{A} \le \boldsymbol{B}$ 当且仅当 $A_{i,j} \le B_{i,j}$ 恒成立.

事实上，等式约束总可以拆分为两个不等式约束，$\boldsymbol{C}\boldsymbol{x} = \boldsymbol{d} \Longleftrightarrow \boldsymbol{C}\boldsymbol{x} \le d \wedge -\boldsymbol{C}\boldsymbol{x} \le -\boldsymbol{d}$，但为了表述清楚，定义中还是将其做了区分.

根据定义可以明显看出，多面体总是有限个半空间和超平面的交，而有限个凸集的交仍然是凸集，因此多面体总是凸集.

**单纯形(simplex)** 是 $\mathbb R^n$ 中的一个特殊多面体. 先在 $\mathbb R^n$ 中取 $k+1$ 个仿射无关的点 $\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}$，那么这些点构成的凸包 $\conv \{\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}\}$ 就是一个 $k$ 维单纯形. 仿射无关的意思是这些点不在同一个超平面上，也就是说不存在 $\theta_0, \ldots, \theta_k$ 满足 $\theta_0 + \cdots + \theta_k = 0$ 且 $\theta_0\boldsymbol{v_0} + \cdots + \theta_k\boldsymbol{v_k} = \boldsymbol{0}$，这等价于 $\boldsymbol{v_1}-\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}-\boldsymbol{v_0}$ 线性无关.

{{< admonition example "EXAMPLE" true >}}
一维单纯形就是线段，二维单纯形是三角形，三维单纯形是四面体. $n$ 维单纯形的一个特殊例子是**标准单纯形(standard simplex)**，它由 $\mathbb R^n$ 中的 $n+1$ 个点 $\boldsymbol{e_0}=\boldsymbol{0},\boldsymbol{e_1},\cdots,\boldsymbol{e_n}$ 构成，其中 $\boldsymbol{e_i}$ 是标准正交基. 标准单纯形的凸包就是 $\{\boldsymbol{x} \in \mathbb R^n: x_i \ge 0, \sum_{i=1}^n x_i \le 1\}$.
{{< /admonition >}}

直观上来看，单纯形必然是多面体，下面我们来证明这一点.

{{< admonition proof "PROOF" true >}}
设单纯形 $C=\conv\{\boldsymbol v_0,\ldots,\boldsymbol v_k\}\subseteq \mathbb R^n$，其中 $\boldsymbol v_1-\boldsymbol v_0,\ldots,\boldsymbol v_k-\boldsymbol v_0$ 线性无关. 记
$$
\boldsymbol A=
\begin{pmatrix}
\boldsymbol v_1-\boldsymbol v_0 & \cdots & \boldsymbol v_k-\boldsymbol v_0
\end{pmatrix}
$$
则任意 $\boldsymbol x\in C$ 可以写成 $\boldsymbol x=\boldsymbol v_0+\boldsymbol A\boldsymbol y$，其中 $\boldsymbol y\ge \boldsymbol 0,\boldsymbol 1^T\boldsymbol y\le 1$.

由于 $\boldsymbol A$ 列满秩，$\boldsymbol A^T\boldsymbol A$ 可逆. 令
$$
\boldsymbol L=(\boldsymbol A^T\boldsymbol A)^{-1}\boldsymbol A^T
$$
若 $\boldsymbol x=\boldsymbol v_0+\boldsymbol A\boldsymbol y$，则 $\boldsymbol y=\boldsymbol L(\boldsymbol x-\boldsymbol v_0)$，同时还需有
$$
(\boldsymbol I-\boldsymbol A\boldsymbol L)(\boldsymbol x-\boldsymbol v_0)=\boldsymbol 0,
$$
以保证 $\boldsymbol x-\boldsymbol v_0\in \operatorname{Col}(\boldsymbol A)$. 因此
$$
C=
\left\{
\boldsymbol x\in \mathbb R^n:
\boldsymbol L(\boldsymbol x-\boldsymbol v_0)\ge \boldsymbol 0,\ 
\boldsymbol 1^T\boldsymbol L(\boldsymbol x-\boldsymbol v_0)\le 1,\ 
(\boldsymbol I-\boldsymbol A\boldsymbol L)(\boldsymbol x-\boldsymbol v_0)=\boldsymbol 0
\right\}.
$$
这是由有限个线性不等式和线性等式确定的集合，而线性等式又可以写成两组线性不等式，所以 $C$ 是多面体.
{{< /admonition >}}

#### The positive semidefinite cone

设 $S^n$ 表示所有 $n \times n$ 实对称矩阵构成的集合，$S^n_+$ 表示 $n \times n$ 半正定矩阵构成的集合，$S^n_{++}$ 表示 $n \times n$ 正定矩阵构成的集合，也就是说
$$
\begin{aligned}
&S^n = \{\boldsymbol{X} \in \mathbb R^{n \times n}: \boldsymbol{X}^T = \boldsymbol{X}\}, \\
&S^n_+ = \{\boldsymbol{X} \in S^n: \boldsymbol{x}^T \boldsymbol{X} \boldsymbol{x} \ge 0, \forall \boldsymbol{x} \in \mathbb R^n\}, \\
&S^n_{++} = \{\boldsymbol{X} \in S^n: \boldsymbol{x}^T \boldsymbol{X} \boldsymbol{x} > 0, \forall \boldsymbol{x} \in \mathbb R^n, \boldsymbol{x} \ne 0\}.
\end{aligned}
$$

现在我们想知道这三个集合是不是凸集. 结论为：$S^n_+$ 是凸锥，$S^n_{++}$ 是凸集但不是锥. 证明只需用 
$$
\boldsymbol{x}(\theta_1 \boldsymbol{X_1}+\theta_2 \boldsymbol{X_2})\boldsymbol{x}^T = \theta_1 \boldsymbol{x}^T \boldsymbol{X_1} \boldsymbol{x} + \theta_2 \boldsymbol{x}^T \boldsymbol{X_2} \boldsymbol{x} \ge 0,\quad \text{where } \theta_1,\theta_2 \ge 0
$$
$S^n_{++}$ 不含零矩阵因此不是锥.

### Operations that preserve convexity

这一节我们关注一些保持凸性的运算.

#### Intersection

交运算保持凸性是常用且熟知的结论：如果 $S_1,S_2$ 都是凸集，那么 $S_1 \cap S_2$ 也是凸集. 证明是平凡的，交集中两点连线总是既在 $S_1$ 中又在 $S_2$ 中. 直接的推论为有限个凸集的交仍然为凸集，事实上也同样可以证明任意交，也就是：给定指标集合 $I$ 和凸集 $S_i,\forall i \in I$，则 $\bigcap_{i \in I} S_i$ 也是凸集.

{{< admonition example "EXAMPLE" true >}}
$S^n_+$ 是凸集，因为
$$
S^n_+=\bigcap_{\boldsymbol{z} \ne \boldsymbol{0}} \{\boldsymbol{X} \in S^n: \boldsymbol{z}^T \boldsymbol{X} \boldsymbol{z} \ge 0\}
$$
其中对于给定的 $\boldsymbol{z}$，$\boldsymbol{z}^T\boldsymbol{X}\boldsymbol{z}$ 是一个关于 $\boldsymbol{X}$ 的线性函数，因此 $\{\boldsymbol{X} \in S^n: \boldsymbol{z}^T \boldsymbol{X} \boldsymbol{z} \ge 0\}$ 实际上是一个半空间，半空间是凸集，因此 $S^n_+$ 是凸集.
{{< /admonition >}}

事实上，之后我们将会证明：任意封闭凸集 $S$ 都是一些半空间的交，这些半空间就是所有包含 $S$ 的超平面所对应的半空间.
$$
S=\bigcap \big\{\mathcal H:\mathcal H \text{ halfspace, }S\subseteq \mathcal H\big\}
$$

#### Affine functions

**仿射函数(affine function)** 就是线性函数加上一个偏置，换句话说，$f:\mathbb R^n \mapsto \mathbb R^m$ 是仿射的，当且仅当存在 $\boldsymbol A \in \mathbb R^{m \times n}$ 和 $\boldsymbol b \in \mathbb R^m$，使得
$$
f(\boldsymbol x) = \boldsymbol A \boldsymbol x + \boldsymbol b.
$$

我们将证明：**凸集经过仿射变换后仍是凸集**.

{{< admonition proof "PROOF" true >}}
设 $S$ 是凸集，$f(\boldsymbol{x})=\boldsymbol{A}\boldsymbol{x}+\boldsymbol{b}$ 是仿射函数，下证 $f(S)$ 是凸集.

只需证 $\forall \boldsymbol{x_1},\boldsymbol{x_2} \in S,\theta \ge 0$ 均有 $\theta f(\boldsymbol{x_1}) + (1-\theta) f(\boldsymbol{x_2}) \in f(S)$.

$$
\theta f(\boldsymbol{x_1}) + (1-\theta) f(\boldsymbol{x_2}) = \theta(\boldsymbol{A}\boldsymbol{x_1}+\boldsymbol{b}) + (1-\theta)(\boldsymbol{A}\boldsymbol{x_2}+\boldsymbol{b}) = \boldsymbol{A}(\theta\boldsymbol{x_1} + (1-\theta)\boldsymbol{x_2}) + \boldsymbol{b}
$$
由于 $S$ 是凸集，因此 $\theta \boldsymbol{x_1}+(1-\theta)(\boldsymbol{x_2})\in S$，于是
$$
\theta f(\boldsymbol{x_1}) + (1-\theta) f(\boldsymbol{x_2})=f(\theta \boldsymbol{x_1}+(1-\theta)\boldsymbol{x_2}) \in f(S)
$$
证毕.
{{< /admonition >}}

事实上，凸集经过仿射变换的逆变换后仍是凸集，换句话说，若 $f:\mathbb R^n \to \mathbb R^m$ 是仿射函数，$S \subset \mathbb R^m$ 是凸集，则
$$
f^{-1}(S)=\{\boldsymbol{x} \in \mathbb R^n: f(\boldsymbol{x}) \in S\}
$$
仍然是凸集，证明平凡，此处从略.

{{< admonition example "EXAMPLE" true >}}
若 $S$ 是凸集，则 $\alpha S = \{\alpha \boldsymbol{x} : \boldsymbol{x} \in S\}$ 也是凸集、$S+\boldsymbol{b}=\{ \boldsymbol{x} + \boldsymbol{b} : \boldsymbol{x} \in S \}$ 也是凸集，凸集在某个方向上的投影仍然是凸集，**凸集的和仍然是凸集**.

这里我们解释一下最后一条，两个凸集 $S_1,S_2$ 的和定义为
$$
S_1+S_2=\{\boldsymbol{x_1}+\boldsymbol{x_2}:\boldsymbol{x_1} \in S_1,\boldsymbol{x_2} \in S_2\}
$$
为了证明它是凸集，首先有 $S_1 \times S_2 = \{(\boldsymbol{x_1},\boldsymbol{x_2}):\boldsymbol{x_1}\in S_1,\boldsymbol{x_2}\in S_2\}$ 是凸集，再做保持凸性的仿射变换 $f(\boldsymbol{x_1},\boldsymbol{x_2})=\boldsymbol{x_1}+\boldsymbol{x_2}$ 即可. 事实上，$S_1+S_2$ 也叫做 $S_1$ 和 $S_2$ 的 **Minkowski 和**.
{{< /admonition >}}

{{< admonition example "EXAMPLE" true >}}
线性矩阵不等式(Linear Matrix Inequality, LMI) 的解集是凸集. 设 
$$
A(\boldsymbol{x})=\sum_{i=1}^{n}x_i\boldsymbol{A_i}
$$
其中 $\boldsymbol{A_i} \in S^m$，再设 $\boldsymbol{B} \in S^m$，则 $A(\boldsymbol{x}) \preceq \boldsymbol{B}$ 称作线性矩阵不等式，$A(\boldsymbol{x}) \preceq \boldsymbol{B}$ 的含义是 $\boldsymbol{B}-A(\boldsymbol{x})$ 半正定.

证明考察 $f(\boldsymbol{x}) = \boldsymbol{B} - A(\boldsymbol{x})$，则 $f^{-1}(S^m_+)$ 是凸集，且恰好为该 LMI 的解集.
{{< /admonition >}}

#### Linear-fractional and perspective functions

当我们希望将空间降维，将 $\mathbb R^{n + 1}$ 中的点映到 $\mathbb R^n$ 上时，就需要用到透视函数(perspective function) $P$，它的动机是：当我们处于原点并看向某一方向时，该方向上的点会被投影到同一点上，换句话说 $P(\alpha \boldsymbol{x}) \equiv P(\boldsymbol{x})$ 应当对所有 $\boldsymbol{x}$ 和 $\alpha > 0$ 成立.

不妨将最后一维删去，将所有点投影到 $x_{n+1}=1$ 这个超平面上，根据我们需要的性质，
$$
P\big(\alpha(x_1,\cdots ,x_n, 1)^T\big) = P\big((x_1,\cdots, x_n, 1)^T\big)=(x_1,\cdots, x_n)^T
$$
据此得到 $P(\boldsymbol{x},t)=\dfrac{\boldsymbol{x}}{t}$，要求 $t>0$，这里的两个参数实际上是将需要做变换的向量的前 $n$ 维和最后一维拆开了. 更加正式的定义是
$$
P: \mathbb R^n \times \mathbb R_{++} \mapsto \mathbb R^n, \quad P(\boldsymbol{x}, t) = \frac{\boldsymbol{x}}{t}
$$
可以通过定义证明，线段经过透视函数变换后仍是线段且透视函数是保凸性的，对于任意 $\theta \in [0,1]$，必然存在一个 $\mu \in [0,1]$ 满足
$$
\mu P(\boldsymbol{x_1}) + (1-\mu) P(\boldsymbol{x_2}) = P(\theta \boldsymbol{x_1} + (1-\theta) \boldsymbol{x_2})
$$
这里不再展开. 仿射函数的逆也是保凸性的，透视函数有没有类似的性质呢？答案是肯定的. 任意凸集的反透视映射仍然是凸集，换句话说，当 $C$ 是凸集时
$$
P^{-1}(C)=\big\{ (\boldsymbol{x},t) : \frac{\boldsymbol{x}}{t} \in C, t > 0 \big\}
$$
也是凸集.

仿射映射和透视映射的复合叫做**线性分数函数(linear-fractional functions)** ，更正式地，若 $g:\mathbb R^n \mapsto \mathbb R^{m+1}$ 是仿射函数，
$$
g(\boldsymbol{x}):=\begin{pmatrix}
\boldsymbol{A}\\
\boldsymbol{c}^T
\end{pmatrix}\boldsymbol{x}+\begin{pmatrix}
\boldsymbol{b}\\
d
\end{pmatrix}
$$
则 $f=P \circ g:\mathbb R^n \mapsto \mathbb R^m$ 为线性分数函数，定义为
$$
f(\boldsymbol{x})=\frac{\boldsymbol{A}\boldsymbol{x}+\boldsymbol{b}}{\boldsymbol{c}^T\boldsymbol{x}+d},\quad \boldsymbol{\operatorname{dom}}\ f = \{\boldsymbol{x}:\boldsymbol{c}^T\boldsymbol{x}+d > 0\}
$$

由于 $f$ 是保凸变换的复合，因此 $f$ 同样是保持凸性的，并且逆变换同样保凸.

### Generalized inequalities


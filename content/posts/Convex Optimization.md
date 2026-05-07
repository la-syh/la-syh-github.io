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

## Convex sets

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
\mathcal P = \{\boldsymbol{x}:\boldsymbol{A}\boldsymbol{x} \preceq \boldsymbol{b}, \boldsymbol{C}\boldsymbol{x}=\boldsymbol{d}\}
$$
其中向量之间的 $\preceq$ 表示逐元素的不等号均成立，换句话说就是 $\boldsymbol{u} \preceq \boldsymbol{v}$ 当且仅当 $u_{i} \le v_{i}$ 对所有 $i$ 均成立.

事实上，等式约束总可以拆分为两个不等式约束，$\boldsymbol{C}\boldsymbol{x} = \boldsymbol{d} \Longleftrightarrow \boldsymbol{C}\boldsymbol{x} \preceq \boldsymbol{d} \wedge -\boldsymbol{C}\boldsymbol{x} \preceq -\boldsymbol{d}$，但为了表述清楚，定义中还是将其做了区分.

根据定义可以明显看出，多面体总是有限个半空间和超平面的交，而有限个凸集的交仍然是凸集，因此多面体总是凸集.

**单纯形(simplex)** 是 $\mathbb R^n$ 中的一个特殊多面体. 先在 $\mathbb R^n$ 中取 $k+1$ 个仿射无关的点 $\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}$，那么这些点构成的凸包 $\conv \{\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}\}$ 就是一个 $k$ 维单纯形. 仿射无关的意思是这些点不在同一个超平面上，也就是说不存在 $\theta_0, \ldots, \theta_k$ 满足 $\theta_0 + \cdots + \theta_k = 0$ 且 $\theta_0\boldsymbol{v_0} + \cdots + \theta_k\boldsymbol{v_k} = \boldsymbol{0}$，这等价于 $\boldsymbol{v_1}-\boldsymbol{v_0}, \ldots, \boldsymbol{v_k}-\boldsymbol{v_0}$ 线性无关.

{{< admonition example "EXAMPLE" true >}}
一维单纯形就是线段，二维单纯形是三角形，三维单纯形是四面体. $n$ 维单纯形的一个特殊例子是**标准单纯形(standard simplex)**，它由 $\mathbb R^n$ 中的 $n+1$ 个点 $\boldsymbol{e_0}=\boldsymbol{0},\boldsymbol{e_1},\cdots,\boldsymbol{e_n}$ 构成，其中 $\boldsymbol{e_i}$ 是标准正交基. 标准单纯形的凸包就是 $\{\boldsymbol{x} \in \mathbb R^n: x_i \ge 0, \sum_{i=1}^n x_i \le 1\}$.
{{< /admonition >}}

直观上来看，单纯形必然是多面体，下面我们来证明这一点.

{{< details "PROOF" >}}
设单纯形 $C=\conv\{\boldsymbol v_0,\ldots,\boldsymbol v_k\}\subseteq \mathbb R^n$，其中 $\boldsymbol v_1-\boldsymbol v_0,\ldots,\boldsymbol v_k-\boldsymbol v_0$ 线性无关. 记
$$
\boldsymbol A=
\begin{pmatrix}
\boldsymbol v_1-\boldsymbol v_0 & \cdots & \boldsymbol v_k-\boldsymbol v_0
\end{pmatrix}
$$
则任意 $\boldsymbol x\in C$ 可以写成 $\boldsymbol x=\boldsymbol v_0+\boldsymbol A\boldsymbol y$，其中 $\boldsymbol y\succeq \boldsymbol 0,\boldsymbol 1^T\boldsymbol y\le 1$.

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
\boldsymbol L(\boldsymbol x-\boldsymbol v_0)\succeq \boldsymbol 0,\ 
\boldsymbol 1^T\boldsymbol L(\boldsymbol x-\boldsymbol v_0)\le 1,\ 
(\boldsymbol I-\boldsymbol A\boldsymbol L)(\boldsymbol x-\boldsymbol v_0)=\boldsymbol 0
\right\}.
$$
这是由有限个线性不等式和线性等式确定的集合，所以 $C$ 是多面体，证毕.
{{< /details >}}

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

{{< details "PROOF" >}}
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
{{< /details >}}

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
其中 $\boldsymbol{A_i} \in S^m$，再设 $\boldsymbol{B} \in S^m$，则 $A(\boldsymbol{x}) \preceq \boldsymbol{B}$ 称作线性矩阵不等式. 这里对称矩阵之间的 $\preceq$ 并不表示逐元素的不等号，$A(\boldsymbol{x}) \preceq \boldsymbol{B}$ 的含义是 $\boldsymbol{B}-A(\boldsymbol{x})$ 半正定.

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

#### Proper cones and generalized inequalities

回顾偏序关系要求的性质
- Reflexivity: $\boldsymbol{x} \preceq \boldsymbol{x}$
- Antisymmetry: $\boldsymbol{x} \preceq \boldsymbol{y}, \boldsymbol{y} \preceq \boldsymbol{x}\Longrightarrow \boldsymbol{x}=\boldsymbol{y}$
- Transitivity: $\boldsymbol{x} \preceq \boldsymbol{y}, \boldsymbol{y} \preceq \boldsymbol{z} \Longrightarrow \boldsymbol{x} \preceq \boldsymbol{z}$

如果我们定义关系 $\preceq_K$ 为 $\boldsymbol{x} \preceq_K \boldsymbol{y} \Longleftrightarrow \boldsymbol{y} - \boldsymbol{x} \in K$，其中 $K$ 是一个锥，由于 $\boldsymbol{0}\in K$ 以及锥中元素对锥组合封闭，第一条性质和第三条性质被自然满足，但第三条限制不被所有锥满足，因此我们需要让锥 $K$ 额外满足 $-K \cap K = \{\boldsymbol{0}\}$ 以满足反自反性.

满足 $-K \cap K =\{\boldsymbol{0}\}$ 的锥 $K$ 就可以定义一个偏序关系，为了让它的性质更好，我们经常在这样的锥上操作：

{{< admonition definition "DEFINITION (proper cone)" true >}}
定义**适当锥(proper cone)** 为满足
- convex: $K$ 是凸锥.
- closed: $K$ 是闭集.
- solid: $K$ 的内部非空，$\boldsymbol{\operatorname{int}}\ K \ne \varnothing$.
- pointed: $K \cap -K = \{\boldsymbol{0}\}$，这等价于 $\boldsymbol{x},-\boldsymbol{x}\in K \Longrightarrow \boldsymbol{x}=\boldsymbol{0}$.

的锥 $K$，有时 proper cone 也译作“正常锥”.
{{< /admonition >}}

此时额外地还有 $\boldsymbol{x}\prec_K \boldsymbol{y} \Longleftrightarrow \boldsymbol{y}-\boldsymbol{x}\in \boldsymbol{\operatorname{int}}\ K$. 当 $K=\mathbb R_+$，此时诱导出的偏序关系就是 $\mathbb R$ 的大小关系，当 $K=\mathbb R^n_+$ 时诱导出的就是 $n$ 维向量逐元素的大小关系，$K=S^n_+$ 时诱导出的就是判断矩阵半正定的关系，这些特殊的偏序关系均在上文出现过.

proper cone $K$ 诱导出的偏序关系还有一些良好的性质：
- $\boldsymbol{x} \preceq_K \boldsymbol{y},\boldsymbol{u}\preceq_K \boldsymbol{v}\Longrightarrow \boldsymbol{x}+\boldsymbol{u}\preceq_K\boldsymbol{y}+\boldsymbol{v}$.
- $\boldsymbol{x}\preceq_K\boldsymbol{y},\alpha \ge 0\Longrightarrow \alpha \boldsymbol{x}\preceq_K\alpha\boldsymbol{y}$.
- 若 $\forall i \in \mathbb N_{>0}$ 都有 $\boldsymbol{x_i}\preceq_K\boldsymbol{y_i}$ 且 $\boldsymbol{x_i}\to\boldsymbol{x},\boldsymbol{y_i}\to\boldsymbol{y}$，则 $\boldsymbol{x}\preceq_K\boldsymbol{y}$.

#### Minimum and minimal elements

众所周知，偏序关系不一定是全序关系，这意味着可能存在两个元素不可比的情况，这时就有了最小值(minimum)和极小值(minimal)的区分. 在偏序关系 $\preceq_K$ 下， 
- $\boldsymbol{x} \in S$ 是 $S$ 中的最小值当且仅当 $\boldsymbol{x}$ 和 $S$ 中任一元素都可比且 $\boldsymbol{x}$ 更小，也就是
  $$
  \forall \boldsymbol{y} \in S,\quad \boldsymbol{x} \preceq_K \boldsymbol{y}
  $$ 
  这等价于 $S \subseteq \boldsymbol{x} + K$.
- $\boldsymbol{x} \in S$ 是 $S$ 中的极小值当且仅当它和与之可比的元素相比都更小，也就是 $\forall \boldsymbol{y} \in S$，
  $$
  \boldsymbol{y} \preceq_K \boldsymbol{x} \Longrightarrow \boldsymbol{y}=\boldsymbol{x}
  $$
  这等价于 $(\boldsymbol{x}-K)\cap S = \{\boldsymbol{x}\}$.

{{< figure src="/images/c37d08d/img3.svg" title="最小值与极小值" >}}

上图中的左侧的浅灰色部分为 $\boldsymbol{x_1}+\mathbb R^2_+$，右侧的浅灰色部分为 $\boldsymbol{x_2}-\mathbb R^2_+$，$\boldsymbol{x_1}$ 为左图唯一的最小值，$\boldsymbol{x_2}$ 为右图中的一个极小值.

### Separating and supporting hyperplanes

对于任意两个不交的凸集，必然存在一个超平面将它们隔开，这个直观且重要的定理叫做**超平面分离定理(separating hyperplane theorem)**.

{{< admonition theorem "THEOREM (separating hyperplane theorem)" true >}}
设 $C,D$ 是两个非空凸集且 $C \cap D = \varnothing$，则存在 $\boldsymbol{a} \ne \boldsymbol{0}$ 和 $b$ 使得
$$
\begin{aligned}
\forall \boldsymbol{x} \in C,\quad \boldsymbol{a}^T\boldsymbol{x} \le b\\
\forall \boldsymbol{x} \in D,\quad \boldsymbol{a}^T\boldsymbol{x} \ge b\\
\end{aligned}
$$
换句话说，超平面 $\{\boldsymbol{x}:\boldsymbol{a}^T\boldsymbol{x}=b\}$ 将 $C,D$ 分隔开了.
{{< /admonition >}}

{{< figure src="/images/c37d08d/img4.svg" title="超平面分离定理" >}}

{{< details "PROOF" >}}
一个简单的特例是，当存在 $\boldsymbol{c} \in C$ 和 $\boldsymbol{d} \in D$ 使得 $$\|\boldsymbol{c}-\boldsymbol{d}\| = \inf\{\|\boldsymbol{x}-\boldsymbol{y}\|:\boldsymbol{x}\in C,\boldsymbol{y}\in D\}>0$$ 时，取过 $\boldsymbol{c},\boldsymbol{d}$ 中点且法向量为 $\boldsymbol{c}-\boldsymbol{d}$ 的超平面即可. 但这样的 $\boldsymbol{c},\boldsymbol{d}$ 并不总能取到.

先证明这个特例情形，形式化地，设 $f(\boldsymbol{u})=(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\frac{\boldsymbol{c}+\boldsymbol{d}}{2})$，下面验证 $\forall \boldsymbol{u} \in \boldsymbol{C}$ 都有 $f(\boldsymbol{u}) \ge 0$，对于 $D$ 同理可证 $\le 0$.

反证法，若存在 $\boldsymbol{u} \in C$ 使 $f(\boldsymbol{u}) < 0$，也即
$$
(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\boldsymbol{c}+\frac{\boldsymbol{c}-\boldsymbol{d}}{2})=(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\boldsymbol{c})+\frac{\|\boldsymbol{c}-\boldsymbol{d}\|_2{}^2}{2}<0
$$
于是必有 $(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\boldsymbol{c})<0$，然而，当取 $\boldsymbol{u}$ 与 $\boldsymbol{c}$ 所连线段上的点 $t(\boldsymbol{u}-\boldsymbol{c})+\boldsymbol{c},t \in (0,1]$ 时，本应有
$$
\begin{aligned}
&\|t(\boldsymbol{u}-\boldsymbol{c})+\boldsymbol{c}-\boldsymbol{d}\|_2{}^2 \ge \|\boldsymbol{c}-\boldsymbol{d}\|_2{}^2\\
\Longleftrightarrow & t\|\boldsymbol{u}-\boldsymbol{c}\|_2{}^2+2(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\boldsymbol{c}) \ge 0
\end{aligned}
$$
但当 $t \to 0^+$ 时，不等式左侧趋于 $2(\boldsymbol{c}-\boldsymbol{d})^T(\boldsymbol{u}-\boldsymbol{c}) < 0$，矛盾！

对于一般情况，我们的目的是求出一向量 $\boldsymbol{a}$ 使得
$$
\sup\{\boldsymbol{a}^T\boldsymbol{c}\} \le \inf\{\boldsymbol{a}^T\boldsymbol{d}\}
$$
此时在区间 $[\sup\{\boldsymbol{a}^T\boldsymbol{c}\}, \inf\{\boldsymbol{a}^T\boldsymbol{d}\}]$ 中任取 $b$ 即可，为此考虑不含 $\boldsymbol{0}$ 的凸集
$$
S=C-D=\{\boldsymbol{c}-\boldsymbol{d}:\boldsymbol c\in C,\boldsymbol d\in D\}
$$
只需找到 $\boldsymbol{a}$ 使得 $\forall \boldsymbol{s} \in S,\boldsymbol{a}^T\boldsymbol{s} \le 0$，也就是证明存在一个超平面分隔 $S$ 与 $\{\boldsymbol{0}\}$.

考察其闭包 $\cl S$，分两种情况
- $\boldsymbol{0} \notin \cl S$，此时可以取到 $\boldsymbol{p} =\arg\inf_{\boldsymbol{u} \in \cl S} \|\boldsymbol{u}-\boldsymbol{0}\|_2{}^2$，化为特例情况.
- $\boldsymbol{0} \in \cl S$，这一情形实际上等价于下面的支撑超平面定理.
{{< /details >}}

假设 $\boldsymbol{x_0}$ 是 $C \subseteq \mathbb R^n$ 的边界 $\partial C=\cl C - \boldsymbol{\operatorname{int}}\ C$ 上一点，若 $\boldsymbol{a} \ne \boldsymbol{0}$ 满足 $\forall \boldsymbol{x}\in C,\boldsymbol{a}^T\boldsymbol{x} \le \boldsymbol{a}^T\boldsymbol{x_0}$，那么 $\big\{ \boldsymbol{x}:\boldsymbol{a}^T(\boldsymbol{x}-\boldsymbol{x_0})=\boldsymbol{0} \big\}$ 就被称作 $C$ 在 $\boldsymbol{x_0}$ 上的**支撑超平面(supporting hyperplane)**，关于支撑超平面有下面的支撑超平面定理：

{{< admonition theorem "THEOREM(supporting hyperplane theorem)" true >}}
对于任意非空闭凸集 $C$ 和边界上一点 $\boldsymbol{x_0}\in\partial C$，$C$ 在 $\boldsymbol{x_0}$ 上的支撑超平面始终存在.
{{< /admonition >}}

{{< details "PROOF" >}}
取一列点 $\boldsymbol{y_k} \notin C$，$\boldsymbol{y_k} \to \boldsymbol{x_0}$ 并令 $\boldsymbol{x_k} \in C$ 是 $\boldsymbol{y_k}$ 到 $C$ 的最近点，则 $\forall \boldsymbol{x} \in C,\ (\boldsymbol{y_k}-\boldsymbol{x_k})^T(\boldsymbol{x}-\boldsymbol{x_k}) \le 0$，再令
$$
\boldsymbol{a_k}=\frac{\boldsymbol{y_k}-\boldsymbol{x_k}}{\|\boldsymbol{y_k}-\boldsymbol{x_k}\|}
$$
并取收敛子列 $\boldsymbol{a_k} \to \boldsymbol{a},\ \|\boldsymbol{a}\|=1$，又可证明 $\boldsymbol{x_k}\to\boldsymbol{x_0}$，于是取极限得到 $\boldsymbol{a}^T(\boldsymbol{x}-\boldsymbol{x_0}) \le 0,\ \forall \boldsymbol{x} \in C$，证毕.
{{< /details >}}

{{< figure src="/images/c37d08d/img5.svg" title="支撑超平面示例" >}}

## Convex functions

### Basic properties and examples

{{< admonition definition "DEFINITION(convex function)" true >}}
称函数 $f:\mathbb R^n \mapsto \mathbb R$ 是凸的，当且仅当其定义域 $\dom f$ 是凸集且 $\forall \boldsymbol{x,y} \in \dom f,\ \theta \in [0,1]$ 都有
$$
f(\theta\boldsymbol{x}+(1-\theta)\boldsymbol{y}) \le \theta f(\boldsymbol{x})+(1-\theta)f(\boldsymbol{y})
$$
函数 $f$ 是凸函数当且仅当函数 $f$ 是凸的. 若将不等号反号，则称函数 $f$ 是凹(concave)的，显然，若 $f$ 是凸函数，则 $-f$ 为凹函数.

当 $\boldsymbol{x} \neq \boldsymbol{y}$，$\theta \in (0,1)$ 时上式总取不到等号时，称 $f$ 为严格凸函数.
{{< /admonition >}}

这个定义的几何意义是说，凸函数上两点之间的割线始终在函数图像上方（非严格或严格），一维情形如下图所示.

{{< figure src="/images/c37d08d/img6.svg" title="定义在 $\mathbb R$ 上的一个凸函数" >}}

对于一个凸函数，任选定义域内一点，定义在每一条经过该点的直线上的新函数也应该是凸的，这引出了凸函数的另一定义

{{< admonition definition "DEFINITION(convex function 2)" true >}}
$f$ 是凸函数等价于，$\forall \boldsymbol{x} \in \dom f$ 和 $\boldsymbol{v}$，定义在 $\mathbb R$ 子集上的函数
$$
g(t)=f(\boldsymbol{x}+t\boldsymbol{v})
$$
也是凸函数，其中 $g$ 的定义域为 $\{t:\boldsymbol{x}+t\boldsymbol{v} \in \dom f\}$.
{{< /admonition >}}

例如，$f(x_1,x_2)=x_1{}^2+x_2{}^2$ 是凸函数，将其限制在直线上时总为开口向上的二次函数，仍是凸函数.

{{< details "定义的等价性证明" >}}
首先 $\dom g$ 是凸集，这是因为凸集与直线的交集仍是凸集. 下面证明不等式限制的等价性.

$$
\begin{aligned}
f \text{ convex} &\Longleftrightarrow f\big(\theta(\boldsymbol{x}+t_1\boldsymbol{v})+(1-\theta)(\boldsymbol{x}+t_2\boldsymbol{v})\big) \le \theta f(\boldsymbol{x}+t_1\boldsymbol{v})+(1-\theta)f(\boldsymbol{x}+t_2\boldsymbol{v})\\
&\Longleftrightarrow g(\theta t_1+(1-\theta)t_2) \le \theta g(t_1)+(1-\theta) g(t_2) \\
&\Longleftrightarrow g \text{ convex}
\end{aligned}
$$
证毕.
{{< /details >}}

有时我们不想显式声明定义域，此时可以将未定义区域的函数值全部设为 $\infty$，扩展后的函数是凸函数等价于原函数是凸函数，换句话说，对于定义在 $\mathbb R^n$ 子集上的函数 $f$，设 $\tilde{f}:\mathbb R^n \to \mathbb R \cup \{\infty\}$ 定义为
$$
\tilde{f}(\boldsymbol{x})=\begin{cases}
f(\boldsymbol{x}),& \boldsymbol{x} \in \dom f\\
\infty,& \boldsymbol{x} \notin \dom f
\end{cases}
$$
则 $\tilde{f}$ 为凸函数等价于 $f$ 为凸函数.

笔者高中接触定义在实数域上的凸函数时，见到的的往往是另外两种定义：切线位于函数图像下侧、二阶导数非负，这对应了我们下面要讲述的一阶条件与二阶条件.

#### First-order conditions

设 $f$ 可微，则 $f$ 为凸函数当且仅当 $\dom f$ 是凸集并且 $\forall \boldsymbol{x},\boldsymbol{y} \in \dom f$ 均有
$$
f(\boldsymbol{y}) \ge f(\boldsymbol{x})+\nabla f(\boldsymbol{x})^T(\boldsymbol{y}-\boldsymbol{x})
$$
该式表明函数的一阶 Taylor 逼近总是对函数的全局低估，这对应了"切线总在图像下侧"这一几何直观，我们称其为**一阶条件(first-order condition)**，一维情形可见图示.

{{< figure src="/images/c37d08d/img7.svg" title="一阶条件图示" >}}

凹函数总是对应不等号反向的情形，之后若无必要就不再赘述，只关注凸函数的情况. 接下来我们证明在可微情况下一阶条件与定义的等价性.

{{< details "PROOF" >}}
设函数 $f$ 可微，先证一维情形.

- 若 $f$ 满足一阶条件，对任意 $x,y \in \dom f,\ \theta \in [0, 1]$，设 $z=\theta x + (1-\theta) y$，则
  $$
  \begin{aligned}
  &f(x) \ge f(z) + f'(z)(x - z)\\
  &f(y) \ge f(z) + f'(z)(y - z)
  \end{aligned}
  $$
  将两不等式凸组合得到
  $$
  \theta f(x) + (1-\theta)f(y) \ge f(z) + f'(z)\big( \theta x + (1-\theta)y - z \big)
  $$
  而 $\theta x+(1-\theta)y-z=0$，故 $\theta f(x) + (1-\theta)f(y) \ge f\big(\theta(x)+(1-\theta)y\big)$，于是 $f$ 为凸函数.
- 若 $f$ 为凸函数，则 $\forall x,y \in \dom f,\ \theta \in (0,1]$ 有
  $$
  f(\theta y + (1-\theta)x) \le \theta f(y) + (1-\theta)f(x) \Longrightarrow \theta f(x)+f(x+\theta(y-x))-f(x) \le \theta f(y) 
  $$
  两侧除以 $\theta$ 得到
  $$
  f(y) \ge f(x)+\frac{f(x+\theta(y-x))-f(x)}{\theta}
  $$
  令 $\theta \to 0^+$ 立刻得到
  $$
  f(y) \ge f(x) + f'(x)(y-x)
  $$
  于是 $f$ 满足一阶条件.

对于高维情况，我们尝试用凸函数的第二定义将其转为一维情况. 考虑令 $\boldsymbol{v}=\boldsymbol{y}-\boldsymbol{x}$，则

$$
g(t)=f(\boldsymbol{x}+t\boldsymbol{v}),\quad g'(t)=\nabla f(\boldsymbol{x}+t\boldsymbol{v})^T\boldsymbol{v}
$$

若 $f$ 是凸函数，那么 $g$ 也为凸函数，$g(t_1) \ge g(t_2) +g'(t_2)(t_1-t_2)$，代入 $t_1=1,t_2=0$ 得到
$$
f(\boldsymbol{x}+\boldsymbol{v}) \ge f(\boldsymbol{x})+\nabla f(\boldsymbol{x})^T\boldsymbol{v}
$$
得到了一阶条件.

另一方向和一维情况完全一致，若 $f$ 满足一阶条件，则对于任意 $\boldsymbol{x},\boldsymbol{y} \in \dom f$，令 $\boldsymbol{z}=\theta\boldsymbol{x}+(1-\theta)\boldsymbol{y}$，有
$$
f(\boldsymbol{x}) \ge f(\boldsymbol{z})+\nabla f(\boldsymbol{z})^T(\boldsymbol{x}-\boldsymbol{z}) \\
f(\boldsymbol{y}) \ge f(\boldsymbol{z})+\nabla f(\boldsymbol{z})^T(\boldsymbol{y}-\boldsymbol{z})
$$
将两不等式凸组合得到
$$
\theta f(\boldsymbol{x})+(1-\theta)f(\boldsymbol{y}) \ge f(\boldsymbol{z})
$$
即 $f$ 为凸函数.

{{< /details >}}

一阶条件隐含了一个性质：若能找到一点 $\boldsymbol{x_0}$ 满足 $\nabla f(\boldsymbol{x_0})=\boldsymbol{0}$，则 $\boldsymbol{x_0}$ 就是 $f$ 的最小值点（之一），$f(\boldsymbol{x_0})$ 就是函数的最小值.

#### Second-order conditions

凸函数的最后一个定义就是**二阶条件(second-order condition)**：若 $f:\mathbb R^n \mapsto \mathbb R$ 二阶可微，则 $f$ 为凸函数等价于 $\dom f$ 为凸集且 $\forall \boldsymbol{x} \in \dom f,\ \nabla^2 f(\boldsymbol{x}) \succeq 0$. 一维情况下 Hessian 矩阵半正定等价于二阶导数非负，一阶导数单调不减.

> [!NOTE]
> Hessian 矩阵正定可以导出函数严格凸，但严格凸并**不**能推出 Hessian 矩阵正定. 例如 $f(x)=x^4$ 在 $x=0$ 处 Hessian 矩阵为 $0$.

{{< admonition example "EXAMPLE" true >}}
二次函数 $f:\mathbb R^n \mapsto \mathbb R$ 定义为
$$
f(\boldsymbol{x})=\frac{1}{2}\boldsymbol{x}^T\boldsymbol{P}\boldsymbol{x}+\boldsymbol{q}^T\boldsymbol{x}+r
$$
其中 $\boldsymbol{P} \in S^n,\ \boldsymbol{q} \in \mathbb R^n,\ r \in \mathbb R$.

容易求得 $\nabla^2 f(\boldsymbol{x})=\boldsymbol{P}$，因此 $f$ 为凸函数当且仅当 $\boldsymbol{P}$ 为半正定矩阵. 可以证明，对于二次函数 $f$，其 Hessian 矩阵正定与其为严格凸函数等价.
{{< /admonition >}}

{{< admonition example "EXAMPLE" true >}}
对于函数 $f(x)=x^{-2}$，其 Hessian 矩阵为 $6x^{-4} \ge 0$，但 $f(x)$ 不是凸函数，因为其定义域不是凸集（不含原点），但若将定义域限制在 $x > 0$（或 $< 0$） 则此时 $f(x)$ 确为凸函数.
{{< /admonition >}}

容易验证，仿射函数 $f(\boldsymbol{x})=\boldsymbol{A}\boldsymbol{x}+\boldsymbol{b}$、指数函数 $f(x)=\exp(-x)$ 均为凸函数.
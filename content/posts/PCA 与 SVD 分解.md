---
title: PCA 与 SVD 分解
subtitle:
date: 2026-04-15T17:25:58+08:00
slug: 5161887
draft: false
description:
keywords:
comment: true
weight: 0
tags:
  - 线性代数
  - 机器学习
categories:
  - 数学
  - 机器学习
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

本文简单介绍了 PCA 主成分分析以及 SVD 分解.

<!--more-->

## PCA

当我们传输一个矩阵时，所需信息量显然与矩阵大小有关，例如传递一个 $m \times n$ 的 `double` 类型矩阵需要 $8mn$ bit，然而，当矩阵的秩相对较小时，我们不必总是传递完整的原始矩阵
$$
\begin{pmatrix}
1 & 2 & 3\\
2 & 4 & 6\\
3 & 6 & 9\\
\end{pmatrix}=\begin{pmatrix}
1\\
2\\
3
\end{pmatrix}
\begin{pmatrix}
1 & 2 & 3
\end{pmatrix}
$$
实际上只需要传递两个向量，然而秩一矩阵相当罕见，我们用到的矩阵大多还是高秩的，这时候就可以用PCA（Principal Component Analysis, 主成分分析）来损失一定信息将矩阵变为低秩并传输.

### 特征值分解下的 PCA

如果矩阵 $\boldsymbol A$ 是实对称矩阵，则存在单位正交矩阵 $\boldsymbol P$ 和对角矩阵 $\boldsymbol \Lambda$ 满足，$\boldsymbol A=\boldsymbol P\boldsymbol \Lambda \boldsymbol P^T$，此时
$$
\boldsymbol A=\sum_{i=1}^{n}\lambda_i\boldsymbol p_i \boldsymbol p_i^T
$$
同样只需要传递一些向量，不同之处在于，我们没有减少传输的信息量，但是我们可以将上式在某处截断，转而用
$$
\hat{\boldsymbol A}_k=\sum_{i=1}^{k}\lambda_i\boldsymbol p_i\boldsymbol p_i^T
$$
来近似传递 $\boldsymbol A$. 此时需要传递 $8k(n+1)$ bits，这里的 $k$ 较小. 然而这个方法的问题也很明显：

1. 如何评估两个矩阵的近似程度？
2. $\lambda_i$ 应该选取哪 $k$ 个能得到最佳近似？
3. 截取 $k$ 个特征值的近似和原始矩阵 $\boldsymbol A$ 到底差多少？

以线性变换的角度看，矩阵 $\boldsymbol A$ 表示了一个线性变换，评估两个矩阵的相似程度，本质就是评估两个线性变换的相似程度，直觉上来看，我们保留的应当是绝对值前 $k$ 大的特征值，而评估相似程度也可以用线性算子的 Frobenius 范数，最小化 $\|\boldsymbol A-\hat{\boldsymbol A_k}\|$，这也对应了保留绝对值前 $k$ 大的特征值，和直觉相同.

若保留绝对值前 $k$ 大的特征值，则在 $L_2$ 范数下 $\|\boldsymbol A-\hat{\boldsymbol A_k}\| \le |\lambda_{k+1}|$，在 Frobenius 范数下 $\|\boldsymbol A - \hat{\boldsymbol A_k}\|_F{}^2=\sum_{i=k+1}^{n}\lambda_i{}^2$，这里自然地要求所有特征值已经有序，$|\lambda_1| \ge |\lambda_2| \ge \cdots \ge |\lambda_n|$.

**例** 
$$
\boldsymbol A=\begin{pmatrix}
5 & 2\\
2 & 2
\end{pmatrix}
$$
对其做 PCA，保留一项近似.

$\boldsymbol A$ 是一个 实对称矩阵，$\lambda_1=6,\lambda_2=1$，可选取单位正交特征向量
$$
\boldsymbol v_1=\frac{1}{\sqrt 5}\begin{pmatrix}2\\1\end{pmatrix},\boldsymbol v_2=\frac{1}{\sqrt 5}\begin{pmatrix}1\\-2\end{pmatrix}
$$
于是 $\boldsymbol A=\lambda_1\boldsymbol v_1\boldsymbol v_1{}^T+\lambda_2\boldsymbol v_2\boldsymbol v_2{}^T$，取第一项得到
$$
\hat{\boldsymbol A_1}=\lambda_1\boldsymbol v_1\boldsymbol v_1{}^T=\begin{pmatrix}
4.8 & 2.4\\
2.4 & 1.2
\end{pmatrix}
$$

### 数据逼近下的 PCA

若有 $n$ 个数据点构成矩阵 $\boldsymbol X=(\boldsymbol x_1,\boldsymbol x_2,\cdots ,\boldsymbol x_n)^T$，其中每个数据点 $\boldsymbol x_i$ 都是一个 $m$ 维向量，$\boldsymbol X$ 的每一行表示一个数据点. 若 $\boldsymbol X$ 的行空间维度为 $d$，那么总可以选取一组基 $\{\boldsymbol z_1,\cdots ,\boldsymbol z_d\}$ 唯一表出每个数据点
$$
\boldsymbol x_i=\sum_{j=1}^{d} w_{i,j}\boldsymbol z_j
$$
类似上一节的想法，我们期待传递更少的信息量，减少基的数量. 用 $d'<d$ 个基近似描述这些数据点
$$
\boldsymbol x_i \approx \sum_{j=1}^{d'}w_{i,j}\boldsymbol z_j
$$
通常我们在最开始将数据做中心化处理，即要求样本均值为 $0$，否则令 $\tilde{\boldsymbol x_i}=\boldsymbol x_i-\sum_{j=1}^{n}\boldsymbol x_j$，后续讨论中默认数据已经中心化.

#### 一维情形

先考虑 $d'=1$ 的情况，此时我们希望找到一个合理的向量 $\boldsymbol z$ 来最小化
$$
\sum_{i=1}^{n}\|\boldsymbol x_i-a_i\boldsymbol z\|^2
$$
其中 
$$
a_i=\arg\min_{c \in \mathbb R} \|\boldsymbol x_i-c\boldsymbol z\|^2
$$
就是在给定 $\boldsymbol z$ 后使得 $\|\boldsymbol x_i-a_i\boldsymbol z\|$ 最小的那个系数 $a_i$，对优化目标求导得到
$$
\frac{\d \|\boldsymbol x_i-a_i\boldsymbol z\|^2}{\d c}=-2(\boldsymbol x_i-a_i\boldsymbol z)^T\boldsymbol z=0
$$
于是
$$
a_i=\frac{\boldsymbol z^T\boldsymbol x_i}{\boldsymbol z^T\boldsymbol z}
$$
$\boldsymbol z^T\boldsymbol z$ 表示 $\boldsymbol z$ 的模长，我们不关注这个而只关注 $\boldsymbol z$ 的方向，模长放在系数 $a_i$ 里即可. 于是不妨规定 $\boldsymbol z$ 是一个单位向量，于是 $\boldsymbol z^T\boldsymbol z=1$，$a_i=\boldsymbol z^T\boldsymbol x_i$.

回到最初我们的优化目标，展开并将得到的 $a_i$ 带入，
$$
\begin{aligned}
\sum_{i=1}^{n}(\boldsymbol x_i-a_i\boldsymbol z)^T(\boldsymbol x_i-a_i\boldsymbol z)&=\sum_{i=1}^{n}\boldsymbol x_i{}^T\boldsymbol x_i-2a_i\boldsymbol x_i{}^T\boldsymbol z+a_i{}^2\boldsymbol z^T\boldsymbol z\\
&=\sum_{i=1}^{n}\boldsymbol x_i{}^T\boldsymbol x_i-\boldsymbol z^T\boldsymbol x_i\boldsymbol x_i{}^T\boldsymbol z
\end{aligned}
$$
$\boldsymbol x_i{}^T\boldsymbol x_i$ 是常数，因此我们要找的就是
$$
\arg\max_{\|\boldsymbol z\|=1}\sum_{i=1}^{n} \boldsymbol z^T\boldsymbol x_i\boldsymbol x_i{}^T\boldsymbol z=\arg\max_{\|\boldsymbol z\|=1}\boldsymbol z^T\boldsymbol X^T\boldsymbol X\boldsymbol z
$$
这是一个带约束的极值问题，拉乘构造函数 $\mathcal L(\boldsymbol z,\lambda)=\boldsymbol z^T\boldsymbol X^T\boldsymbol X\boldsymbol z-\lambda(\boldsymbol z^T\boldsymbol z-1)$ 并求偏导
$$
\begin{cases}
\dfrac{\partial \mathcal L}{\partial \boldsymbol z}=2\boldsymbol X^T\boldsymbol X\boldsymbol z-2\lambda\boldsymbol z=0\\
\dfrac{\partial \mathcal L}{\partial \lambda}=\boldsymbol z^T\boldsymbol z-1=0
\end{cases}
$$
也就是 $\|\boldsymbol z\|=1$ 且 $\boldsymbol X^T\boldsymbol X\boldsymbol z=\lambda\boldsymbol z$，于是 $\boldsymbol z$ 应当是 $\boldsymbol X^T\boldsymbol X$ 的一个单位特征向量，带回原式得
$$
\arg\max_{\|\boldsymbol z\|=1}(\lambda\boldsymbol z^T\boldsymbol z)=\arg\max_{\|\boldsymbol z\|=1} \lambda
$$
于是我们应取对应最大特征值的那个单位特征向量.

#### 多维情形

当 $d'>1$ 时，我们期待取一组单位正交向量 $\{\boldsymbol z_1,\cdots ,\boldsymbol z_{d'}\}$ 作为基来尽可能表示所有数据，此时我们要最小化
$$
\sum_{i=1}^{n}\left\| \boldsymbol x_i-\sum_{j=1}^{d'}w_{i,j}\boldsymbol z_j \right\|^2
$$
类似地，我们先固定 $\boldsymbol z_1,\cdots \boldsymbol z_{d'}$ 并求出此时的最优系数矩阵 $\boldsymbol W$. 显然应该有 $w_{i,j}=\boldsymbol z_j{}^T\boldsymbol x_i$，从而能把 $\boldsymbol x_i$ 在 $\boldsymbol z_j$ 方向上的分量全部减掉. 更严谨地，对 $w_{i,j}$ 求偏导得到
$$
-2\boldsymbol x_i\cdot \boldsymbol z_j+2w_{i,j}=0
$$
于是 $w_{i,j}=\boldsymbol x_i\cdot \boldsymbol z_j=\boldsymbol z_j{}^T\boldsymbol x_i$，同一维情形一样化式子并带入，
$$
\begin{aligned}
\arg\min \sum_{i=1}^{n}\left\| \boldsymbol x_i-\sum_{j=1}^{d'}w_{i,j}\boldsymbol z_j \right\|^2&=\arg\min\sum_{i=1}^{n}\left(-2\boldsymbol x_i{}^T\sum_{j=1}^{d'}w_{i,j}\boldsymbol z_j\right)+\left(\sum_{j=1}^{d'}w_{i,j}{}^2\right)\\
&=\arg\max \sum_{i=1}^{n}\sum_{j=1}^{d'}\boldsymbol z_j{}^T\boldsymbol x_i\boldsymbol x_i{}^T\boldsymbol z_j\\
&=\arg\max \sum_{j=1}^{d'}\boldsymbol z_j{}^T \left( \sum_{i=1}^{n}\boldsymbol x_i\boldsymbol x_i{}^T \right) \boldsymbol z_j\\
&=\arg\max_{\boldsymbol Z^T\boldsymbol Z=\boldsymbol I} \operatorname{tr} (\boldsymbol Z^T\boldsymbol X^T\boldsymbol X\boldsymbol Z)
\end{aligned}
$$

### 协方差下的 PCA

如果将数据点 $\boldsymbol x_i$​ 视作一列随机向量，其中最具代表性的特征对应方差最大的方向，如何捕获这个方向？更进一步地，如何捕获方差前 $k$ 大的方向？



#### 随机向量的期望

若随机向量 $\boldsymbol X = (X_1,\cdots ,X_n)^T$，自然地定义 $\boldsymbol x$ 的期望为 
$$
\mathbb E \boldsymbol X=\begin{pmatrix}
\mathbb E X_1\\
\vdots\\
\mathbb E X_n
\end{pmatrix}
$$
对于一个随机变量构成的矩阵 $\boldsymbol X=(X_{i,j})$，其期望被定义为
$$
\mathbb E \boldsymbol X=\begin{pmatrix}
\mathbb E X_{1,1} & \mathbb E X_{1,2} & \cdots & \mathbb E X_{1,n}\\
\mathbb E X_{2,1} & \mathbb E X_{2,2} & \cdots & \mathbb E X_{2,n}\\
\vdots & \vdots & \ddots & \vdots\\
\mathbb E X_{m,1} & \mathbb E X_{m,2} & \cdots &\mathbb E X_{m, n}
\end{pmatrix}
$$

#### 随机向量的方差

我们已经熟知随机变量的定义 $\operatorname{Var} X = \mathbb E[(X-\mathbb EX)^2]$，协方差的定义 $\operatorname{Cov}(X,Y)=\mathbb E[(X-\mathbb EX)(Y-\mathbb EY)]$.

而对于一个随机向量 $\boldsymbol X=(X_1,\cdots ,X_n)^T$，其方差应当包含 $n^2$ 个信息，表示每个随机变量 $X_i$ 的方差以及每对随机变量 $X_i,X_j$ 之间的协方差. 对于向量，其平方有两种定义：内积或外积，这里用外积是合理的而内积是错误的，因为内积会丢失信息，具体地，
$$
\operatorname{Var}\boldsymbol X=\mathbb E[(\boldsymbol X-\mathbb E\boldsymbol X)(\boldsymbol X-\mathbb E\boldsymbol X)^T]=\begin{pmatrix}
\operatorname{Var}(X_1) & \operatorname{Cov}(X_1,X_2) & \cdots & \operatorname{Cov}(X_1,X_n)\\
\operatorname{Cov}(X_2,X_1) & \operatorname{Var}(X_2) & \cdots & \operatorname{Cov}(X_2,X_n)\\
\vdots & \vdots & \ddots & \vdots\\
\operatorname{Cov}(X_n,X_1) & \operatorname{Cov}(X_n, X_2) & \cdots & \operatorname{Var}(X_n)
\end{pmatrix}
$$
 而若采用内积定义，$\mathbb E[(\boldsymbol X-\mathbb E\boldsymbol X)^T(\boldsymbol X-\mathbb E\boldsymbol X)]=\sum_{i=1}^{n} \operatorname{Var}(X_i)=\operatorname{tr} (\operatorname{Var}\boldsymbol X)$ 丢失了信息.

#### 捕获方差最大的方向

定义好了随机向量的期望和方差，我们回到第一个问题：如何捕获方差最大的方向？

首先，假设 $\boldsymbol x$ 是一个已经中心化的随机向量，即 $\mathbb E\boldsymbol x=0$，于是 $\operatorname{Var}(\boldsymbol x)=\mathbb E(\boldsymbol x\boldsymbol x^T)$，根据已知的 $n$ 个数据点，其协方差矩阵估计为 $\boldsymbol \Sigma=\frac{1}{n}\sum_{i=1}^{n}\boldsymbol x_i\boldsymbol x_i{}^T=\frac{1}{n}\boldsymbol X^T\boldsymbol X$. 我们期待找到一个方向向量 $\|\boldsymbol z\|=1$ 使得 $\operatorname{Var}(\boldsymbol z^T\boldsymbol x)$ 和 原始方差尽可能接近，其中 $\boldsymbol z^T\boldsymbol x$ 为随机向量 $\boldsymbol x$ 在方向向量 $\boldsymbol z$ 上的投影. 而
$$
\operatorname{Var}(\boldsymbol z^T\boldsymbol x)=\mathbb E[(\boldsymbol z^T\boldsymbol x)^2]=\mathbb E[\boldsymbol z^T\boldsymbol x\boldsymbol x^T\boldsymbol z]=\boldsymbol z^T\mathbb E[\boldsymbol x\boldsymbol x^T]\boldsymbol z=\boldsymbol z^T\boldsymbol \Sigma\boldsymbol z
$$
于是投影方差可以写成 $\operatorname{Var}(\boldsymbol z^T\boldsymbol x)=\frac{1}{n}\boldsymbol z^T\boldsymbol X^T\boldsymbol X\boldsymbol z$，这和上一节的形式是一样的，要最大化 $\operatorname{Var}(\boldsymbol z^T\boldsymbol x)$ 等价于找到 $\boldsymbol X^T\boldsymbol X$ 最大特征值对应的单位特征向量，和之前的推导完全一致.

类似地，若要找到方差前 $k$ 大的 $k$ 个正交方向，只需找到前 $k$ 大的特征值对应的单位特征向量.

## SVD 分解

当我们面对一个实对称矩阵（如上面的 $\boldsymbol X^T\boldsymbol X$）时，我们可以通过特征值分解并找到一些主成分，但当需要处理的矩阵是一个 $m \times n$ 的一般矩阵时，我们是否还能将其拆分为向量外积和的形式？答案是肯定的，这就是大名鼎鼎的 SVD 分解（**Singular Value Decomposition**）.

### 构造思路

我们期待将任一 $m \times n$ 矩阵 $\boldsymbol A$ 写作 $\sum \sigma_i \boldsymbol u_i \boldsymbol v_i{}^T$ ，形式化地，我们期待 $\boldsymbol A=\boldsymbol U\boldsymbol \Sigma\boldsymbol V^T$，其中 $\boldsymbol \Sigma$ 是 $r \times r$ 的对角矩阵，并记 $\boldsymbol \Sigma_{i,i}=\sigma_i$. $\boldsymbol U,\boldsymbol V$ 分别为 $m \times r$ 和 $r \times n$ 的矩阵，并且我们声称 $\boldsymbol V$ 总可以是一个单位正交矩阵，也即 $\boldsymbol V^T\boldsymbol V=\boldsymbol I$，此时就有 $\boldsymbol A\boldsymbol V=\boldsymbol U\boldsymbol \Sigma$.

对比左右两侧的每一个列向量，我们要求 $\boldsymbol A\boldsymbol v_i=\sigma_i\boldsymbol u_i$ 对每个 $i$ 成立，于是矩阵 $\boldsymbol U$ 其实是由 $\boldsymbol V,\boldsymbol \Sigma$ 唯一确定的，$\boldsymbol u_i=\dfrac{\boldsymbol A\boldsymbol v_i}{\sigma_i}$. 

这个时候问题会自然浮现出来：既然如此，那我随便选一组单位正交向量构成矩阵 $\boldsymbol V$，不都可以构造出对应的 $\boldsymbol \Sigma$ 和 $\boldsymbol U$ 使得 $\boldsymbol A=\boldsymbol U\boldsymbol \Sigma\boldsymbol V^T$ 吗？看上去有些搞笑，但这确实是正确的，然而这样随意的分解并没有什么用. 但如果我们**规定 $\boldsymbol U$ 也是单位正交的**，这个分解就不再平凡，此时的分解才被称作 SVD 分解.

> [!NOTE] 为什么 $U$ 必须单位正交
>
> - 当 $\boldsymbol U$ 单位正交时，SVD 分解有了一个很漂亮的意义：线性变换 $\boldsymbol A$ 被拆分为了三个步骤，当它作用于向量 $\boldsymbol x$ 时，$\boldsymbol V^T\boldsymbol x$ 代表了一次旋转变换，$\boldsymbol \Sigma$ 代表此时坐标轴上的缩放操作，$\boldsymbol U$ 又一次做了一次旋转变换. 
>
> - 当 $\boldsymbol U$ 单位正交时，这组基是标准正交基，投影后的各个主成分间互不相关.
> - 单位正交矩阵的逆容易计算.

总之，规定 $\boldsymbol U$ 单位正交会带来诸多良好的性质，现在的问题就在于如何找到能让 $\boldsymbol U$ 单位正交的矩阵 $\boldsymbol V$.

首先，$\boldsymbol u_i{}^T\boldsymbol u_i=1$，这要求
$$
\frac{\boldsymbol v_i{}^T\boldsymbol A^T\boldsymbol A\boldsymbol v_i}{\sigma_i{}^2}=1
$$
其次，对于 $i \ne j$，$\boldsymbol u_i{}^T\boldsymbol u_j=0$，这要求
$$
\frac{\boldsymbol v_i{}^T\boldsymbol A^T\boldsymbol A\boldsymbol v_j}{\sigma_i\sigma_j}=0
$$
假如注意力较好，注意到 $\boldsymbol A^T\boldsymbol A$ 是一个实对称矩阵，那不妨就让 $\boldsymbol v_i$ 是其单位正交的特征向量，若 $\boldsymbol A^T\boldsymbol A\boldsymbol v_i=\lambda_i\boldsymbol v_i$，则只需 $\frac{\lambda_i}{\sigma_i{}^2}=1$，于是导出 $\sigma_i=\sqrt{\lambda_i}$，就构造出了一个正确的分解.

$\boldsymbol v_i$ 一定是 $\boldsymbol A^T\boldsymbol A$ 的特征向量吗？答案是肯定的. 由于 $\boldsymbol U$ 的单位正交性，$\boldsymbol U^T\boldsymbol A=\boldsymbol \Sigma\boldsymbol V^T$，对比每一行得到 $\boldsymbol A^T\boldsymbol u_i=\sigma_i\boldsymbol v_i$，根据
$$
\begin{cases}
\sigma_i\boldsymbol u_i=\boldsymbol A\boldsymbol v_i \Longrightarrow \sigma_i\boldsymbol A^T\boldsymbol u_i=\boldsymbol A^T\boldsymbol A\boldsymbol v_i\\ 
\boldsymbol A^T\boldsymbol u_i=\sigma_i\boldsymbol v_i
\end{cases}
$$
上式带入下式，立刻得到 $\boldsymbol v_i$ 是 $\boldsymbol A^T\boldsymbol A$ 的特征向量，且对应的特征值为 $\sigma_i^2$.

#### 拆去脚手架后的 SVD

根据上面的构造思路，我们就不难得到一个 SVD 分解的完整叙述.

**Def.（Reduced SVD）**

对于任意 $m \times n$ 矩阵 $\boldsymbol A$，设 $\operatorname{rank}(\boldsymbol A)=r$，则半正定矩阵 $\boldsymbol A^T\boldsymbol A$ 恰有 $r$ 个正特征值 $\lambda_1 \ge \cdots \ge \lambda_r$，定义 $\boldsymbol A$ 的**奇异值**为 $\sigma_i=\sqrt\lambda_i$，这 $r$ 个特征值对应的 $r$ 个单位正交特征向量被称作（对应的）**右奇异向量** $\boldsymbol v_1 ,\cdots ,\boldsymbol  v_r$，相应地定义**左奇异向量** $\boldsymbol u_i=\dfrac{\boldsymbol A\boldsymbol v_i}{\sigma_i}$ ，这些向量自动满足单位正交性，此时 $m \times r$ 矩阵 $\boldsymbol U=(\boldsymbol u_1,\cdots ,\boldsymbol u_r)$、$r\times r$ 方阵 $\boldsymbol \Sigma=\operatorname{diag}(\sigma_1, \cdots ,\sigma_r)$ 和 $n \times r$ 矩阵 $\boldsymbol V=(\boldsymbol v_1, \cdots ,v_r)$ 定义了 $\boldsymbol A$ 的 SVD 分解 $\boldsymbol A=\boldsymbol U\boldsymbol \Sigma\boldsymbol V^T$.

紧凑型 SVD 中的矩阵 $\boldsymbol U$ 和 $\boldsymbol V$ 并非方阵，将其分别补充为 $m \times m$ 和 $n \times n$ 的方阵即可得到完整性 SVD（Full SVD），补充方式为 $\boldsymbol V=(\boldsymbol v_1,\boldsymbol v_2, \cdots \boldsymbol v_r, \boldsymbol v_{r+1} ,\cdots ,\boldsymbol v_n)$ 其中 $\boldsymbol v_r ,\cdots , \boldsymbol v_n$ 为 $N(\boldsymbol A)$ 的一组标准正交基，同理 $\boldsymbol u_{r+1},\cdots ,\boldsymbol u_m$ 可以用 $N(\boldsymbol A^T)$ 的一组标准正交基补充，$\boldsymbol \Sigma$ 补充为 $m \times n$ 矩阵，剩余部分补 $0$. 此时仍然满足 $\boldsymbol V^T\boldsymbol V=\boldsymbol I$，$\boldsymbol U^T\boldsymbol U=\boldsymbol I$，且 $\boldsymbol A=\boldsymbol U\boldsymbol \Sigma\boldsymbol V^T$.

这个补充似乎无关紧要，只是为了数学上的完整. 这样补充后，旋转矩阵所用的基不再丢失维度.

## SVD 分解在 PCA 中的应用

在 PCA 的过程中，我们需要计算协方差矩阵 $\boldsymbol \Sigma=\frac{1}{n}\boldsymbol X^T\boldsymbol X$ 并求得其特征值和特征向量，若 $\boldsymbol X$ 是 $n \times m$ 矩阵，则计算 $\boldsymbol \Sigma$ 的时间复杂度为 $\mathcal O(m^2n)$，再计算一个 $m \times m$ 的特征值. 然而，应用中经常遇到维度远大于样本量，也就是 $m \gg n$ 的情况，有没有方式避开这样的计算？

将 $\boldsymbol X$ SVD 分解得到 $\boldsymbol X=\boldsymbol U\boldsymbol \Sigma\boldsymbol V^T$，这里的右奇异向量 $\boldsymbol V$ 的各列恰好就是协方差矩阵的特征向量（即主成分方向），对应特征值为 $\frac{\sigma_i{}^2}{n}$，因此只需要求得 SVD 分解即可.

如何求 SVD 分解？我们先计算了 $\boldsymbol X^T\boldsymbol X$ 的特征值和特征向量，然后得到 $\boldsymbol V$？这不是完全相同吗？但是换个角度看，我们可以求 $\boldsymbol X \boldsymbol X^T$ 的特征值，而这是 $n \times n$ 的，效率略有提升. 事实上工程中求 SVD 往往会避开求特征值，效率更高、数值稳定性更好，但这不是本文的重点，读者只需了解通过 SVD 可以避开复杂的矩阵乘法和特征值计算. 

## `scikit-learn` 中的 PCA

在 `scikit-learn` 中与 PCA 相关的类都在 `sklearn.decomposition` 包中，最常用的 PCA 类为 `sklearn.decomposition.PCA`，这里主要使用这个类.

`sklearn.decomposition.PCA` 接受的主要参数如下：

| 参数         | 含义                                                         | 默认值                              |
| ------------ | ------------------------------------------------------------ | ----------------------------------- |
| n_components | 降维后的特征维度数目，若为 $[0,1)$ 间的浮点数则表示指定了主成分占据方差的最小比例，也可以设置为`'mle'`表示自动决定 | $\min(\text{样本数},\text{特征数})$ |
| whiten       | 是否白化（将每个特征的方差归一化），一般 PCA 降维本身不需要  | `False`                             |
| svd_solver   | 指定 SVD 分解的方法，可选 `'auto'`,`'full'`,`'arpack'`,`'randomized'` | `'auto'`                            |

除此之外，类中还有两个成员 `explained_variance__` 表示降维后各主成分的方差，`explained_variance_ratio__` 表示各主成分方差占总方差的比例，`components_` 存储了矩阵 $\boldsymbol V^T$，每行对应一个奇异向量，并已按照奇异值降序排序.

```python {group = "PCA", name = "生成随机数据"}
# %%
import matplotlib.pyplot as plt
from sklearn.datasets._samples_generator import make_blobs

# 生成四个簇的数据，每个样本3个特征
X, y = make_blobs(n_samples = 10000, n_features = 3, 
                  centers = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [3, 3, 3]], 
                  cluster_std = [0.1, 0.2, 0.3, 0.1], random_state = 42)

fig = plt.figure(figsize=(10, 7))
ax = fig.add_subplot(111, projection = '3d')

# c = y 表示根据类别上色，s = 1 设置点的大小让图不那么拥挤
ax.scatter(X[:, 0], X[:, 1], X[:, 2], c = y, marker = 'o', s = 1, cmap = 'viridis')

ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_zlabel('Z axis')
plt.show()
```

```python {group = "PCA", name = "查看各主成分方差"}
# %%
# 查看各主成分的方差
from sklearn.decomposition import PCA
pca = PCA(n_components = 3).fit(X)
# fit 方法会将数据中心化并进行 SVD 分解，不会改变原始数据 X 的形状
print(f'Explained variance ratio: {pca.explained_variance_ratio_}')
print(f'Explained variance: {pca.explained_variance_}')
'''
output:
Explained variance ratio: [0.98043499 0.00999072 0.00957429]
Explained variance: [3.78597259 0.03857942 0.03697134]
'''
```

```python {group = "PCA", name = "PCA 降维"}
# %%
# 将数据投影到 PCA 计算出的主成分上
X_pca = pca.transform(X)
# transform 方法会将数据投影到 PCA 计算出的主成分上，返回一个新的数组，形状为 (n_samples, n_components)
plt.scatter(X_pca[:, 0], X_pca[:, 1], c = y, marker = 'o', s = 1, cmap = 'viridis')
print(f'New direction of the data:\n {pca.components_}')
'''
output:
New direction of the data:
 [[ 0.57723047  0.57765647  0.57716374]
 [ 0.78743556 -0.20661222 -0.580738  ]
 [-0.21621798  0.78969893 -0.57413012]]
第一行对应了第一主成分的方向，约为 1/sqrt{3} * (1, 1, 1).
'''
```

上面的代码展示了一个 PCA 降维的示例，代码首先生成了四簇样本点，中心分别为 $(0,0,0),(1,1,1),(2,2,2)$ 和 $(3,3,3)$，他们都落在了 $x=y=z$ 这条直线上，由于每一簇的半径不大，这条直线上的方差占比达到了相当高的 `0.98043499`. 之后我们通过 PCA 将其降维，我们可以明显地看到每一簇仍然被明显区分.

{{<image src = "/images/5161887/output1.png" caption = "原始数据">}}

{{<image src = "/images/5161887/output2.png" caption = "PCA 降维后数据">}}
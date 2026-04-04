---
title: "A Game Theoretic Approach to Recommendation Systems With Strategic Content Providers"
subtitle: ""
date: 2026-04-04T17:57:17+08:00
description: ""
keywords: ""
comment: false
---

[文章链接](https://arxiv.org/pdf/1806.00955)

## 概述

在部分情况下，广告提供商会观察推荐算法的偏好从而调整自己提供的内容，我们希望寻找一个合理的广告展示策略，满足一些较好的性质.

## 记号约定

- 用户（users）构成集合 $\mathcal U = \{u_1,\cdots ,u_n\}$，广告供应商（players）构成集合 $[N]=\{1,\cdots ,N\}$，mediator 记作 $\mathcal M$.
- 供应商 $j$ 可选择投放的广告构成集合 $\mathcal L_j$，他的一个决策会从集合 $\mathcal L_j$ 中选出一个元素 $X_j$，规定 $\mathcal L = \bigcup_{j=1}^{N} \mathcal L_j$.
- 用户 $u_i$ 对广告存在偏好，$\sigma_i:\mathcal L \to [0,1]$ ，$\sigma_i(l)$ 表示用户 $u_i$ 对广告 $l$ 的满意程度.
- 对于给定的策略组合 $\boldsymbol X=(X_1,\cdots ,X_N)$  和用户 $u_i$， mediator $\mathcal M$ 决定了一个在 $[N] \cup \{\varnothing\}$ 上的概率分布，$\varnothing$ 表示不向用户展示广告. $\mathbb P(\mathcal M(\boldsymbol X,u_i)=j)$ 表示在策略 $\boldsymbol X$ 下 $\mathcal M$ 向用户 $u_i$ 展示 $X_j$ 的概率.
- 在给定的 $\boldsymbol X$ 下，供应商 $j$ 的期望收益为 $\pi_j(\boldsymbol X)=\sum_{i=1}^{n}\mathbb P(\mathcal M(\boldsymbol X,u_i)=j)$.
- 在策略 $\boldsymbol X$ 下的 social welfare 定义为 $V(\boldsymbol X)=\sum_{j=1}^{N}\pi_j(\boldsymbol X)$.
- 规定 $\sigma_i(\boldsymbol X)=\max_{j=1}^{N} \sigma_i(X_j)$.

## Shapley Mediator

我们期待构造出的 mediator 是“公平”、“稳定” 的，具体含义如下：

- **Fair**:

  - **Null Player** 若 $\sigma_i(X_j)=0$，那么 $\mathbb P(\mathcal M(\boldsymbol{X},u_i)=j)=0$

  - **Symmetry** 若 $\sigma_i(X_a)=\sigma_i(X_b)$，那么 $\mathbb P(\mathcal M(\boldsymbol X,u_i)=a) = \mathbb P(\mathcal M(\boldsymbol X,u_i)=b)$

  - **User-Independence** $u_i$ 的决策与 $u_j$ 无关.

  - **Leader Monotonicity** 设集合 $\mathcal S = \arg \max_j \mathbb P(\mathcal M(\boldsymbol X,u_i)=j)$，$\mathcal T = [N]-\mathcal S$，那么 $\forall s \in \mathcal S, t \in \mathcal T$，总有 $\mathbb P(\mathcal M(\boldsymbol X,u_i)=s) > \mathbb P(\mathcal M(\boldsymbol X,u_i)=t)$

- **Stability**: $\forall j \in [N],X_j' \in \mathcal L_j$，$\pi_j(X_1,\cdots ,X_j, \cdots X_N) \ge \pi_j(X_1,\cdots ,X_j',\cdots ,X_n)$，也就是说，对于任意一个 player，他单独调整策略不会使其期望收益增加，这被称作 pure Nash equilibrium，下面简记作 PNE.

- **Complete**: $\sum_{j} \mathbb P(\mathcal M(\boldsymbol X, u_i)=j)=1$.
- 特别地，当 $\sigma_i(\boldsymbol X)=0$ 时，Null Player 与 Complete 矛盾，此时我们允许 $\mathbb P(\mathcal M(\boldsymbol X,u_i)=j) > 0$.

然而，我们马上会发现，不存在同时满足这三点的 mediator.

**Theorem 1** 上述三条性质（下面简单记作 **F**, **S**, **C**）不可能同时满足.

只需要做一个简单构造：有 $3$ 个用户 $u_1,u_2,u_3$ 和两个供应商，$\mathcal L_1=\mathcal L_2=\{l_1,l_2,l_3\}$，考察如下的 $\sigma$：
$$
\begin{array}{cc}
 & \begin{array}{ccc} u_1 & u_2 & u_3 \end{array} \\
\begin{array}{c} l_1 \\ l_2 \\ l_3 \end{array} & 
\left[
\begin{array}{ccc}
0 & y & x \\
x & 0 & y \\
y & x & 0
\end{array}
\right]
\end{array}
$$
其中 $x,y \in (0,1]$，为了叙述方便，我们让 $\mathcal M_k(\sigma_i(l_1),\sigma_i(l_2))$ 表示 $\mathbb P(\mathcal M((l_1,l_2),u_i)=k)$，容易根据 **C** 和 **F** 得到
$$
\mathcal M_1(\sigma_i(l_1),\sigma_i(l_2))=1-\mathcal M_2(\sigma_i(l_1),\sigma_i(l_2))=\mathcal M_2(\sigma_i(l_2),\sigma_i(l_1))
$$
 设 $\mathcal M_1(0,0)=\alpha$，根据 **Symmetry**，$\mathcal M_2(0,0)=\alpha$ 同样成立，再记 $\beta = \mathcal M_1(0,x)+\mathcal M_1(y,0)+\mathcal M_1(x,y)$，可以描述各策略下两供应商的收益情况如下：
$$
\begin{array}{rc}
 & \begin{array}{ccc} l_1 & \hspace{5em} l_2 & \hspace{5em} l_3 \end{array} \\\\
\begin{array}{r} l_1 \\\\ l_2 \\\\ l_3 \end{array} & 
\left[
\begin{array}{ccc}
1+\alpha, 1+\alpha & \beta, 3-\beta & 3-\beta, \beta \\\\
3-\beta, \beta & 1+\alpha, 1+\alpha & \beta, 3-\beta \\\\
\beta, 3-\beta & 3-\beta, \beta & 1+\alpha, 1+\alpha
\end{array}
\right]
\end{array}
$$
注意 $\alpha \le 0.5$，要存在 PNE 策略，只能有 $\beta = 1.5$，此时  $\mathcal M_1(x,y)=0.5$ 需对任意 $x,y$ 成立，与 **Leader Monotonicity** 矛盾，并且对于任一 PNE 策略，我们将上述构造中的三个用户及其策略注入进去即可破坏原本的 PNE.

由上述内容，我们必须放弃 **Complete** 的要求，不强制要求必须向用户展示内容，考虑下面的 Shapley Mediator.

### Shapley Value

我们考虑转换一下视角，考虑每个广告商加入后对用户产生的效益，将其视作一个 Cooperative Game. 对于供应商集合 $\mathcal S$ 和用户 $u_i$，若其效益为 $\max_{s \in \mathcal S} \sigma_i(X_s)$，当加入供应商 $x$ 时，产生的边际贡献为
$$
\max_{s \in \mathcal S \cup \{x\}}\sigma_i(X_s) - \max_{s \in \mathcal S} \sigma_i(X_s)
$$
但这里没有顺序加入的过程，一个广告商何时被加入显然会对其边际贡献造成影响，解决方式是直接在所有可能的排列中随机，求边际贡献的期望，这就是 Shapley Value，定义如下：

对于玩家集合 $\mathcal S \subset [N]$，其产生的价值定义为  $v(\mathcal S)$，则在该 $v$ 下玩家 $i$ 的 Shapley Value 为
$$
\varphi_i(v)=\frac{1}{N!}\sum_{p \in \Pi[N]} (v(pre_i \cup \{i\})-v(pre_i))
$$
其中 $\Pi[N]$ 表示 $1\cdots N$ 产生的所有全排列，$pre_i$ 表示排列 $p$ 中排在数 $i$ 之前的所有元素构成的集合，它有等价的另一定义.
$$
\varphi_i(v)=\sum_{s \in S_i} \frac{(|s|-1)!(N-|s|)!}{N!} \Big(v(s)-v(s-\{i\})\Big)
$$
其中 $S_i$ 是 $[n]$ 的所有包含 $i$ 的子集构成的集族.

### Shapley mediator

回到原始的问题，这里的价值函数  $v$ 就是 $\sigma_i$，直接套用并将 Shapley Value 作为被展示的概率，这就得到了 Shapley mediator.

不妨设 $\sigma_i(X_1) \le \sigma_i(X_2) \le \cdots \le \sigma_i(X_N)$，特别地，$\sigma_i(X_0)=0$
$$
\mathbb P(\mathcal M(\boldsymbol X, u_i)=j)=\frac{\sigma_i(X_j)}{N}+\frac{1}{N!}\sum_{k=1}^{j-1} (\sigma_i(X_j)-\sigma_i(X_k)) \sum_{c=0}^{k-1}\binom{k-1}{c}(c+1)!(N-c-2)!
$$

虽然比原始的 Shapley Value 的指数级好很多，但是上面的式子在计算上复杂度仍然不优秀，事实上可以再做化简.

**Lemma** :
$$
\frac{1}{N!}\sum_{c=0}^{k-1}\binom{k-1}{c}\binom{N-1}{c+1}^{-1}=\frac{1}{(N-k)(N-k+1)}
$$

于是
$$
\mathbb P(\text {SM}(\boldsymbol X, u_i)=j)=\frac{\sigma_i(X_j)}{N}+\sum_{k=1}^{j-1}\frac{\sigma_i(X_j)-\sigma_i(X_k)}{(N-k)(N-k+1)}
$$

$$
\begin{aligned}
&\mathbb P(\text{SM}(\boldsymbol X,u_i)=j) - \mathbb P(\text{SM}(\boldsymbol X,u_i)=j-1)\\
&= \frac{\sigma_i(X_j)-\sigma_i(X_{j-1})}{N}+\sum_{k=1}^{j-1}\frac{\sigma_i(X_j)-\sigma_i(X_{j-1})}{(N-k)(N-k+1)}\\
&=\big(\sigma_i(X_j)-\sigma_i(X_{j-1})\big)\Big(\frac{1}{N}+\sum_{k=N-j+1}^{N-1}\frac{1}{k}-\frac{1}{k+1}\Big)\\
&=\frac{\sigma_i(X_j)-\sigma_i(X_{j-1})}{N-j+1}
\end{aligned}
$$

于是
$$
\mathbb P(\text{SM}(\boldsymbol{X}, u_i)=j)=\sum_{k=1}^{j} \frac{\sigma_i(X_k)-\sigma_i(X_{k-1})}{N-k+1}
$$

这时候就可以线性计算了，容易发现我们上面的公式依赖于排序，有没有更漂亮的算法？

### 如何求出概率分布

算法流程：从 $(0,1)$ 均匀随机选取一实数 $y$，取集合 
$$
\mathcal S = \{X_j:j \in [N], \sigma_i(X_j) \ge y\}
$$
从 $\mathcal S$ 中**均匀随机**选取一元素并返回即可.

正确性：返回 $\varnothing$ 的概率为 $\mathbb P(y > \sigma_i(\boldsymbol X))=1-\sigma_i(\boldsymbol X)$，符合要求.

返回 $X_j$ 的概率为
$$
\sum_{k=1}^{j} \mathbb P\Big(y \in \big(\sigma_i(X_{k-1}),\sigma_i(X_k)\big)\Big)\cdot \frac{1}{N-k+1}=\sum_{k=1}^{j}\frac{\sigma_i(X_k)-\sigma_i(X_{k-1})}{N-k+1}
$$
与先前的推导一致，并且在实现过程中**无需排序**，时间复杂度 $\mathcal O(N)$.

### 性质推导

**Proposition 1** SM 满足 **F**.

这个太平凡了，逐个性质验证即可.

**Theorem 2** Shapley mediator 下推荐系统是 Exact Potential Game.

首先介绍一下什么是  Exact Potential Game，简单来说就是可以构造出一个势函数，满足个体收益的变化与势函数的变化相同，可以类似地定义出另外两种 Potential Game.

对于一个 Game $G=\langle S_1,\cdots ,S_n, p_1, \cdots ,p_n \rangle$，我们称 $P:\prod_{i=1}^{n} S_i \to \mathbb R$ 是关于 $G$ 的势函数当且仅当

$\forall i \in [n],s_{-i} \in S_{-i},s_i\in S_i,s_i' \in S_i$ 都有
$$
p_i(s_i')-p_i(s_i)=P(s_i',s_{-i})-P(s_i,s_{-i})
$$
并称存在这样势函数的博弈为 **Exact Potential Game**，同时，若存在两个不同的势函数 $P_1,P_2$，那么一定存在常数 $c$ 使得 $P_1=P_2 + c$.

若 
$$
p_i(s'_i)-p_i(s_i) > 0 \Longleftrightarrow P(s'_i,s_{-i})-P(s_i,s_{-i})>0
$$
则称为 Ordinal potential Game.

定义权重向量 $\boldsymbol w = (w_1,\cdots ,w_n)$，其中 $w_i > 0$，若
$$
p_i(s_i')-p_i(s_i)=w_i\Big(P(s_i',s_{-i})-P(s_i,s_{-i})\Big)
$$
则称 $P$ 是 $G$ 的一个 $w$-potential function，$G$ 被称作 Weighted potential game.

下面要用到的只有 Exact potential game，考虑怎样的策略才是 PNE，显然这等价于此时的势函数是一个极大值点，并且如果存在最大值点，最大值点一定是 PNE，由此可知对于一个有限 Exact Potential Game，它一定存在 PNE.

事实上我们接下来不会直接构造出势函数，而是先证明它与 congestion game 等价，而 congestion game 必然是 exact potential，由此证毕.

所以什么是 congestion game（拥塞博弈）？形式化地，一个 congestion game 是一个多元组 $([N],\mathcal R,(S_i)_{i \in [N]},(w_r)_{r \in \mathcal R})$ ，其中

- $[N]$ 表示玩家构成的集合 $\{1,\cdots, n\}$
- $\mathcal R$ 表示资源构成的集合.
- $S_i$ 表示玩家 $i$ 所有可能的策略构成的集合，其中任一策略 $s_i \in S_i$ 是 $\mathcal R$ 的一个子集，表示此时玩家 $i$ 选择占据的资源集合.
- $w_r$ 是一个 $\mathbb N\to \mathbb R_+$ 的函数，设资源 $r \in \mathcal R$ 被 $k$ 个玩家占据，则此时该资源会给其中的每个玩家 $w_r(k)$ 的收益.
- 在策略 $\boldsymbol s$ 下玩家 $j$ 的总收益为 $\sum_{r \in s_j}w_r(k_r(\boldsymbol s))$，其中 $k_r(\boldsymbol s)=\sharp\{i \in [N]:r \in s_i\}$.

在 [Potential Games](https://www.researchgate.net/publication/230663805_Potential_Games) Theorem 3.1中，作者证明了 congestion game 必然是 potential game 并给出了势函数的构造
$$
P(\boldsymbol X)=\sum_{j\in \cup_{i=1}^{n}X_i}\sum_{l=1}^{\sigma_j(\boldsymbol X)}c_j(l)
$$
下面我们只需要证明 RGSM（recommendation games with the Shapley mediator） 可以嵌入到一个 congestion game，在任一策略下，玩家在两个博弈中获取的收益相同.

回到原始问题，定义 
$$
E=\{\sigma_i(l):i\in [n],l \in \mathcal L\} \cup \{0,1\}
$$
其原始数量不超过 $n|\mathcal L|+2$，所以 $E$ 是有限集，记其中元素升序排列为 $\epsilon_0,\cdots ,\epsilon_B$，$B=|E|-1$. 定义对应的 congestion game 的资源集合 $\mathcal R=\{r_m^i:m\in [B],i \in [n]\}$，对于 RGSM 的一个策略 $l\in \mathcal L$，对应 congestion game 的策略为 
$$
\mathcal A(l)=\{r_m^i:\sigma_i(l) \ge \epsilon_m,m \in [B],i \in [n]\}
$$
因此在该 congestion game 中，玩家 $j$ 的可选策略为
$$
S_j=\{\mathcal A(l):l\in \mathcal L_j\}
$$
规定该 congestion game 下资源 $r_m^i$ 对应的 $w$ 函数为
$$
w_m^i(x)=\begin{cases}
0\quad\text{if }x = 0\\
\cdots\\
\frac{\epsilon_m-\epsilon_{m-1}}{k}\quad \text{if }x = k\\
\cdots\\
\frac{\epsilon_m-\epsilon_{m-1}}{N}\quad \text{if }x=N
\end{cases}
$$
现在我们已经将这个 congestion game 完全定义好了，只需要证同一策略下两博弈中每个玩家收益相同，也即

**Lemma 2.** 对于每个玩家 $j$，其在 RGSM 中策略 $\boldsymbol X$ 下收益与在对应 congestion game 中策略 $\mathcal A(\boldsymbol X)$ 的收益相同.

只需证明
$$
\sum_{i=1}^{n}\mathbb P(\text{SM}(\boldsymbol X,u_i)=j)=\sum_{r_m^i \in \mathcal A(X_j)} w_m^i(k_m^i(\mathcal A(\boldsymbol X)))
$$
考虑固定用户 $i$，证明此时左式等于右式即可，为了方便，不妨设 $\sigma_i(X_1) \le \sigma_i(X_2) \le \cdots \le \sigma_i(X_N)$，考察右式：
$$
\begin{aligned}
\sum_{m=1}^{B}w_m^i(k_m^i(\mathcal A(\boldsymbol X)))\mathbb I_{r_m^i \in X_j}&=\sum_{m=1}^{\alpha} w_m^i(k_m^i(\mathcal A(\boldsymbol X)))\\
&=\sum_{m=1}^{\alpha}\frac{\epsilon_m-\epsilon_{m-1}}{k_m^i(\mathcal A(\boldsymbol X))}
\end{aligned}
$$
接着考察 $k_m^i(\mathcal A(\boldsymbol X))$ 的取值，它等于 $\sharp\{j:r_m^i \in \mathcal A(X_j)\}=\sharp\{j:\sigma_i(X_j) \ge \epsilon_m\}$

由于 $\sigma_i(X_1) \le \cdots \le \sigma_i(X_N)$，因此可以将分子中 $\epsilon_m$ 分为 $(\sigma_i(X_0),\sigma_i(X_1))$，$(\sigma_i(X_1),\sigma_i(X_2))$，$\cdots $，$(\sigma_i(X_{j-1}),\sigma_i(X_j))$ 这些部分，每部分的分母是相同的，这恰好就是
$$
\sum_{m=1}^{j}\frac{\sigma_i(X_m)-\sigma_i(X_{m-1})}{N-m+1}=\mathbb P(\text{SM}(\boldsymbol X,u_i)=j)
$$
证毕.

**Corollary 1.** SM 同时满足 **F** 和 **S**.

**Corollary 2.** 在 RGSM 下，任何玩家的改进都会收敛.

**Theorem 3** 给出了$\mathbb P(\text{SM}(\boldsymbol X,u_i)=j)$ 的线性计算公式以及相应算法，这在本文之前已经做过说明.

## SM 的唯一性

在文章最开始，我们说明了当对每个用户 $u_i$， $\sum_{j=1}^{N}\mathbb P(\mathcal M(\boldsymbol X,u_i)=j)$ 若为常数（complete），那么不可能再同时满足 Fair 与 Stability，于是我们这样规定上述求和的值.

**Efficiency**  向用户 $u_i$ 展示广告的概率就是 $u_i$ 在 $\boldsymbol X$ 中能够获取的最大满意度，也就是说 $\sum_{j=1}^{N} \mathbb P(\mathcal M(\boldsymbol X,u_i)=j)=\max_{j=1}^{N} \sigma_i(\boldsymbol X_j)$

上面性质简记为 **EF**，事实上，随便给一个满足 **F** 和 **C** 的 $\mathcal M$，定义 
$$
\mathbb P(\mathcal M'(\boldsymbol X,u_i)=j)=\mathbb P(\mathcal M(\boldsymbol X,u_i)=j)\cdot \sigma_i(\boldsymbol X)
$$
就可以得到一个满足 **F** 和 **EF** 的 mediator，不过如果还想满足 **S**，我们就有如下定理.

**Theorem 4** 同时满足 **F**, **S**, **EF** 的 mediator **有且仅有** SM.

首先，每个用户是独立的，对于每个用户我们只关心其 $\boldsymbol \sigma$ 长什么样，因此我们只需要证明对于任意 $\boldsymbol \sigma$，$\mathcal M_i(\boldsymbol \sigma)=\text{SM}_i(\boldsymbol\sigma)$，并且不失一般性地，不妨设 $\sigma^1 \le \sigma^2 \le \cdots \le \sigma^N$.

**Observation 1.** 如果 $\boldsymbol \sigma$ 仅包含一个非零项，那么 $\mathcal M_i(\boldsymbol \sigma)=\text{SM}_i(\boldsymbol \sigma)$.

**Lemma 4.** 当 $N=2$ 时结论成立.

首先 $\text{SM}(\sigma^1, \sigma^2)=\left(\frac{\sigma^1}{2},\sigma^2-\frac{\sigma^1}{2}\right)$，设 $\epsilon > 0$，分两类讨论：

- $\mathcal M(\sigma^1,\sigma^2)=\left(\frac{\sigma^1}{2}+\epsilon,\sigma^2-\frac{\sigma^1}{2}-\epsilon\right)$
- $\mathcal M(\sigma^1,\sigma^2)=\left(\frac{\sigma^1}{2}-\epsilon,\sigma^2-\frac{\sigma^1}{2}+\epsilon\right)$

原论文对于两类分别给出一个构造使得  PNE 不存在，不过第一类的构造是错误的...

因此，若 $\boldsymbol \sigma$ 包含至多两个非零元素，$\mathcal M=\text{SM}$ 依然成立.

**Lemma 5.** 设 $0 \le \sigma^1{}' \le \sigma_1 \le \sigma_2 \le \cdots \le \sigma^N$，那么 $\mathcal M_1(\boldsymbol \sigma^{-1},\sigma^1{}') + \frac{\sigma^1-\sigma^1{}'}{N}=\mathcal M_1(\boldsymbol \sigma)$.

证法依旧是证明当等式不成立时可以构造出一个不存在 PNE 的情况.

**Corollary 4.** 对于任意 $\boldsymbol \sigma$，$\mathcal M_1(\boldsymbol \sigma)=\text{SM}_1(\boldsymbol \sigma)=\frac{\sigma^1}{N}$.

**Lemma 6.** 设 $0 \le \sigma^1{}' \le \sigma^1 \le \cdots \le \sigma^k{}' \le \cdots \le \sigma^N{}' \le \sigma^N \le 1$，若 $\mathcal M$ 满足  **F**，**S** 和 **EF**，那么
$$
\mathcal M_k(\boldsymbol \sigma^{-k},\sigma^k{}')+\frac{\sigma^k-\sigma^k{}'}{N-k+1}=\mathcal M_k(\boldsymbol \sigma)
$$

## SM 下的 PoA 与 UPoA

The Price of Anarchy(PoA) 定义如下：
$$
PoA_{\mathcal M}=\frac{\max_{\boldsymbol X \in \prod_j \mathcal L_j} V(\boldsymbol X)}{\min _{\boldsymbol X\in E_{\mathcal M}}V(\boldsymbol X)} \ge 1
$$
衡量了 PNE 局面下最差的 $V(\boldsymbol X)$ 与所有决策中最优 $V(\boldsymbol X)$ 的比值. 

**Theorem 5** 在 SM 下，PoA 不会很差，不超过 $\frac{2N-1}{N}$，完全可以接受.

现在考虑 SM 下 user utility 会不会很劣，首先考虑用户  $u_i$，若最终向他展示的是 $l$，那么其 utility 被自然地定义为 $\sigma_i(l)$，因此我们声称 mediator $\mathcal M$ 在策略 $\boldsymbol X$ 下的期望 utility 为
$$
U_{\mathcal M}(\boldsymbol X)=\sum_{i=1}^{n}\sum_{j=1}^{N} \mathbb P(\mathcal M(\boldsymbol X,u_i)=j)\sigma_i(X_j) + \sum_{i=1}^{n} \mathbb P(\mathcal M(\boldsymbol X,u_i)=\varnothing)\sigma_i(\varnothing)
$$
定义 User Price of Anarchy $UPoA_{\mathcal M}$ 为
$$
UPoA_{\mathcal M}=\frac{\max_{\mathcal M',\boldsymbol X\in \prod_j \mathcal L_j}U_{\mathcal M'}(\boldsymbol X)}{\min_{\boldsymbol X\in E_{\mathcal M}}U_{\mathcal M}(\boldsymbol X)}
$$

---

注意这里分子枚举了所有可能的 mediator $\mathcal M'$  

**为什么？**

一种可能的解释：PoA 考虑相同 mediator 下，可能走到的最劣均衡状态可能多差；UPoA 则考虑特定 mediator 最劣会有多差，实际上条件更强.

---

**Proposition 2** 如果 $\sigma_i(\varnothing)=0$，那么 $UPoA_{\text{SM}}$ 无界.

 **Proposition 3** 如果 $\sigma_i(\varnothing)=0$，那么 $UPoA_{\text{TOP}}$ 也无界.

**Proposition 4** 如果 $\sigma_i(\varnothing)=1$，那么 $UPoA_{\text{SM}} \le 4$.

事实上，$\sigma_i(\varnothing)=1$ 更符合逻辑，对应用户更偏好无广告的纯净模式.
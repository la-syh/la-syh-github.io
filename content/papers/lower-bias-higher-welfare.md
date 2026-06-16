---
title: Lower Bias, Higher Welfare
subtitle: How Creator Competition Reshapes Bias-Variance Tradeoff in Recommendation Platforms?
date: 2026-05-26T23:13:26+08:00
slug: 32ea983
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

[文章链接](https://arxiv.org/abs/2511.20289)

<!--more-->

## Motivation

传统推荐系统再调整正则化参数 $\lambda$ 时，只考虑统计意义上的 bias-variance tradeoff，但在真实的平台中，创作者会根据推荐算法策略性调整内容，论文想要研究：一旦考虑创作者竞争，平台应该如何重新选择 bias-variance tradeoff？

换句话说，如果平台忽略创作者的策略反应，选出了一个在静态数据上看起来很好的 $\lambda$，但它放在真实的环境中就可能出现问题，平台调节 bias-variance tradeoff 时不能只看静态预测效果，而必须考虑创作者竞争对内容生态和用户福利的反馈影响.

**核心结论**：在有创作者策略性竞争的推荐平台中，平台应该选择更弱的正则化，也就是向更低 bias 的用户表示学习；相比非策略环境，策略环境下的最优正则化参数更小. 这个结论的直觉也很自然，如果正则化太强，用户画像会被拉到更主流平均的方向，创作者又会迎合这一画像导致内容进一步同质化，最终降低用户福利.

## Model

考察一个有 $m$ 个用户和 $n$ 个内容的推荐系统，设 $u_i \in \mathbb R^d$ 和 $v_j \in \mathbb R^d$ 分别表示用户 $i$ 和内容 $j$ 的潜在特征向量，并规定 $\boldsymbol{u}=(u_1,\cdots ,u_m)$，$\boldsymbol{v}=(v_1,\cdots ,v_n)$. 当这些潜在特征向量已知，平台就可以直接计算对于每个用于最相关的内容，但实际上 $\boldsymbol{u},\boldsymbol{v}$ 必须从已知的交互数据中自行估计.

用户与内容的交互可以表示为一个偏好矩阵 $R \in \mathbb R^{m \times n}$，其中 $R_{i,j}$ 表示用户 $i$ 关于内容 $j$ 的交互信息，可以认为

$$
R_{i,j}=\boldsymbol{u_i}^T\boldsymbol{v_j}+\epsilon_{i,j}
$$

其中 $\epsilon_{i,j}$ 是均值为 $0$ 的独立同分布随机噪声，因此用户 $i$ 的特征可以通过最小化

$$
L_i(\boldsymbol{u})=\sum_{j=1}^{n}(R_{i,j}-\boldsymbol{u}^T\boldsymbol{v_j})^2+\lambda \|\boldsymbol{u}\|_2{}^2
$$

来得到，套用最小二乘即可得到在正则化参数 $\lambda$ 下用户 $i$ 的特征

$$
\hat{\boldsymbol{u}}_i(\lambda)=\left( \sum_{j=1}^{n}\boldsymbol{v_j}\boldsymbol{v_j}^T+\lambda \boldsymbol{I} \right)^{-1}\left( \sum_{j=1}^{n}R_{i,j}\boldsymbol{v_j} \right)
$$

同样的，我们记 $\hat{\boldsymbol{u}}(\lambda) = (\hat{\boldsymbol{u}}_1(\lambda),\cdots ,\hat{\boldsymbol{u}}_m(\lambda))$，在不引起歧义的情况下可以将参数 $\lambda$ 略去.

### Content Creator Competition with Bias-Variance Tradeof

给定了 $\boldsymbol{u},\boldsymbol{v}$，再指定一个评估内容特征和用户特征的函数 $\sigma:\mathbb R^d \times \mathbb R^d \to \mathbb R^+$，如上面采用的内积，此时在推荐系统 $RM$ 下
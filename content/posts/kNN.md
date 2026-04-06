---
title: KNN
subtitle:
date: 2026-04-06T10:28:57+08:00
slug: c70cf40
draft: false
description:
keywords:
comment: true
weight: 0
tags:
  - 机器学习
categories:
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

本文介绍了 kNN 算法并依此实现了一个基于 MNIST 数据集的简单数字识别算法.

<!--more-->

## kNN 算法

kNN（k-Nearest Neighbours）是一个简单直观的算法，在样本量足够大的情况下可以用来做分类或回归任务.

**输入：** 实例 $\boldsymbol x$，训练集 $T=\{(\boldsymbol x_1,y_1),\cdots, (\boldsymbol x_N,y_N)\}$，其中 $\boldsymbol x_i \in \mathbb R^n$，$y_i\in\{c_1,\cdots ,c_K\}$ 表示 $\boldsymbol x_i$ 的类别.

**输出：** 实例 $\boldsymbol x$ 所属类别 $y$.

kNN 算法简单直接：找出距离 $\boldsymbol x$ 最近的 $k$ 个点，那么 $\boldsymbol x$ 的类别就是这些点中最多的那一类，形式化地，设 $N_k(\boldsymbol x)$ 表示距离 $\boldsymbol x$ 最近的 $k$ 个点构成的集合，
$$
y=\arg\max_{c_j} \sum_{\boldsymbol x_i \in N_k(\boldsymbol x)}\mathbb I(y_i=c_j)
$$
kNN 没有显式的学习过程，并且距离的定义也可以自由选择，通常选用欧氏距离即可. 当数据各维量纲不同，直接计算距离可能导致某个特征的重要性远大于其他特征，为了避免这种情况，计算距离时可以对数据归一化，假设 kNN 使用的样本特征为 $(x_{i,1},\cdots ,x_{i,n}),i\in[m]$，取 $M_j=\max_{i=1}^{m}x_{i,j}-\min_{i=1}^{m}x_{i,j}$，那么
$$
\|\boldsymbol u, \boldsymbol v\|=\sqrt{\sum_{i=1}^{n}\left(\frac{u_i}{M_i}-\frac{v_i}{M_i}\right)^2}
$$

> [!TIP]
>
> 当 $k=1$ 时，模型受噪声影响会很大，容易发生过拟合，当 $k=N$ 时，模型总是会输出样本中最多的类别，模型过于简单，实际上我们通常选取一个较小的 $k$ 值，采用交叉验证法来选取最优的 $k$.

上面所说是用 kNN 做分类，实际上也可以用来做回归任务，用类似的想法，考察最近的 $k$ 个邻居标签的平均值或加权平均即可，更近的邻居可以分配更高的权重，例如 $\frac{1}{dist}$.

## kNN 的实现

最暴力的实现无非是将所有点按照到 $\boldsymbol x$ 的距离排序，这样做复杂度并不优秀，当 $N$ 和维度较大时很慢，不过相当容易实现. 实际上我们可以借助 kD-Tree 完成这项工作（找到距离某点最近的 $k$ 个点），kD-Tree 的算法原理不是本文的重点. 下面给出暴力排序的示例实现，并介绍 scikit-learn 中的 kNN 用法.

```python {.line-wrapping, name="kNN", title="kNN 暴力实现"}
# kNN
import numpy as np
from collections import Counter

class kNN:
    def __init__(self, k: int = 3):
        self.k = k
        self.X_train = None
        self.y_train = None
    def dist(self, u, v):
        return np.sum(np.square(u - v))
    def fit(self, X, y):
        # 训练
        self.X_train = np.array(X)
        self.y_train = np.array(y)
    def _predict_single(self, x):
        # 单个样本预测
        dist = np.sum((self.X_train - x) ** 2, axis = 1)
        top_k = self.y_train[np.argpartition(dist, self.k)[:self.k]]
        return Counter(top_k).most_common(1)[0][0]
    def predict(self, X):
        # 对一组样本预测
        return np.array([self._predict_single(x) for x in X])
    def score(self, X, y):
        X = np.array(X)
        y = np.array(y)
        predictions = self.predict(X)
        return np.sum(predictions == y) / len(y)
```

```python
from sklearn import neighbors
neighbors.KNeighborsClassifier(n_neighbors=5, weights=’uniform’, algorithm=’auto’, leaf_size=30, p=2, metric=’minkowski’, metric_params=None, n_jobs=1)
```

这就创建了一个 kNN，其中参数含义如下：

| 参数        | 含义                                               | 默认值              |
| ----------- | -------------------------------------------------- | ------------------- |
| n_neighbors | 上文中的 $k$                                       | 5                   |
| weights     | 权重                                               | 'uniform'，等权加权 |
| algorithm   | 选取的算法，有ball_tree、kd_tree、brute、auto四种  | 'auto'              |
| leaf_size   | kD-Tree 或 ball-Tree 叶子结点的大小                | 30                  |
| metric, p   | 距离函数的选项                                     | 欧氏距离            |
| n_jobs      | 并行计算的线程数量，赋为 -1 可调用所有核心并行计算 | None                |

在这之后我们就可以向它提供数据

```python
neighbors.KNeighborsClassifier.fit(X,y)
```

之后可以做的操作有

```python
neighbors.KNeighborsClassifier.kneighbors(X=None, n_neighbors=None, return_distance= True) 
# 返回距离 X 最近的 n_neighbors 个点的距离和下半，若 n_neighbors=None 则使用 n_neighbors

y = neighbors.KNeighborsClassifier.predict(X)
# 预测，输入一个 [x_1,x_2...]，返回对应的预测值 [y_1,y_2,...]

neighbors.KNeighborsClassifier.predict_proba(X)
# 概率预测，输出一个二维 float 矩阵 p[i][j] 表示 X_i 是第 j 类的概率，各类别按照字典序排序

neighbors.KNeighborsClassifier.score(X, y, sample_weight=None)
# 返回正确率
```

现在可以借助 kNN 和 MNIST 数据集做一个简单的数字识别：

> [!NOTE] MLAPP Exercise 1.1, kNN classiﬁer on shuffled MNIST data
>
> Run `mnist1NNdemo` and verify that the misclassiﬁcation rate (on the ﬁrst 1000 test cases) of MNIST of a 1-NN classiﬁer is 3.8%. (If you run it all on all 10,000 test cases, the error rate is 3.09%.) Modify the code so that you ﬁrst randomly permute the features (columns of the training and test design matrices), as in `shuffledDigitsDemo`, and then apply the classiﬁer. Verify that the error rate is not changed.

```python {.line-wrapping, name="基于 kNN 的数字识别"}
# %%
import numpy as np
from sklearn import neighbors

# 修改 load_mnist_images 里的返回值
def load_mnist_images(filename):
    with open(filename, 'rb') as f:
        magic, num, rows, cols = np.fromfile(f, dtype='>i4', count=4)
        images = np.fromfile(f, dtype=np.uint8)
        # 转换成 float32 并归一化到 0-1 之间
        return images.reshape(num, rows * cols).astype(np.float32) / 255.0

def load_mnist_labels(filename):
    with open(filename, 'rb') as f:
        # 读取文件头：magic number (4 bytes), num_items (4 bytes)
        magic, num = np.fromfile(f, dtype='>i4', count=2)
        # 读取标签数据
        labels = np.fromfile(f, dtype=np.uint8)
        return labels

# %%
# 1. 加载数据
X_train = load_mnist_images('MNIST/train-images-idx3-ubyte/train-images-idx3-ubyte')
y_train = load_mnist_labels('MNIST/train-labels-idx1-ubyte/train-labels-idx1-ubyte')
X_test = load_mnist_images('MNIST/t10k-images-idx3-ubyte/t10k-images-idx3-ubyte')
y_test = load_mnist_labels('MNIST/t10k-labels-idx1-ubyte/t10k-labels-idx1-ubyte')

# 2. 抽样
X_test_small = X_test[:1000]
y_test_small = y_test[:1000]

# %%
# 3. 运行 1-NN
model = neighbors.KNeighborsClassifier(n_neighbors = 1)
model.fit(X_train, y_train)

accuracy = model.score(X_test_small, y_test_small)
print(f"1-NN 在 MNIST 抽样集上的准确率: {accuracy:.2%}")

accuracy = model.score(X_test, y_test)
print(f"1-NN 在 MNIST 完整测试集上的准确率: {accuracy:.2%}")
```

预期结果：

```markdown
1-NN 在 MNIST 抽样集上的准确率: 96.20%
1-NN 在 MNIST 完整测试集上的准确率: 96.91%
```


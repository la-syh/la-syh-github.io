# 图片自动编号与交叉引用

## 推荐写法

```go-html-template
{{< figure
  src="/images/example.svg"
  label="fig:example"
  title="我的注释"
>}}
```

页面中会按出现顺序显示 `Figure 1: 我的注释`。编号不写进 Markdown；在前面插入、删除或移动图片后，编号会自动更新。

`label` 是交叉引用使用的稳定标识。建议统一采用 `fig:` 前缀，并在一篇文章内保持唯一。引用时直接在普通正文中写：

```text
如 Figure \ref{fig:example} 所示。
```

它会显示成可点击的 `Figure 1`，点击后跳到图片。也可以写 `\figref{fig:example}`，它会自动生成完整的 `Figure 1`：

```text
如 \figref{fig:example} 所示。
```

不要把交叉引用放进数学定界符中；它应写在普通正文里。

## 其他写法

`caption` 和 `title` 都能提供图注，`caption` 的优先级更高，并且支持 Markdown 与行内数学公式：

```go-html-template
{{< figure src="/images/example.svg" label="fig:example" caption="参数 $a$ 的变化" >}}
```

常用参数：

| 参数 | 用途 |
| --- | --- |
| `src` | 图片地址，必填 |
| `label` | 稳定的交叉引用标签，推荐使用 `fig:` 前缀 |
| `title` / `caption` | 图注；`caption` 优先 |
| `alt` | 无障碍替代文字；默认从图注生成 |
| `width` / `height` | 图片尺寸 |
| `class` | 添加到 `<figure>` 的 CSS 类 |
| `link` | 点击图片后打开的地址 |
| `target` / `rel` | 图片链接的对应 HTML 属性 |
| `loading` | 图片加载策略，默认为 `lazy` |
| `attr` / `attrlink` | 图片来源及其链接 |
| `prefix` | 单张图片的编号前缀，例如 `图` |
| `numbered=false` | 保留图注但不参与自动编号 |

整篇文章改用中文前缀，可在 front matter 中设置：

```yaml
figurePrefix: 图
```

全站默认值在 `config/_default/params.toml` 的 `[page].figurePrefix` 中。

带标题的标准 Markdown 图片也会自动编号：

```markdown
![替代文字](/images/example.svg "我的注释")
```

标准 Markdown 图片没有 `label` 参数；需要交叉引用或更完整的尺寸、来源、链接控制时，请使用 `figure` shortcode。

原有的 FixIt `image` shortcode 也兼容自动编号和交叉引用，参数名保持不变，只需按需增加 `label`：

```go-html-template
{{< image src="/images/example.png" label="fig:example-image" caption="我的注释" >}}
```

它和 `figure` 使用同一个编号序列，也可通过 `numbered=false` 排除编号。`image` 会继续使用 FixIt 的响应式图片处理和点击放大能力。

在不方便直接写反斜杠命令的上下文中，还可以用 shortcode 生成完整引用：

```go-html-template
{{< figref "fig:example" >}}
```

引用不存在时会显示红色的 `??`；重复的 `label` 会在浏览器控制台给出警告，并让引用指向第一次出现的位置。代码块、行内代码、数学公式和带有 `data-no-figure-refs` 属性的区域不会被处理。

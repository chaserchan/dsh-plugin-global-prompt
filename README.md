<div align="center">

# dsh-plugin-global-prompt

在 **DSH（DeepSeek Harness）设置 → 通用设置** 中配置一段**全局 Prompt**——它会被注入到每一次对话（含子代理）的系统提示词里。保存即生效，留空即停用。

[![npm](https://img.shields.io/npm/v/dsh-plugin-global-prompt?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/dsh-plugin-global-prompt)
[![Downloads](https://img.shields.io/npm/dt/dsh-plugin-global-prompt?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/dsh-plugin-global-prompt)
[![License](https://img.shields.io/github/license/chaserchan/dsh-plugin-global-prompt?style=flat&colorA=000000&colorB=000000)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-chasechan%2Fdsh--plugin--global--prompt-21b7a3?style=flat&colorA=000000&colorB=000000)](https://gitee.com/chasechan/dsh-plugin-global-prompt)
[![GitHub](https://img.shields.io/badge/GitHub-chaserchan%2Fdsh--plugin--global--prompt-181717?style=flat&logo=github&logoColor=ffffff&colorA=000000&colorB=000000)](https://github.com/chaserchan/dsh-plugin-global-prompt)

</div>

不想每次开新会话都重复交代同一段要求？写在这里，一次配置，全局生效。

## 为什么用它

- **真正的全局**：注入**每一次**对话的系统提示词——主会话、子代理（subagent）、之后新开的会话全部覆盖；
- **保存即生效**：设置写入 `$DSH_HOME/settings.yaml`（热加载），下一条回复就带上，无需重启 DSH；
- **零负担**：留空 = 不注入，没有独立的开关、没有额外配置项；
- **克制**：只出现在系统提示词里，不污染对话历史，不覆盖 DSH 自身的 persona。

## 安装与启用

```sh
# 1. 安装到 web profile
dsh plugin --profile web add dsh-plugin-global-prompt

# 2. 在 $DSH_HOME/profiles/web/cordis.patch.yml 追加启用行
# - insert:
#     - id: global-prompt
#       name: 'dsh-plugin-global-prompt'

# 3. 重启 dsh web
dsh web
```

## 快速开始

1. 打开设置 → **通用设置**，找到 **全局 Prompt** 输入框；
2. 输入，例如 `始终使用中文回答，先给结论，再解释理由。`；
3. 停顿片刻看到「已保存」，然后**新开一个会话**或直接发消息——要求已生效。

> 想确认注入生效？把全局 Prompt 写成 `回复前先输出【全局Prompt已生效】`，下一条回复会立刻给你答案。

## 拿来即用：一套可直接上手的全局 Prompt

下面这套是作者自用的全局 Prompt（基于"四象决策协议"），可直接复制进输入框，也可以当作起点裁剪成你自己的风格：

```md
# 全局 Agent Prompt

你是一个务实、严谨、以结果为导向的 AI Agent。你的目标不是多解释，而是把任务推进到行动、证据或明确选择。

## 0. 语言偏好

始终优先使用中文回复用户。

只有在以下情况保留或切换为其他语言：
- 用户明确要求使用其他语言
- 代码、命令、API、错误日志、引用原文必须保留原语言
- 专有名词翻译会造成歧义

## 1. 四象决策协议

四象法则是内部决策器，不是回复模板。除非用户要求，不要机械打印象限分析。

每次行动前，先在内部判断当前任务属于哪一类：

### 1.1 共同已知：直接执行

如果目标、上下文、约束和成功标准已经足够清楚，直接行动。

不要为了显得谨慎而反复确认。
不要把明确任务变成讨论题。

### 1.2 我知用户不知：暴露风险与选项

如果你发现用户可能不知道的风险、约束、错误前提或更优路径，要清楚指出。

可以挑战用户的前提，但必须给出可执行建议。
不要只反驳，不给下一步。

### 1.3 用户知我不知：少问关键问题

如果任务必须依赖用户的私人偏好、业务判断、现实约束或目标取舍，最多问 3 个高价值问题。

优先只问 1 个最关键的问题。

不要询问可以通过文件、日志、代码、工具、搜索、运行验证得到的信息。

### 1.4 共同未知：最小验证实验

如果双方都缺少证据，不要假装确定。

提出最小验证实验，并说明：
- 要验证什么
- 怎么验证
- 成功标准是什么
- 失败后下一步是什么

## 2. 执行原则

- 能执行就执行，不能执行才提问。
- 能验证就验证，不靠猜测下结论。
- 假设会影响结果时，必须明确说出假设。
- 优先使用已有信息、已有文件、已有工具和实际输出。
- 不要声称完成，除非已经有证据。
- 遇到阻塞时，说清楚真实阻塞、已有证据、下一步最小动作。

## 3. 工程任务纪律

做代码、配置、文档或系统修改时，遵守以下规则：

- 先理解现有上下文，再改动。
- 改动必须尽量小，直接服务用户请求。
- 不做无关重构。
- 不添加"以后可能用得上"的抽象、配置或框架。
- 优先标准库、平台原生能力和项目已有依赖。
- 不覆盖用户已有改动。
- 修改后做最小可运行验证。
- 如果无法验证，明确说明没有验证以及原因。

## 4. 信息与证据

涉及事实、版本、价格、政策、法律、市场、新闻、接口文档、库行为等可能变化的信息时，必须优先查证。

如果没有查证，只能说"基于当前上下文/记忆/已有信息"，不能装作最新事实。

引用外部信息时，给出来源。
引用本地结果时，给出文件路径、命令结果或关键证据。

## 5. 回复风格

- 中文优先，直接、具体、少废话。
- 先给结论，再给必要依据。
- 不要输出长篇流程，除非用户要求。
- 不要机械展示"四象法则"。
- 不要用空泛安慰、套话或过度解释。
- 用户要方案时，给可执行方案。
- 用户要结果时，给结果和验证证据。
- 用户要判断时，说明依据、风险和不确定项。

## 6. 默认工作流

处理任务时按这个顺序：

1. 判断是否已有足够上下文。
2. 如果足够，直接执行。
3. 如果缺少用户独有信息，问最少的问题。
4. 如果发现风险或错误前提，直接指出并给建议。
5. 如果双方都缺证据，设计最小验证。
6. 完成后报告结果、改动和验证证据。

核心目标：把模糊推进为行动，把未知推进为证据，把分歧推进为明确选择。
```

> 复制进去后留空即停用，随时可以换成你自己的版本——这套只是一个经过实战打磨的起点。

## 行为与配置

| 项 | 值 |
|---|---|
| 设置 namespace | `global-prompt`（对应 `$DSH_HOME/settings.yaml` 的 `global-prompt:` 段） |
| 字段 | `text`（string，上限 20000 字符） |
| 注入位置 | 系统提示词段落 `user:global-prompt`（order 5，位于 deployment persona 之后） |
| 生效时机 | 每次模型步进重新求值——保存后对下一条回复生效 |
| 停用方式 | 清空文本（空段落会被系统提示词渲染器过滤） |
| 卸载 | 删除 `cordis.patch.yml` 中的启用行并移除包；残留设置无副作用 |

## 开发

本地开发建议用目录链接安装（link 方式**不会**自动装依赖，需先在插件目录内安装）：

```sh
pnpm install
dsh plugin --profile web add <本仓库目录>
```

### 组成

| 文件 | 职责 |
|---|---|
| `lib/index.js` | 服务端半区：注册 settings namespace 与动态 `systemPrompt.section` |
| `lib/client.js` | 浏览器半区：「通用设置」行 UI（多行 textarea、防抖自动保存、保存状态提示，中英文文案） |

## 发布（维护者）

```sh
# npm（本机默认 registry 是 npmmirror，发布必须显式指定官方源；需要 bypass-2FA 的 granular token）
npm publish --registry=https://registry.npmjs.org/

# 同步双仓库
git push origin main    # Gitee (ssh)
git push github main    # GitHub (https)
```

## License

[MIT](LICENSE) © 2026 逐鹿科技

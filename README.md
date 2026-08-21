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

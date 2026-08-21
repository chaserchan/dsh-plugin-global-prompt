# dsh-plugin-global-prompt

DSH 插件：在「设置 → 通用设置」中新增一栏多行输入框，用于配置**全局 Prompt**；该内容会作为系统提示词的一个段落注入到**每一次对话（含子代理）**中，保存后对下一条回复立即生效。

## 组成

| 文件 | 作用 |
|---|---|
| `lib/index.js` | 服务端半区：注册 settings namespace `global-prompt`（字段 `text`，上限 20000 字符），并以动态 `systemPrompt.section`（`user:global-prompt`，order 5，位于 deployment persona 之后）注入每次模型步进 |
| `lib/client.js` | 浏览器半区：注册「通用设置」行（`settings.general.item` 槽），多行 textarea，防抖自动保存，保存状态提示，中英文文案 |

## 安装与启用

```sh
# 1. 安装进 web profile（等价于在 $DSH_HOME/profiles/web 下 pnpm add 本目录）
dsh plugin --profile web add D:\job\developer\DSH\plugin\global-prompt

# 2. 在 $DSH_HOME/profiles/web/cordis.patch.yml 追加一行启用
# - insert:
#     - id: global-prompt
#       name: 'dsh-plugin-global-prompt'

# 3. 重启 dsh web 使其生效
dsh web
```

## 行为

- 留空 = 不注入（空段落会被系统提示词渲染器过滤）；
- 设置写入 `$DSH_HOME/settings.yaml` 的 `global-prompt:` 段，文件热加载，无需重启；
- 卸载插件：删除 `cordis.patch.yml` 中的行并移除包即可，残留设置无副作用。

## 设计边界

- 只注入系统提示词，不前置到用户消息、不污染对话历史；
- 不覆盖 deployment persona（`deployment:persona`），在其后叠加；
- 无独立启用开关：空文本即停用。

# AGENTS.md

本文件定义本项目的专属协作约定。  
全局通用行为遵循全局 `AGENTS.md`；本文件只补充本项目特有规则。

## AI 主导协作方式

用户是编程小白。Claude Code 应作为项目主导者推进，而不是被动等待用户逐步下命令。

协作要求：

- Claude 应主动判断下一步最应该做什么，并带领用户推进项目。
- 优先使用 brainstorming skill 进行需求澄清、方案设计、MVP 范围收敛和任务拆解。
- 在开始写代码前，应先完成需求澄清、MVP 定义、页面规划、技术方案和开发任务拆分。
- 当需要用户做决定或补充信息时，应优先使用 AskUserQuestion。
- AskUserQuestion 每次只问 1 个问题，并提供 3-5 个普通人能懂的选项。
- 如果某个选择会明显增加开发难度、维护成本或部署复杂度，应提醒用户。
- 如果用户提出的功能不适合第一版 MVP，应使用苏格拉底式提问帮助用户重新判断是否必要。
- 优先选择简单、稳定、适合新手、容易维护、容易部署的方案。
- 简单、低风险的技术细节可以由 Claude 自行决定；重大决策必须先询问用户。

重大决策包括但不限于：

- 选择或更换主要技术栈
- 引入数据库
- 引入登录 / 权限系统
- 引入支付功能
- 引入新的部署平台或外部服务
- 大规模重构项目结构
- 删除或重写大量已有代码


## 项目管理文档真源

本项目采用 `planning/` 目录作为项目管理文档真源体系。

最小目录契约如下：

- `planning/README.md`
- `planning/glossary.md`
- `planning/backlog/README.md`
- `planning/backlog/active/README.md`
- `planning/backlog/active/feat-{seq}-{slug}/PRD.md`
- `planning/backlog/active/feat-{seq}-{slug}/execution-plan.md`
- `planning/backlog/active/feat-{seq}-{slug}/acceptance-checklist.md`
- `planning/backlog/active/feat-{seq}-{slug}/decision-<topic>.md`
- `planning/backlog/active/feat-{seq}-{slug}/handoff-<topic>.md`
- `planning/backlog/accepted/README.md`
- `planning/backlog/archive/README.md`

文档职责约定：

- `PRD.md`：唯一需求真源
- `execution-plan.md`：唯一实施拆解与推进真源
- `acceptance-checklist.md`：唯一验收面板，不承担任务拆解职责
- `decision-<topic>.md`：记录局部设计决策、边界补充、被否决方案与历史判断
- `handoff-<topic>.md`：记录窄范围续做与交接，不扩展产品边界
- 各级 `README.md`：仅作索引、摘要与导航，不承担真源职责

执行要求：

- 若本次任务涉及需求变更、实施推进、验收状态变化、关键设计决策或续做交接，必须优先更新对应真源文档，而不是只写在对话中。
- 若项目已经存在相关 feature 目录，应优先在原有目录下继续更新，不另起一套平行记录。
- 新增 feature 时，遵循统一编号与命名格式：`feat-{seq}-{slug}`。

## 设计规范真源

设计规范属于项目管理文档真源的一部分，统一纳入 `planning/` 体系管理。

推荐约定：

- `planning/design-guidelines.md`：项目级通用设计规范
- `planning/backlog/active/feat-{seq}-{slug}/design-guidelines.md`：feature 级专项设计规范

优先级约定：

1. feature 级设计规范
2. 项目级设计规范
3. 项目已有实现
4. 临时对话说明

执行要求：

- 若任务涉及 UI、交互、样式、组件、文案或设计系统，开始实现前必须先检查相关设计规范，再进行修改。
- 若项目已存在可复用组件、页面模式、样式变量或交互约定，应优先复用和遵循，不得擅自另起一套。
- 若设计规范缺失、过期或与现有实现冲突，应先指出冲突，再决定实现方式，不得跳过检查直接编码。

## 开发与交付约定

- 默认遵循通用 `workflow.md` 推进任务。
- 涉及代码交付时，遵循标准 Git 流程：`git-commit -> git-pr -> git-merge`。
- commit 必须保持原子性，禁止将无关改动混入同一提交。
- 需要回滚时，优先使用 `git-rollback` 的 `revert` 模式，不使用破坏性历史回退作为常规手段。

## 质量与验收

- 能写自动化测试就写。
- 无法自动化时，必须提供清晰的手动验证步骤。
- 涉及外部 I/O（网络、文件、数据库）时，应考虑超时、取消、重试，或明确说明不处理的理由与风险。
- 日志、报错、调试输出中不得泄露密钥、Token、隐私或其他敏感信息。
- 验收结论应尽量附带证据，例如测试结果、命令输出摘要、代码位置或截图。

## 改动边界

- 仅修改与当前任务直接相关的代码和文档。
- 不顺手重构、清理或美化无关内容。
- 若发现已有历史问题、死代码或不一致实现，可提示，但不要擅自扩大改动范围。
- 每一处改动都应能追溯到当前需求、当前 feature 或当前验收项。

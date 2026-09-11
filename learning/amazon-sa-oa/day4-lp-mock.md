# Day 4 — Technical Experience + Work Style + 全真模拟

目标：把技术判断与 Amazon 的工作方式连接起来，并完成一次 60 分钟连续模拟。

## 1. Work Style 不要“猜 Amazon 喜欢什么”

正确策略是：理解 Leadership Principles 后保持稳定一致。

当前最值得优先掌握：

- Customer Obsession：从客户目标倒推方案
- Ownership：对结果负责，不把问题推给别人
- Learn and Be Curious：主动学习未知技术
- Insist on the Highest Standards：不接受明显低质量结果
- Bias for Action：对可逆决策快速行动
- Earn Trust：透明、尊重、承认错误
- Dive Deep：深入数据和根因
- Have Backbone; Disagree and Commit：有依据地提出异议，决定后全力执行
- Deliver Results：在约束下把关键结果交付
- Invent and Simplify：复杂问题尽量形成简单、可复用机制

完整官方列表见 Amazon Leadership Principles 页面。

## 2. Work Style 常见选择逻辑

优先表现：

- 先理解客户真实需求，而不是直接推技术
- 主动承担责任并推进闭环
- 数据与事实优于拍脑袋
- 出现异常时深入根因，而不是只修表面
- 对安全、质量问题不为了赶时间而视而不见
- 可逆决策可以快速试验，不需要无限讨论
- 有不同意见时可以明确提出，但决策后执行
- 失败时承认并总结机制性改进

避免表现：

- “不是我的职责”
- 为了和气不指出明显问题
- 只追求短期速度，无视长期风险
- 指标和实际反馈冲突时只相信指标
- 为展示能力而过度复杂化

## 3. Technical Experience 的回答骨架

即使不是口头面试，也应该把自己的技术经历整理成固定结构：

```text
Situation: 当时系统/项目处于什么状态？
Task: 我的具体责任是什么？
Action: 我怎样分析、选择和执行？
Result: 结果是什么？
Learning: 后来建立了什么机制或得到什么教训？
```

重点在 **Action**。不要把回答变成团队介绍。

## 4. 你的 6 个优先故事

下面只写故事骨架，正式使用时必须用真实事实和真实结果补充。

### Story 1 — Framework 2 多模块系统稳定性

可对应：Ownership / Dive Deep / Deliver Results。

主线：复杂 Agent/优化系统出现崩溃、候选失效、恢复问题 → 通过日志和模块边界定位 → 建立正式 validation / recovery / typed outcome 等机制 → 系统稳定性提高。

### Story 2 — 不接受“看似有效”的算法改动

可对应：Insist on the Highest Standards / Are Right, A Lot / Dive Deep。

主线：某机制表面上有解释力 → 通过 held-out、重复性或真实实验发现证据不足 → 主动否定原方案 → 保留更可靠基线。

### Story 3 — 从复杂方案退回简单可靠机制

可对应：Invent and Simplify / Customer Obsession。

主线：设计一度变复杂 → 发现复杂度没有带来可验证收益 → 收缩机制、冻结可靠部分 → 降低系统脆弱性。

### Story 4 — AI 作为协作工具而非决策者

可对应：Learn and Be Curious / Ownership。

主线：用 AI 加速文献、代码审查和实验诊断 → 所有关键假设仍用真实数据验收 → 拒绝未经验证的建议。

### Story 5 — 超声图像质量模型跨 session 验证

可对应：Dive Deep / Highest Standards。

主线：训练指标改善并不等于泛化成立 → 使用 held-out session 检查 → 发现限制 → 停止继续堆复杂模块。

### Story 6 — 时间/算力受限下的实验决策

可对应：Bias for Action / Frugality / Deliver Results。

主线：资源有限 → 先设计能改变科学决策的最小实验 → 不做低价值 ablation → 快速决定保留/淘汰方向。

## 5. 每个故事必须准备的数字

至少记住真实的：

- 问题规模
- 你负责的模块
- 做了什么改变
- 前后差异
- 最终决策

如果记不清数字，宁可讲可确认的定性结果，也不要编造精确指标。

## 6. 全真模拟

今天至少做一次连续 60 分钟模拟。

### 0–40 min — Technical Simulation

- 从 `practice.md` 随机选 12–15 题
- 不查资料
- 每题先判断，再写一句理由
- 遇到不确定题不能无限停留

### 40–50 min — Technical Experience

随机抽 3 个问题，每题 3 分钟：

1. 描述一次你定位复杂技术问题的经历。
2. 描述一次你不同意原方案并用证据改变方向的经历。
3. 描述一次你快速学习陌生技术并完成交付的经历。

### 50–60 min — Work Style

用下面冲突对做快速判断：

- 速度 vs 完美：可逆决策倾向快速行动；高风险不可逆决策要充分验证。
- 和气 vs 异议：有事实依据时提出异议，决策后 commit。
- 短期结果 vs 长期客户价值：优先长期客户价值。
- 表面修复 vs 根因：优先 root cause 和机制性修复。
- 自己团队 vs 公司整体：Ownership 跨团队边界。

## 7. 模拟复盘只看三类错误

### Knowledge gap

例如不知道 NAT / Multi-AZ / RDS / cache。

处理：回 Day 1/2 补概念。

### Reasoning gap

知道所有服务，但没先识别客户目标。

处理：强制写 `Goal → Risk → Choice → Trade-off`。

### Consistency gap

Work Style 前后价值判断矛盾。

处理：回到 Leadership Principles，不背具体题答案。

## 8. 正式 OA 前检查

- 预留至少 1 小时完整、不被打断的时间
- 使用稳定网络与桌面/笔记本电脑
- 浏览器与弹窗设置符合邮件要求
- 正式开始后不要截图、复制、粘贴
- 每一部分完成后等待系统自动跳转，不主动关页面
- 如果技术故障，按招聘邮件要求重新登录/联系招聘团队

## 9. 最终通过标准

正式 OA 前应做到：

- `quick-reference.md` 中 90% 内容可闭卷解释
- `practice.md` 场景题至少做两轮
- 第二轮核心题正确判断 ≥ 80%
- 六个项目故事至少能各用 60–90 秒讲清楚
- 能用一句话解释至少 10 个 Leadership Principles
- 完成一次 60 分钟不中断模拟

# Day 3 — Technical Simulation 场景判断

目标：把前两天的知识变成**快速决策能力**。Technical Simulation 的关键不是背 AWS 名词，而是面对客户场景时识别目标、风险与 trade-off。

## 1. 固定六步法

每一道架构题都按下面顺序走：

### Step 1 — 找 Customer Goal

先问“客户真正要什么”：

- availability？
- lower latency？
- security/compliance？
- scale？
- lower cost？
- faster migration / less ops？

不要看到关键词就直接选服务。

### Step 2 — 找约束

关注：

- traffic pattern：稳定还是突发
- data model：关系型还是 key-value
- public/private
- RTO/RPO
- global or regional
- budget
- operational capability

### Step 3 — 先排除危险方案

典型危险信号：

- single point of failure
- production DB exposed to internet
- no backup
- all workloads in one AZ
- hard-coded credentials
- manually scale during unpredictable traffic
- security sacrificed only for convenience

### Step 4 — 选择最简单满足需求的方案

优先：

- managed service
- elastic architecture
- stateless compute
- clear separation of public/private layers
- automation

不要为了展示技术而过度设计。

### Step 5 — 检查 failure mode

问自己：

- 一台机器坏了呢？
- 一个 AZ 坏了呢？
- DB 主节点坏了呢？
- traffic ×10 呢？
- 下游变慢呢？
- credential 泄露呢？

### Step 6 — 用 Well-Architected 做最后复核

至少检查：

```text
Security
Reliability
Performance
Cost
Operational simplicity
```

## 2. “最有效方案”常见信号

### 流量突增

优先想到：

- horizontal scaling
- ALB
- Auto Scaling
- queue for asynchronous workloads
- CDN/cache where appropriate

### 高可用

优先想到：

- Multi-AZ
- remove single points
- health checks
- automated failover
- backup/restore

### 全球低延迟

优先想到：

- CloudFront
- Route 53 routing
- region strategy if dynamic workloads really require it

### 数据库读取瓶颈

优先想到：

- cache
- read replica
- optimize access pattern

不要把“加大主数据库实例”当唯一方案。

### 数据库高可用

优先想到 Multi-AZ/failover，而不是只加 read replica。

### 突发异步任务把下游压垮

优先想到 SQS / queue 解耦。

### 尽量少维护服务器

优先考虑 managed services / serverless，但必须满足运行时约束。

## 3. 安全题的优先级

面对安全问题，顺序通常是：

1. stop / contain dangerous exposure
2. least privilege
3. encrypt data in transit and at rest
4. use roles rather than hard-coded long-term credentials
5. log / monitor / audit
6. automate prevention

如果一个选项“性能更快”但要求公开敏感数据库，通常不是好 trade-off。

## 4. Reliability vs Performance vs Cost

### Reliability

客户说：不能停机。

你应该愿意为 redundancy 付额外成本。

### Performance

客户说：全球用户静态内容慢。

CDN 比单纯升级 EC2 更贴近根因。

### Cost

客户说：每天只运行少量事件任务。

serverless / scale-to-demand 比大型常驻实例更合理。

核心：**根据业务目标决定优先级，而不是永远选最贵/最高规格。**

## 5. Technical Simulation 常见错误

### 错误 1：只看技术，不看客户

SA 的职责不是展示“我知道更多 AWS 服务”，而是把技术选择映射到客户目标。

### 错误 2：过早使用复杂架构

如果单 Region Multi-AZ 已能满足需求，不应无理由直接 multi-region active-active。

### 错误 3：把 scaling 当 reliability 的全部

Auto Scaling 不能替代 backup、Multi-AZ、failure recovery。

### 错误 4：看到读慢就升级数据库

可能真正需要 cache/read replica/CDN/优化 query。

### 错误 5：只解决当前故障，不解决机制

Amazon 风格更偏向：修复问题 + 找 root cause + 建机制避免复发。

## 6. 评分选项时的思考方式

如果题目要求评价方案 effectiveness，可使用：

- **Highly effective**：直接解决根因，符合约束，风险小。
- **Effective**：有帮助但不是最完整，或存在小 trade-off。
- **Limited**：只缓解症状，没解决核心问题。
- **Ineffective / harmful**：增加风险、违反约束或完全偏题。

注意：具体 OA 的量表文字以正式页面为准。

## 7. 今天的训练方式

1. 先做 [`practice.md`](practice.md) 前 10 题，不看答案。
2. 每题限制 90 秒。
3. 每题必须说出：`Goal → Risk → Choice → Trade-off`。
4. 对错题回到 Day 1/2 定位知识缺口。
5. 再做剩余题。

## 8. Day 3 通过标准

如果下面问题仍需翻资料，今天不能结束：

- 单 AZ 架构为什么危险？
- private subnet 实例如何访问互联网？
- ALB/NLB 怎么选？
- Multi-AZ/read replica 怎么选？
- S3/EBS/EFS 怎么选？
- RDS/DynamoDB 怎么选？
- 什么时候 queue 比直接同步调用更好？
- 什么时候 cache/CDN 更可能解决根因？
- RTO/RPO 如何影响 DR 方案？
- 一个方案为什么可能“技术上能跑，但不是好的 SA 答案”？

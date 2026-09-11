# Day 2 — 计算、高可用、存储与数据库

目标：看到业务需求后，能快速判断该选哪类 compute / storage / database，并识别高可用和扩展性问题。

## 1. EC2 与 Auto Scaling

EC2 是虚拟服务器。

你需要理解：

- Instance type 决定 CPU / memory / network 等资源特征
- EC2 可放在多个 Availability Zone
- 单台 EC2 是单点故障
- Auto Scaling Group 可以根据需求扩缩实例数量

### Horizontal vs Vertical Scaling

Vertical scaling：给单机加 CPU / RAM。

优点：简单。

缺点：存在上限；仍可能单点。

Horizontal scaling：增加机器数量。

优点：弹性、高可用，更适合 Web 服务。

前提：应用最好尽量 stateless。

典型答案：

```text
ALB + Auto Scaling Group + Multi-AZ
```

## 2. Availability Zone 与 Multi-AZ

Region 包含多个物理隔离的 Availability Zone。

核心思想：**不要把关键服务全部放在单一 AZ。**

遇到“一个机房故障仍需服务”的题，应想到 Multi-AZ。

注意：Multi-AZ 主要解决高可用/故障切换，不等于“自动提高所有读取性能”。

## 3. Containers 与 Serverless

### Container

容器封装应用及依赖。

AWS 中常见概念：ECS / EKS。

适合：

- 微服务
- 需要较多运行环境控制
- 长时间运行服务
- 已经容器化的应用

### Lambda

事件驱动 Serverless compute。

适合：

- 短时任务
- 流量变化大
- 事件驱动
- 不希望管理服务器

场景信号：

> 每天只有少量文件上传，需要自动做处理。

Lambda 往往比常驻 EC2 更自然。

不要极端化：不是“Lambda 永远更好”。持续高负载、特殊运行时、长执行任务可能更适合容器/EC2。

## 4. 解耦与异步处理

当 Producer 的流量会突然暴增，而 Consumer 处理能力有限，应想到队列。

典型：

```text
Producer → SQS → Consumer workers
```

收益：

- 削峰填谷
- 解耦
- 失败重试
- 独立扩缩消费者

如果题目出现“突发流量导致下游崩溃”，队列通常是高价值选项。

## 5. S3 / EBS / EFS

### S3 — Object Storage

适合：

- 图片、视频、日志、备份
- 静态网站资源
- 大量对象
- 高持久性数据

不是传统本地磁盘文件系统。

### EBS — Block Storage

像挂在一台 EC2 上的磁盘。

适合：

- OS volume
- database volume
- 需要 block-level storage 的单机工作负载

### EFS — Shared File System

多个计算节点可以共享的文件系统。

适合：

- 多台实例需要共享文件
- POSIX-like file access

快速选择：

```text
object → S3
single-instance block disk → EBS
shared filesystem → EFS
```

## 6. Relational vs NoSQL

### RDS / Aurora

关系数据库。

适合：

- 结构化数据
- SQL
- transaction
- 表之间关系明显
- 需要 ACID 语义

### DynamoDB

Managed NoSQL key-value / document database。

适合：

- 超大规模
- access pattern 较明确
- 低延迟
- 高并发
- 灵活 schema

不要按“数据量大 = NoSQL”机械选择。首先看数据模型、查询模式、一致性和事务需求。

## 7. Multi-AZ vs Read Replica

这是高频混淆点。

### Multi-AZ

主要目标：**高可用 / failover**。

### Read Replica

主要目标：**扩展读取能力**，也可支持读负载分离。

因此：

- “数据库主节点坏了怎么办？” → Multi-AZ / failover
- “读取流量太大怎么办？” → Read Replica / Cache

## 8. Cache

常见服务：ElastiCache（Redis / Memcached）。

适合：

- 热点数据
- 重复读取
- session / ephemeral data
- 降低数据库压力

典型架构：

```text
App → Cache → DB
```

不要缓存不可接受陈旧的数据而不考虑一致性。

## 9. Backup、Replication、RTO、RPO

### Backup

用于恢复历史状态，防误删、损坏、灾难。

### Replication

复制数据到另一个实例/AZ/Region，提高可用性或读取能力。

### RTO

Recovery Time Objective：允许服务中断多久。

RTO 越小，要求恢复越快。

### RPO

Recovery Point Objective：最多能接受丢失多长时间的数据。

RPO 越小，允许的数据丢失越少。

场景：

> RTO 5 分钟、RPO 接近 0。

仅“每天备份一次”显然不够。

## 10. Well-Architected 六个维度

AWS Well-Architected Framework 的六个 pillars：

1. Operational Excellence
2. Security
3. Reliability
4. Performance Efficiency
5. Cost Optimization
6. Sustainability

OA 场景里重点先用前五个思考。

### Reliability

- 消除单点
- Multi-AZ
- Auto Scaling
- backup / restore
- failure recovery

### Security

- least privilege
- encryption in transit / at rest
- private resources
- 不公开数据库
- 不使用长期 hard-coded credential

### Performance

- cache
- CDN
- scale horizontally
- 选合适 compute / database

### Cost

- 不长期运行无必要资源
- Auto Scaling
- Serverless for intermittent workloads
- 根据真实需求 right-size

### Operations

- monitoring
- logs
- automation
- reproducible deployment

重要：**Security 通常不是为了省钱或性能而随意牺牲的维度。**

## 11. 常见架构模式

### 高流量 Web App

```text
Route 53
→ CloudFront
→ ALB
→ Auto Scaling EC2 across multiple AZs
→ ElastiCache
→ RDS Multi-AZ
```

### 静态网站/媒体

```text
Route 53
→ CloudFront
→ S3
```

### 突发异步任务

```text
API
→ SQS
→ Auto Scaling workers / Lambda
→ Database
```

### 文件上传自动处理

```text
S3 upload event
→ Lambda
→ processed output to S3 / DB
```

## 12. 今日必须闭卷回答

1. Scale up 和 scale out 有什么区别？
2. 为什么 stateless 服务更容易 horizontal scaling？
3. Multi-AZ 和 Read Replica 的目标分别是什么？
4. S3 / EBS / EFS 怎么选？
5. RDS 与 DynamoDB 的根本选择依据是什么？
6. Cache 能解决什么问题？会引入什么风险？
7. SQS 为什么能保护下游系统？
8. Lambda 适合什么，不适合什么？
9. RTO 与 RPO 分别是什么意思？
10. 如果只允许你检查一个架构是否危险，你会先找哪些单点和公网暴露？

## 13. 今日输出

闭卷完成下面两个任务：

### Task A

设计一个面向全球用户、流量波动很大的 Web 服务，要求高可用、静态内容快速加载、数据库不暴露公网。

至少画出：DNS / CDN / LB / compute / cache / DB。

### Task B

分别用一句话解释为什么下面选择不合理：

- 全部服务放一个 AZ
- DB security group 开 `0.0.0.0/0`
- 静态图片每次都从应用服务器动态读取
- 为每天运行 5 次、每次 2 秒的任务常驻一台大型 EC2
- 读流量过高时只增加 Multi-AZ，不考虑 replica/cache

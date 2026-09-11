# Amazon Solutions Architect OA — 4 天冲刺

目标岗位：**Solutions Architect, Early Career – [2026-2027], Shenzhen**（Job ID `10490165`）

## 已确认的 OA 结构

以 2026-09-11 收到的 Amazon China Student Program 预通知为准：

| 环节 | 时长 | 本知识库的准备重点 |
| --- | ---: | --- |
| Technical Simulation | 40 min | 网络、云架构、存储/数据库、可靠性、安全、性能、成本与场景判断 |
| Technical Experience | 10 min | 面对技术问题时的分析方法、项目经历与技术取舍 |
| Work Style | 10 min | Amazon Leadership Principles 与稳定一致的工作风格判断 |

当前邮件**没有 Coding Assessment**，因此本轮不把 LeetCode 作为主要投入。如果正式 OA 链接显示额外模块，以正式邮件为准再调整。

## 通过目标

四天后至少达到：

1. 看到常见云架构场景，能在 60–90 秒内识别主要问题和优先方案。
2. 能解释 VPC / Subnet / Route / IGW / NAT / Security Group / Load Balancer / DNS 的基本关系。
3. 能在 EC2 / Container / Lambda，S3 / EBS / EFS，RDS / DynamoDB / Cache 之间做基本选择。
4. 能用 Reliability / Security / Performance / Cost 等维度解释架构 trade-off，而不是只背 AWS 产品名。
5. 准备好至少 6 个自己的项目故事，应对 Technical Experience 与 Work Style。

## 四天顺序

### Day 1 — 网络与 VPC
阅读：[`day1-networking.md`](day1-networking.md)

重点：TCP/IP、DNS、HTTP/HTTPS、CIDR、VPC、Subnet、Route、IGW、NAT、Security Group、NACL、ALB/NLB、CloudFront。

### Day 2 — 计算、高可用、存储与数据库
阅读：[`day2-cloud-data.md`](day2-cloud-data.md)

重点：EC2、Auto Scaling、Multi-AZ、容器、Lambda、S3/EBS/EFS、RDS/Aurora、DynamoDB、Cache、Backup、Replication、RTO/RPO。

### Day 3 — Technical Simulation 场景判断
阅读：[`day3-scenarios.md`](day3-scenarios.md) + [`practice.md`](practice.md)

重点：建立固定决策流程，并完成原创场景题。

### Day 4 — Technical Experience + Work Style + 全真模拟
阅读：[`day4-lp-mock.md`](day4-lp-mock.md) + [`quick-reference.md`](quick-reference.md)

重点：Leadership Principles、项目故事、60 分钟整套模拟和考前检查。

## 时间安排

建议每天 **4–6 小时**：

- 2–3 h：学习必会知识
- 1–1.5 h：场景练习
- 0.5–1 h：闭卷复述 / 错题整理

如果最终只有 **3 天**：Day 1 与 Day 2 各压缩到 3–4 小时；Day 3 保持完整；Day 4 的 LP/模拟并入 Day 3 晚间，**不要牺牲场景练习**。

## 做题总原则

遇到 Technical Simulation 场景时按这个顺序：

1. **客户目标是什么？** 可用性、延迟、成本、安全、扩展性还是迁移速度？
2. **有哪些硬约束？** 流量、数据类型、合规、预算、RTO/RPO。
3. **先排除明显风险。** 单点故障、公开数据库、长期静态密钥、无备份、单 AZ。
4. **优先简单、托管、可扩展方案。** 不为不存在的问题过度设计。
5. **最后检查 trade-off。** Reliability / Security / Performance / Cost / Operations。

## 权威资料

优先使用官方资料，不需要把文档通读完：

- Amazon 深圳岗位：https://www.amazon.jobs/en/jobs/10490165/solutions-architect-early-career-2026-2027-shenzhen
- Amazon Leadership Principles：https://www.amazon.jobs/content/en/our-workplace/leadership-principles
- AWS Well-Architected Framework：https://docs.aws.amazon.com/wellarchitected/latest/userguide/waf.html
- AWS VPC 文档：https://docs.aws.amazon.com/vpc/
- Elastic Load Balancing：https://docs.aws.amazon.com/elasticloadbalancing/
- Amazon S3：https://docs.aws.amazon.com/s3/
- Amazon RDS：https://docs.aws.amazon.com/rds/

本目录中的练习题均为**针对知识点自行编写的练习**，不是实际 OA 泄题或回忆题。

# Amazon SA OA — Quick Reference

用于 Day 4 和正式 OA 前最后复习。目标是**看关键词立即联想到架构方向**。

## Network / VPC

| 需求 | 首要联想 |
| --- | --- |
| DNS | Route 53 |
| 全球静态内容低延迟 | CloudFront |
| HTTP/HTTPS path/host routing | ALB |
| TCP/UDP、高吞吐低延迟 | NLB |
| 私网实例主动访问互联网 | NAT Gateway |
| 公网双向连接入口 | Internet Gateway + public route |
| instance-level stateful firewall | Security Group |
| subnet-level stateless rules / explicit deny | NACL |
| 数据库不应公网暴露 | private subnet + restricted SG |

## Compute

| 需求 | 首要联想 |
| --- | --- |
| 通用长期服务器 | EC2 |
| 流量波动 | Auto Scaling |
| 消除单 AZ 风险 | Multi-AZ |
| 容器化长期服务 | ECS / EKS |
| 短时、事件驱动、低运维 | Lambda |
| 上下游解耦、削峰 | SQS |

## Storage

| 需求 | 首要联想 |
| --- | --- |
| object / image / video / logs / backup | S3 |
| EC2 block disk | EBS |
| 多实例共享文件系统 | EFS |

## Database

| 需求 | 首要联想 |
| --- | --- |
| SQL / transaction / relations | RDS / Aurora |
| key-value / document / massive scale / predictable access pattern | DynamoDB |
| DB failover / HA | Multi-AZ |
| read scaling | Read Replica |
| 热点重复读取 | ElastiCache |

## Reliability

- remove single points of failure
- multiple AZs
- health check + automatic failover
- backup and restore
- Auto Scaling for variable demand
- queue to absorb bursts

## Security

- least privilege
- no public production DB unless truly required
- TLS in transit
- encryption at rest
- IAM roles instead of hard-coded credentials
- log / monitor / audit

## Performance

- CDN for global static content
- cache repeated reads
- horizontal scale
- right database for access pattern
- reduce unnecessary synchronous dependencies

## Cost

- right-size
- scale with demand
- serverless for intermittent workloads
- avoid idle overprovisioned resources
- do not sacrifice required reliability/security merely to save cost

## RTO / RPO

- RTO = 最长可接受**恢复时间**
- RPO = 最多可接受**数据丢失时间窗口**

越接近 0，方案通常越昂贵、越需要实时复制/快速 failover。

## 最常见混淆

```text
Multi-AZ ≠ Read Replica
HA/failover     read scaling

IGW ≠ NAT Gateway
public bidirectional     private outbound

ALB ≠ NLB
L7 HTTP/HTTPS     L4 TCP/UDP

S3 ≠ EBS ≠ EFS
object   block   shared file

Vertical scaling ≠ Horizontal scaling
bigger machine    more machines
```

## 场景判断 20 秒模板

```text
1. Customer goal?
2. Hard constraint?
3. Main risk/root cause?
4. Simplest managed/scalable solution?
5. Security + reliability check?
6. Performance/cost trade-off?
```

## Amazon Work Style 关键词

- Customer Obsession → 从客户倒推
- Ownership → 端到端负责
- Invent and Simplify → 简化、机制化
- Are Right, A Lot → 判断 + 主动寻找反证
- Learn and Be Curious → 主动学习
- Highest Standards → 不放过质量问题
- Bias for Action → 可逆决策快速行动
- Earn Trust → 坦诚、尊重、承认问题
- Dive Deep → 查根因、看细节
- Disagree and Commit → 有依据反对，决定后执行
- Deliver Results → 在约束下交付关键结果

## 考前 5 分钟

1. 不再学新服务。
2. 复述 VPC → ALB → compute → cache → DB 链路。
3. 复述 Multi-AZ / Replica / Cache 区别。
4. 回忆 6 个自己的项目故事。
5. Work Style 保持原则一致，不猜“标准答案”。

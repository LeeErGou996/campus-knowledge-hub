# Amazon SA OA — 场景练习题

这些题是根据网络、云架构和 Solutions Architect 常见决策维度**自行编写的训练题**，不是实际 OA 泄题。

做题规则：第一轮每题 ≤ 90 秒；先写 `Goal → Risk → Choice → Trade-off`，再看答案。

---

## 1. 突发流量

某 Web 应用只有一台 EC2，促销时流量会突然增长 10 倍，平时负载很低。最主要的问题与改进方向是什么？

**答案：** 单点故障 + 无弹性。优先采用 ALB + Auto Scaling，并跨多个 AZ 部署。不要只把现有 EC2 升级成更大的实例。

## 2. 私网服务器访问互联网

应用服务器必须位于 private subnet，但需要定期从公网下载软件更新。

**答案：** private subnet route → NAT Gateway → Internet Gateway。不要给应用服务器直接暴露公网入口。

## 3. 数据库公网暴露

生产数据库 security group 允许来自 `0.0.0.0/0` 的数据库端口访问。

**答案：** 高风险。数据库应放 private subnet，并仅允许应用层 security group 或明确可信来源访问。

## 4. 全球图片访问慢

用户主要读取静态图片，亚洲用户很快，美洲和欧洲用户延迟很高。

**答案：** CloudFront/CDN 更直接解决全球静态内容延迟；源站可使用 S3。

## 5. HTTP 路由

希望 `/api/*` 转发 API 服务，`/media/*` 转发另一组服务。

**答案：** ALB，因其支持 Layer 7 的 host/path routing。

## 6. 大量 TCP 连接

服务需要处理大量 TCP 长连接，主要关注低延迟和高吞吐，并不需要 HTTP 路由。

**答案：** NLB 更自然，因为它工作在 Layer 4。

## 7. 读请求成为瓶颈

关系数据库写入正常，但大量重复读取导致响应变慢。

**答案：** 先考虑 ElastiCache 与/或 Read Replica，根据数据一致性和查询类型决定；不是只扩大主实例。

## 8. 数据库主节点故障

客户首要目标是数据库实例故障后快速恢复，不关注提升读取吞吐。

**答案：** RDS Multi-AZ / automatic failover 更符合目标；Read Replica 主要用于读取扩展。

## 9. 订单系统

订单包含用户、支付、商品等关系，需要事务和复杂 SQL 查询。

**答案：** RDS/Aurora 类关系数据库更自然。

## 10. 高规模 key-value

系统根据 user ID 读取简单 profile，访问模式明确，需要极高并发和低延迟。

**答案：** DynamoDB 是强候选；最终仍需结合一致性、查询模式和成本约束。

## 11. 多实例共享文件

多台应用实例必须同时访问同一个 POSIX 风格共享文件系统。

**答案：** EFS。S3 是 object storage，EBS 更像单实例块存储。

## 12. 文件上传后处理

用户每天随机上传文件，每个文件处理只需几秒，绝大多数时间没有任务。

**答案：** S3 event → Lambda 是高匹配方案，按需运行，减少常驻服务器运维和空闲成本。

## 13. 下游被压垮

订单请求会突然爆发，后台处理服务速度较慢；同步调用导致后台崩溃。

**答案：** 在 Producer 和 Consumer 间引入 SQS 等队列，削峰、解耦并允许消费者独立扩缩。

## 14. 一个 AZ 故障

业务要求单个 AZ 故障不能使整个 Web 服务不可用。

**答案：** ALB + 跨多个 AZ 的 compute；数据库也应考虑 Multi-AZ。仅做 Auto Scaling 但全部在单 AZ 不足够。

## 15. 备份频率不足

客户每天凌晨做一次数据库备份，但要求最多只能丢失 5 分钟数据。

**答案：** 当前 RPO 无法满足。需要更连续的备份/复制机制；一天一次备份的潜在数据丢失窗口接近 24 小时。

## 16. 成本过高

开发环境 EC2 24/7 运行，但团队每天只在工作时间使用。

**答案：** 考虑调度停止、right-sizing、按需/serverless 等。首先根据真实使用模式消除空闲资源。

## 17. Hard-coded credentials

应用源代码包含长期 AWS access key。

**答案：** 风险高。使用 IAM Role / temporary credentials，并轮换和移除已暴露的长期密钥。

## 18. 指标正常但客户投诉

监控显示平均响应时间正常，但大量客户反馈某个地区很慢。

**答案：** 不应只相信平均指标。Dive Deep：按地域/请求路径拆分指标、日志和 tracing，验证客户反馈与聚合指标差异。

## 19. 团队想直接上 multi-region active-active

一个内部工具只服务单一办公室，可接受几小时恢复时间，但团队希望直接做跨三 Region active-active “保证先进性”。

**答案：** 过度设计。先根据实际 RTO/RPO 和用户范围选择最简单满足要求的架构；Multi-AZ + backup 可能已足够。

## 20. 客户说“系统慢”

客户只说系统慢，希望你立刻建议换更大服务器。

**答案：** 不应直接给方案。先澄清 workload、瓶颈、延迟发生在哪一层、流量模式和性能目标，再决定 compute/cache/database/network 哪一层需要调整。

---

# 第二轮综合题

## 21. 电商 Web 架构

要求：全球用户、突发流量、静态图片很多、订单数据需要事务、单 AZ 故障不能停机。

**参考架构：**

```text
Route 53
→ CloudFront
→ ALB
→ Auto Scaling app across multiple AZs
→ ElastiCache（适用时）
→ RDS/Aurora Multi-AZ

Static objects → S3
```

核心理由：CDN 降低全球静态内容延迟；ASG 承担弹性；Multi-AZ 消除单 AZ 单点；关系数据库满足订单事务。

## 22. 异步媒体处理

大量用户上传视频，转码耗时长，上传 API 不能因为转码慢而阻塞。

**参考思路：** 上传对象存 S3；任务消息放入 queue；worker fleet 根据 backlog 扩缩。不要让上传请求同步等待转码完成。

## 23. 高安全内部系统

系统只供公司内部使用，包含敏感数据，没有公网访问需求。

**参考思路：** private networking、least privilege、加密、受控入口、日志审计。不要为了方便直接开放公网。

## 24. Disaster Recovery

业务允许最多丢 1 小时数据（RPO=1h），服务可在 4 小时内恢复（RTO=4h），预算有限。

**参考思路：** 不需要默认使用昂贵 active-active。根据目标设计定期备份/复制与可验证 restore 流程即可，关键是方案真实满足 RPO/RTO。

---

# 自测评分

第一轮：

- 0–12：知识缺口较大，回 Day 1/2。
- 13–16：基本掌握，但需要加强场景判断。
- 17–20：可进入综合题。

第二轮目标：核心 20 题至少 **16/20** 能在 90 秒内给出正确方向并解释主要 trade-off。

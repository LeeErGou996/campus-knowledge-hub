# Day 1 — 网络与 VPC

目标：把“用户请求如何进入云端服务”这条链路讲清楚，并能判断常见网络架构问题。

## 1. 必会主链路

先建立这个心智模型：

```text
User
  ↓ DNS
Route 53
  ↓
CloudFront / WAF（可选）
  ↓
Load Balancer
  ↓
EC2 / ECS / EKS / Lambda
  ↓
Cache
  ↓
Database / Storage
```

OA 场景题不是考你背产品名，而是问：**请求怎么进来、流量怎么分发、故障怎么隔离、数据怎么保护。**

## 2. TCP/IP 与常见协议

### TCP vs UDP

TCP：面向连接、可靠、有序、重传。适合 HTTP/HTTPS、数据库连接等。

UDP：无连接、低开销、不保证到达与顺序。适合 DNS 查询、实时音视频等对延迟敏感场景。

### 需要认识的端口

- 22：SSH
- 53：DNS
- 80：HTTP
- 443：HTTPS

不要求死背大量端口，但看到 80/443/53 要立即知道用途。

### HTTP / HTTPS

HTTPS = HTTP over TLS。

TLS 主要解决：

- 加密：防止窃听
- 完整性：防止内容被篡改
- 身份验证：通过证书确认服务端身份

如果题目问敏感数据公网传输，HTTPS/TLS 通常是基本要求，而不是可选优化。

## 3. DNS

DNS 将域名解析为目标地址。

关键概念：

- A record：域名 → IPv4
- CNAME：域名 → 另一个域名
- TTL：DNS 缓存持续时间
- Route 53：AWS 托管 DNS 服务，也可用于健康检查与路由策略

场景信号：

- 全球用户访问 → DNS + CDN / 多区域策略
- 故障切换 → 健康检查 + failover routing
- 延迟优化 → latency-based routing 可能有帮助

## 4. VPC、Subnet 与 CIDR

### VPC

VPC 是 AWS 中逻辑隔离的虚拟网络。

你需要知道：

- VPC 有 CIDR 地址范围
- VPC 内可建立多个 Subnet
- Subnet 位于单个 Availability Zone
- Route Table 决定流量下一跳

### CIDR

例如：

```text
10.0.0.0/16
```

`/16` 表示网络前缀长度。前缀越长，可用地址空间越小。

OA 重点通常不是手算复杂子网，而是理解：

- 不同 subnet 需要避免 CIDR 重叠
- 私有地址不能直接通过 Internet Gateway 被互联网主动访问

## 5. Public vs Private Subnet

决定一个 Subnet 是否“public”的关键是它的 Route Table 是否有指向 Internet Gateway 的公网路由。

典型架构：

```text
Internet
  ↓
Internet Gateway
  ↓
Public Subnet: ALB / NAT Gateway
  ↓
Private Subnet: App EC2 / ECS
  ↓
Private Subnet: Database
```

最佳实践思路：

- 对公网入口最小化
- 应用服务器尽量放 private subnet
- 数据库通常不直接暴露公网

## 6. Internet Gateway 与 NAT Gateway

### Internet Gateway (IGW)

允许 VPC 中具有公网路由和公网地址的资源与互联网双向通信。

### NAT Gateway

让 **private subnet 中实例主动访问互联网**，例如下载补丁、调用外部 API；互联网不能通过 NAT 主动发起连接进入这些实例。

高频判断：

> 私有 EC2 需要下载安装包，但不能被互联网直接访问。

优先思路：private subnet → NAT Gateway → IGW。

## 7. Security Group vs Network ACL

### Security Group

- 绑定到实例/ENI
- Stateful
- 主要配置 allow 规则
- 返回流量自动允许

### Network ACL

- 作用于 Subnet
- Stateless
- 可 allow / deny
- 入站与出站需分别配置

常见优先级：

日常工作负载访问控制通常首先使用 **Security Group**；需要 subnet 级显式 deny 时再考虑 NACL。

## 8. Load Balancer

### ALB

Application Load Balancer：Layer 7。

适合：

- HTTP / HTTPS
- 按 host/path 路由
- Web API / microservices

### NLB

Network Load Balancer：Layer 4。

适合：

- TCP / UDP
- 超高吞吐与低延迟
- 需要保留网络层特性

高频判断：

- `/api` 与 `/images` 路由不同服务 → ALB
- 大量 TCP 连接、低延迟 → NLB

## 9. CloudFront / CDN

CloudFront 将内容缓存到靠近用户的边缘节点。

适合：

- 全球用户
- 静态内容
- 图片/视频/网页资源
- 降低源站压力
- 降低延迟

典型组合：

```text
User → CloudFront → S3
```

或者：

```text
User → CloudFront → ALB → App
```

## 10. Day 1 场景判断模板

### 场景 A

网站流量突然增长，当前只有一台 EC2。

问题：单点故障 + 无弹性。

优先方案：

```text
ALB + Auto Scaling + Multi-AZ
```

### 场景 B

App server 不允许公网访问，但需要访问第三方 API。

优先方案：

```text
Private Subnet → NAT Gateway → Internet Gateway
```

### 场景 C

全球大量用户下载静态图片。

优先方案：

```text
S3 + CloudFront
```

### 场景 D

数据库收到来自 `0.0.0.0/0` 的公网访问规则。

判断：高风险。数据库应位于 private subnet，并通过 Security Group 只允许应用层访问。

## 11. 今天必须能闭卷回答

1. VPC、Subnet、Route Table 各自是什么？
2. Public Subnet 和 Private Subnet 的本质区别是什么？
3. IGW 和 NAT Gateway 有什么区别？
4. Security Group 为什么叫 stateful？
5. ALB 和 NLB 怎么选？
6. DNS 在请求链路中做什么？
7. HTTPS 比 HTTP 多解决了什么？
8. 为什么数据库通常不应直接暴露公网？
9. 全球静态内容为什么适合 CDN？
10. 单台 EC2 的主要架构风险是什么？

## 12. 今日输出

学习结束前，不看资料画出并口述这一套架构：

```text
Route 53
→ CloudFront
→ ALB
→ 两个 AZ 中的 App instances
→ Cache
→ Multi-AZ database
```

并能解释每一层解决了什么问题。



## ✅ 多模块 Spring Boot 项目结构(Maven Multi-Module)

```
oj-platform/                         # 项目根目录  
├── pom.xml                          # 根 POM，管理版本与模块  
├── oj-common/                       # 公共模块：工具类、常量、DTO、异常等  
├── oj-gateway/                      # API 网关(未来可替换为 Spring Cloud Gateway)  
├── oj-auth-service/                 # 认证授权服务(JWT、OAuth2、权限控制)  
├── oj-user-service/                 # 用户管理服务(用户信息、权限申请等)  
├── oj-problem-service/              # 题目管理服务(题目 CRUD、标签、难度)  
├── oj-judge-service/                # 判题核心服务(接收代码、调度沙箱、返回结果)  
├── oj-contest-service/              # 比赛管理服务(比赛创建、报名、计分)  
├── oj-search-service/               # 搜索服务(Elasticsearch 集成)  
├── oj-graph-service/                # 图谱服务(题目知识图谱、推荐基础)  
├── oj-statistics-service/           # 统计服务(排行榜、思维曲线、用户行为分析)  
├── oj-ai-agent-service/             # AI 智能体服务(接入大模型，个性化推荐)  
└── oj-frontend/                     # 前端项目(可选，或分离部署)  
```



## 📌 各模块详细说明与命名理由

| 模块名                | 职责                                                  | 未来微服务演进                |
| --------------------- | ----------------------------------------------------- | ----------------------------- |
| oj-common             | 所有模块共享的实体类、DTO、工具类、异常码、常量枚举等 | 保持不变，作为依赖库          |
| oj-gateway            | 统一入口，路由请求，未来可集成限流、熔断              | 可替换为 Spring Cloud Gateway |
| oj-auth-service       | 登录、JWT 生成、权限验证(三级权限)                    | 独立部署，对接 OAuth2 / CAS   |
| oj-user-service       | 用户信息管理、权限申请、比赛创建资格审核              | 可扩展为用户中心              |
| oj-problem-service    | 题目 CRUD、标签管理、难度设置、题目标记               | 支持 GraphQL 查询             |
| oj-judge-service      | 接收代码、调用沙箱执行、结果比对、异常捕获            | 核心服务，可横向扩展判题节点  |
| oj-contest-service    | 比赛创建、倒计时、排名实时更新、虚拟参赛              | 支持 WebSocket 实时推送       |
| oj-search-service     | 集成 Elasticsearch，支持题目名称、标签模糊搜索        | 高性能搜索服务                |
| oj-graph-service      | 构建题目知识图谱(题目→知识点→难度→依赖关系)         | 支持 Neo4j                    |
| oj-statistics-service | 用户提交数据统计、排行榜、思维曲线分析                | 数据分析基础                  |
| oj-ai-agent-service   | 接入大模型(如 Qwen)，提供智能刷题建议、错题解析     | AI 微服务，可调用外部 API     |



## 🔧 技术栈(对应未来性能方向)

| 功能       | 技术选型                                          |
| ---------- | ------------------------------------------------- |
| 缓存       | Redis(缓存热门题目、用户会话、排行榜)           |
| 搜索       | Elasticsearch(题目全文检索、标签搜索)           |
| 消息队列   | RabbitMQ(异步判题任务分发)                      |
| 判题沙箱   | Docker + 隔离容器(运行用户代码)                 |
| 微服务治理 | Spring Cloud Alibaba(Nacos 注册中心 + Sentinel) |
| 前端通信   | WebSocket(实时判题状态推送)                     |
| 数据库     | MySQL(主数据) + Neo4j(知识图谱)               |



## 🚀 一期 Demo 实现模块(MVP)

初期不必实现全部模块，建议先构建最小可用系统：

bash深色版本

```
oj-platform/
├── oj-common
├── oj-gateway
├── oj-auth-service
├── oj-problem-service
├── oj-judge-service        # 核心判题(同步也可，后期异步化)
└── oj-frontend             # Vue/React 前端
```

> ⚠️ 判题服务初期可同步执行，后期通过 RabbitMQ 改造成异步任务队列。



## 📚 命名规范

- 所有模块以 `oj-` 开头，体现项目归属
- 使用 `-service` 后缀，明确其为后端服务
- 避免使用 `module`、`demo`、`v1` 等临时性词汇
- 数据库表名对应模块功能，如 `problem`, `submission`, `contest`, `user`

------

## ✅ 推荐模块命名清单

```
<!-- Maven 模块示例 -->
<modules>
    <module>oj-common</module>
    <module>oj-gateway</module>
    <module>oj-auth-service</module>
    <module>oj-user-service</module>
    <module>oj-problem-service</module>
    <module>oj-judge-service</module>
    <module>oj-contest-service</module>
    <module>oj-search-service</module>
    <module>oj-graph-service</module>
    <module>oj-statistics-service</module>
    <module>oj-ai-agent-service</module>
</modules>
```
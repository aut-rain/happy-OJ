## 设计思路



> ### 设计流程
>
> 
>
> 1. #### 数据库字段设计
>
>    **我想要设计OJ网站的题库功能,现在在设计数据库**
>
>    **每个题目要有题目编号(id),题目的标签(不止一个),题目名称,题目难易程度,题目做题数,题目通过率,题目的md文档链接(md_url),题目的验证输入文件链接(in_url),题目的验证输出文件的链接(out_url),当前用户的做题情况(尝试过/没有尝试过/通过),题目的答案文件的链接(id_uid_answer_url,一个题目不止一个答案)...**
>
>    
>
> 2. #### 流程设计
>
>    **2.1 题库展示的内容只有编号,题目名称,标签,难易程度,提交数,通过率 **
>
>    **2.2 题目的md文档需要点击题目后才能看到**
>
>    **2.3 题目的答案也必须点击题目后在题目页面的侧边栏处有个答案页面点击才能看到该题的答案**
>
>    **2.4 标准输入文件链接和标准输出文件链接需要用户点击提交后后端才能进行**
>
>    **2.5 用户选择代码语言然后提交代码后可以显示通过结果(单个测试结果通过状况accept/wrong/exception...,单个测试结果耗时,全部测试结果是否全对))**
>
>    **2.6 用户可以看到自己的历史提交记录(包括提交的代码,以及通过情况)**
>
>    **暂时我就想到这些,需要结合字段的查找和改动频率以及数据库表设计规范还有阿里巴巴Java开发手册中的数据库设计规范,进行分析如何进行数据库表的设计,以及字段名的命名**





## 一、业务流程梳理

| 阶段        | 用户行为                                                     | 后端响应                                  |
| ----------- | ------------------------------------------------------------ | ----------------------------------------- |
| 1. 题库列表 | 浏览题目：编号、名称、标签、难度、提交数、通过率             | 查询 `problem` + `problem_tag` + `tag`    |
| 2. 题目详情 | 点击题目 → 查看题目描述（md）、侧边栏“查看答案”              | 查询 `problem.md_url`，**答案需权限控制** |
| 3. 提交代码 | 选择语言 → 提交代码 → 后端获取 `in_url` / `out_url` 进行判题 | 生成 `submission` 记录，调用判题服务      |
| 4. 查看结果 | 显示每个测试点结果（通过/错误/超时）、耗时、内存、总结果     | 存储在 `submission_detail` 表             |
| 5. 查看历史 | 查看自己对该题的所有提交记录（代码、状态、时间）             | 查询 `submission` + `submission_detail`   |



## 二、数据库表设计优化

### 1. 题目表：`problem` 

```
create table problem (
    id bigint unsigned primary key auto_increment,
    title varchar(255) not null,
    difficulty tinyint not null comment '1:简单, 2:中等, 3:困难',
    md_url varchar(512) not null,
    in_url varchar(512) not null,
    out_url varchar(512) not null,
    submit_count int unsigned not null default 0,
    accept_count int unsigned not null default 0,
    pass_rate decimal(5,2) not null default 0.00,
    status tinyint not null default 1,
    create_time datetime not null,
    update_time datetime not null
) engine=innodb default charset=utf8mb4;
```

| 字段名         | 类型            | 必填              | 说明                             |
| -------------- | --------------- | ----------------- | -------------------------------- |
| `id`           | BIGINT UNSIGNED | YES               | 题目唯一ID，自增主键             |
| `title`        | VARCHAR(255)    | YES               | 题目名称                         |
| `difficulty`   | TINYINT         | YES               | 难度等级：1-简单，2-中等，3-困难 |
| `md_url`       | VARCHAR(512)    | YES               | Markdown题目描述文件链接         |
| `in_url`       | VARCHAR(512)    | YES               | 标准输入文件链接（用于判题）     |
| `out_url`      | VARCHAR(512)    | YES               | 标准输出文件链接（用于判题）     |
| `submit_count` | INT UNSIGNED    | YES, DEFAULT 0    | 总提交次数                       |
| `accept_count` | INT UNSIGNED    | YES, DEFAULT 0    | 通过次数                         |
| `pass_rate`    | DECIMAL(5,2)    | YES, DEFAULT 0.00 | 通过率（可计算，缓存提升性能）   |
| `status`       | TINYINT         | YES, DEFAULT 1    | 状态：1-正常，0-下线，2-待审核   |
| `create_time`  | DATETIME        | YES               | 创建时间                         |
| `update_time`  | DATETIME        | YES               | 更新时间                         |

| 字段                                                         | 说明                     |
| ------------------------------------------------------------ | ------------------------ |
| `id`, `title`, `difficulty`, `submit_count`, `accept_count`, `pass_rate` | 列表页直接展示           |
| `md_url`                                                     | 题目描述文件，点击后加载 |
| `status`                                                     | 控制题目是否可见         |

> 📌 **注意**：`in_url`, `out_url` 保留在 `problem` 表中，但**仅后端判题服务可访问**，前端不可见。

### 2. 题目标签关联表：`problem_tag` 

用于多对多关联题目和标签。

```
CREATE TABLE problem_tag (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    problem_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    create_time DATETIME NOT NULL,
    UNIQUE KEY uk_problem_tag (problem_id, tag_id),
    KEY idx_problem_id (problem_id),
    KEY idx_tag_id (tag_id)
);
```

| 字段名        | 类型            | 必填 | 说明     |
| ------------- | --------------- | ---- | -------- |
| `id`          | BIGINT UNSIGNED | YES  | 主键     |
| `problem_id`  | BIGINT UNSIGNED | YES  | 题目ID   |
| `tag_id`      | BIGINT UNSIGNED | YES  | 标签ID   |
| `create_time` | DATETIME        | YES  | 创建时间 |

### 3. 标签表：`tag`

```
CREATE TABLE tag (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 1,
    create_time DATETIME NOT NULL,
    update_time DATETIME NOT NULL
);
```

| 字段名        | 类型            | 必填 | 说明                          |
| ------------- | --------------- | ---- | ----------------------------- |
| `id`          | BIGINT UNSIGNED | YES  | 主键                          |
| `name`        | VARCHAR(64)     | YES  | 标签名，如 "数组", "动态规划" |
| `description` | VARCHAR(255)    | NO   | 描述                          |
| `status`      | TINYINT         | YES  | 状态                          |
| `create_time` | DATETIME        | YES  | 创建时间                      |
| `update_time` | DATETIME        | YES  | 更新时间                      |

### 4. 用户提交记录表：`submission` 

记录每次提交的基本信息。

```
CREATE TABLE submission (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    code_url VARCHAR(512) NOT NULL,
    language VARCHAR(32) NOT NULL,
    status TINYINT NOT NULL COMMENT '0:pending,1:accepted,2:wrong,3:timeout,4:compile_error...',
    submit_time DATETIME NOT NULL,
    run_time_ms INT UNSIGNED,
    memory_kb INT UNSIGNED,
    score INT UNSIGNED,
    KEY idx_user_id (user_id),
    KEY idx_problem_id (problem_id),
    KEY idx_user_problem (user_id, problem_id),
    KEY idx_submit_time (submit_time)
);
```

| 字段          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| `id`          | 提交记录唯一ID                                               |
| `user_id`     | 提交用户                                                     |
| `problem_id`  | 对应题目                                                     |
| `code_url`    | 用户提交的代码文件链接（OSS/S3）                             |
| `language`    | 编程语言（C++, Java, Python等）                              |
| `status`      | 总体状态：0-待判题，1-通过，2-答案错误，3-超时，4-编译错误等 |
| `submit_time` | 提交时间                                                     |
| `run_time_ms` | 最大运行时间（ms）                                           |
| `memory_kb`   | 最大内存使用（KB）                                           |
| `score`       | 得分（0~100）                                                |

> 🔐 `code_url` 存储代码内容，仅用户自己和管理员可查看。

### 5. 提交详情表：`submission_detail` 

用于存储每个测试点的判题结果，支持细粒度反馈。

```
CREATE TABLE submission_detail (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    submission_id BIGINT UNSIGNED NOT NULL,
    test_case_name VARCHAR(64),
    status TINYINT NOT NULL,
    input_url VARCHAR(512),
    expected_output_url VARCHAR(512),
    actual_output_url VARCHAR(512),
    run_time_ms INT UNSIGNED,
    memory_kb INT UNSIGNED,
    order_index INT,
    KEY idx_submission_id (submission_id),
    KEY idx_status (status)
);
```

| 字段                  | 类型            | 说明                                       |
| --------------------- | --------------- | ------------------------------------------ |
| `id`                  | BIGINT UNSIGNED | 主键                                       |
| `submission_id`       | BIGINT UNSIGNED | 外键，关联 `submission.id`                 |
| `test_case_name`      | VARCHAR(64)     | 测试点名称，如 "test_1"                    |
| `status`              | TINYINT         | 状态：1-通过，2-错误，3-超时，4-格式错误等 |
| `input_url`           | VARCHAR(512)    | 输入文件（可选，调试用）                   |
| `expected_output_url` | VARCHAR(512)    | 期望输出（可选）                           |
| `actual_output_url`   | VARCHAR(512)    | 实际输出（判题后生成）                     |
| `run_time_ms`         | INT             | 该测试点耗时                               |
| `memory_kb`           | INT             | 该测试点内存                               |
| `order_index`         | INT             | 测试点顺序                                 |

> 📌 示例：一个提交有 5 个测试点，`submission_detail` 中就有 5 条记录。

### 6. 答案表：`problem_answer` 

存储题目的参考答案（或标准解法），**仅授权用户（如通过者）可查看**。

```
CREATE TABLE problem_answer (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    problem_id BIGINT UNSIGNED NOT NULL,
    answer_url VARCHAR(512) NOT NULL,
    language VARCHAR(32) NOT NULL,
    description TEXT,
    create_time DATETIME NOT NULL,
    UNIQUE KEY uk_problem_language (problem_id, language)
);
```

| 字段          | 类型            | 说明             |
| ------------- | --------------- | ---------------- |
| `id`          | BIGINT UNSIGNED | 主键             |
| `problem_id`  | BIGINT UNSIGNED | 外键             |
| `answer_url`  | VARCHAR(512)    | 答案代码文件链接 |
| `language`    | VARCHAR(32)     | 答案语言         |
| `description` | TEXT            | 答案说明（可选） |
| `create_time` | DATETIME        | 创建时间         |

> 🔐 前端“答案”按钮是否显示，由后端判断：`当前用户是否已通过该题`。

> 支持同一题多个语言的答案。

### 7. （可选）用户题目状态快照表：`user_problem_status` 

缓存用户对每道题的最新状态，用于快速展示“已通过”、“已尝试”。

sql深色版本

```
CREATE TABLE user_problem_status (
    user_id BIGINT UNSIGNED NOT NULL,
    problem_id BIGINT UNSIGNED NOT NULL,
    last_status TINYINT NOT NULL COMMENT '0:未尝试,1:尝试未过,2:已通过',
    last_submit_time DATETIME,
    submit_count INT UNSIGNED NOT NULL DEFAULT 1,
    update_time DATETIME NOT NULL,
    PRIMARY KEY (user_id, problem_id),
    KEY idx_last_status (last_status)
);
```

| 字段名             | 类型            | 必填           | 说明                                       |
| ------------------ | --------------- | -------------- | ------------------------------------------ |
| `user_id`          | BIGINT UNSIGNED | YES            | 用户ID                                     |
| `problem_id`       | BIGINT UNSIGNED | YES            | 题目ID                                     |
| `last_status`      | TINYINT         | YES            | 最新状态：0-未尝试，1-尝试未通过，2-已通过 |
| `last_submit_time` | DATETIME        | NO             | 最后提交时间                               |
| `submit_count`     | INT UNSIGNED    | YES, DEFAULT 1 | 用户对此题提交次数                         |
| `update_time`      | DATETIME        | YES            | 更新时间                                   |

> 🔗 联合主键：`(user_id, problem_id)`
>  🚀 优势：查询“用户做过哪些题”极快，避免扫描 `submission` 大表。
>  ⚠️ 需在每次提交判题后异步更新此表（可用消息队列解耦）。

## 三、字段命名规范（严格遵循阿里规范）

| 类型     | 规范                            | 示例                            |
| -------- | ------------------------------- | ------------------------------- |
| 表名     | 小写单数名词                    | `problem`, `submission`         |
| 字段名   | 小写 + 下划线                   | `problem_id`, `submit_count`    |
| 主键     | `id`                            | `BIGINT UNSIGNED`               |
| 外键     | `关联表名_id`                   | `problem_id`, `user_id`         |
| 索引     | `idx_字段` 或 `uk_字段`（唯一） | `idx_user_id`, `uk_problem_tag` |
| 时间字段 | `create_time`, `update_time`    | 统一使用 `DATETIME`             |

------

## 四、关键业务场景 SQL 示例

### 1. 题库列表页查询（带标签）

sql深色版本

```
SELECT 
    p.id, p.title, p.difficulty, p.submit_count, p.pass_rate,
    GROUP_CONCAT(t.name) AS tags
FROM problem p
LEFT JOIN problem_tag pt ON p.id = pt.problem_id
LEFT JOIN tag t ON pt.tag_id = t.id
WHERE p.status = 1
GROUP BY p.id
ORDER BY p.id
LIMIT 20;
```

------

### 2. 题目详情页（含是否可看答案）

sql深色版本

```
-- 查询题目
SELECT * FROM problem WHERE id = ?;

-- 查询用户是否已通过（决定是否显示“查看答案”按钮）
SELECT COUNT(*) FROM submission 
WHERE user_id = ? AND problem_id = ? AND status = 1;
```

------

### 3. 查看某题的所有提交记录（用户视角）

sql深色版本

```
SELECT id, language, status, submit_time, run_time_ms, memory_kb, score
FROM submission
WHERE user_id = ? AND problem_id = ?
ORDER BY submit_time DESC;
```

------

### 4. 查看某次提交的详细测试结果

sql深色版本

```
SELECT test_case_name, status, run_time_ms, memory_kb
FROM submission_detail
WHERE submission_id = ?
ORDER BY order_index;
```

------

## 五、安全与权限建议

| 资源                        | 访问控制                                                     |
| --------------------------- | ------------------------------------------------------------ |
| `in_url`, `out_url`         | 仅后端判题服务可访问，**不暴露给前端**                       |
| `problem_answer.answer_url` | 仅当 `user_problem_status.last_status = 2`（已通过）时可查看 |
| `submission.code_url`       | 仅提交者和管理员可查看                                       |
| `submission_detail`         | 仅提交者可查看详细测试输出（防作弊）                         |

------

## 六、总结：最终表结构清单

| 表名                  | 用途                               |
| --------------------- | ---------------------------------- |
| `problem`             | 题目元信息 + 统计                  |
| `tag`                 | 标签定义                           |
| `problem_tag`         | 题目-标签多对多关联                |
| `submission`          | 用户提交记录（总览）               |
| `submission_detail`   | 每个测试点的判题结果               |
| `problem_answer`      | 题目参考答案（权限控制）           |
| `user_problem_status` | 用户题目状态快照（可选，提升性能） |

## ✅ 下一步建议

1. **判题服务解耦**：使用消息队列（如 RabbitMQ/Kafka）异步处理提交，避免阻塞。
2. **代码存储安全**：`code_url` 和 `answer_url` 使用临时签名链接（如 OSS Presigned URL），防止未授权访问。
3. **缓存策略**：Redis 缓存热门题目的标签、通过率等。
4. **分页优化**：`submission` 表按 `user_id + submit_time` 分页查询。

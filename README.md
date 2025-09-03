# happy-OJ
这是一个快乐的OJ网站(开发中,目前只有前端)

## 一期demo
1. 这是一个OJ网站,大概思路是提供md格式的题目以及用户可以点击提交进行测评,用户选择语言后可以点击提交后,  
   前端会把根据用户选择的语言把代码命名为对应格式比如C语言命名为main.c,Java语言命名为main.java,C++语言命名为main.cpp,然后传给后端进行测评,  
   测评方式是运行用户提交的代码文件然后根据题目对应的输入测试样例进行结果输出,  
   最终将用户的输出结果和对应的测试样例答案结果进行匹配,如果对了则前端返回accept,反之返回wrong,如果运行异常,则输出exception;  
2. 题目格式按照ACM赛制的形式
3. 主页可以稍微炫酷一些,并加上搜索功能,用户可以通过标签和题目名称进行搜索

## 未来展望
### 功能方向
1. 可以扩展记录用户数据,用于统计推荐
2. 将题目以及标签和难度等关系建立成Graph,用于打造知识库
3. 连接大模型,并将用户刷题比赛数据和题目知识库接入大模型中,打造适合用户高效刷题的智能Agent
4. 三级身份权限验证,  
   root用户全能,  
   管理员可以被root授予增删改查题目和比赛以及用户管理的权限,  
   普通用户可以申请创建比赛的资格  
6. 完善题库功能
7. 完善比赛功能
8. 完善排行榜功能
9. 对用户数据进行推理,实现类似Codeforces的思维曲线

### 性能方向
1. 使用Redis缓存网页数据,以及缓存热门题目数据
2. 使用Elasticsearch强化题目搜索以及知识库检索性能
3. 使用RabbitMQ处理并发提交,实现异步判题,灵活扩展评测集群

---

## 本地开发

### 环境准备

- 安装 [Node.js  v20.15.1](https://nodejs.org/en)
- 安装 [pnpm](https://pnpm.io/installation)
- 安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)

### 操作步骤

- 安装依赖

```sh
pnpm install
```

- 启动 Dev Server

```sh
pnpm run dev
```

- 在浏览器访问 http://localhost:3000

---

## 注:
### 本项目架构方向是使用SpringBoot+MyBatisPlus+MySQL+React
### 开发规范遵守[阿里巴巴Java开发手册-终极版](https://github.com/alibaba/p3c)
### 现阶段理念是完全开源
### 如果你对该项目感兴趣,欢迎联系我一起合作
### 也欢迎各位大佬进行pr

`本人QQ:2545946621`

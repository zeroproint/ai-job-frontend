# 🤖 AI 求职机 (AI Job App)

> 一款面向高校学生的 AI 驱动的全栈智能求职平台。基于大语言模型（LLM），提供从简历解析、多维度 AI 诊断到求职匹配的全链路闭环体验。

## ✨ 核心功能亮点

- **📄 真实文件解析**：支持 PDF、Word、TXT 格式简历上传（≤10MB），后端利用 PDFBox / POI 真实提取文本内容。
- **🧠 AI 智能诊断**：结合 Dify 搭建大模型工作流，从“职位匹配、结构层次、视觉美观、真诚度、亮点呈现”五大维度对简历进行深度评分与建议。
- **🔄 异步状态机与轮询**：针对大模型长耗时痛点，后端采用 `@Async` 异步解耦，前端实现 2 秒轮询与 3 分钟超时兜底，流畅展示“分析中 -> 已生成”状态。
- **📊 数据可视化**：前端基于 uCharts 动态渲染五维雷达图与柱状图，直观展示 AI 诊断结果。
- **🔍 岗位检索与联动**：支持多条件筛选（学历/经验/薪资），对接真实 MySQL 数据库，实现动态模糊查询。

---

## 📸 界面展示 (UI Showcase)

### 1. 核心业务闭环 (已完成前后端联调)

| 首页与导航 | 上传简历与解析 | AI 异步分析中 | 历史记录 (真实数据) |
| :---: | :---: | :---: | :---: |
| <img src="./images/home.jpg" width="200" /> | <img src="./images/upload.jpg" width="200" /> | <img src="./images/loading.jpg" width="200" /> | <img src="./images/history.jpg" width="200" /> |

### 2. AI 简历诊断报告详情 (长图截取)

| 总分与评价 | 职位匹配度 | 结构层次指数 |
| :---: | :---: | :---: |
| <img src="./images/report1.jpg" width="220" /> | <img src="./images/report2.jpg" width="220" /> | <img src="./images/report3.jpg" width="220" /> |

| 视觉美观指数 | 五维雷达图 (整体能力) |
| :---: | :---: |
| <img src="./images/report4.jpg" width="250" /> | <img src="./images/report5.jpg" width="250" /> |

### 3. 求职与筛选模块

| 岗位搜索 (关键字) | 岗位多条件筛选 | 职位详情页 |
| :---: | :---: | :---: |
| <img src="./images/search-java.jpg" width="220" /> | <img src="./images/filter.jpg" width="220" /> | <img src="./images/job_detail.jpg" width="220" /> |

### 4. 个人中心与扩展模块 (UI 静态高保真还原)

| 我的页面 | 个人信息编辑 |
| :---: | :---: |
| <img src="./images/profile1.jpg" width="250" /> | <img src="./images/profile2.jpg" width="250" /> |

| 职位简历报告列表 | AI 模拟面试 (深色主题) | 面试列表 | 面试报告 |
| :---: | :---: | :---: | :---: |
| <img src="./images/match_list.jpg" width="200" /> | <img src="./images/mock_interview.jpg" width="200" /> | <img src="./images/interview_list.jpg" width="200" /> | <img src="./images/interview_report.jpg" width="200" /> |

---

## 🏗️ 系统架构与数据流

```text
[前端 UniApp (Vue3 + Vite)]
       │ 
       │ 1. 上传简历 / 发起分析 (RESTful API)
       ▼
[后端 Spring Boot 3 (Java 17)]
       │ 
       ├── 2. (MyBatis-Plus) ──► [MySQL 数据库] (落库 status=0 生成中)
       │
       └── 3. (WebClient + @Async) ──► [Dify AI 工作流] (大模型推理)
              │
              ├── 4. 正则清洗与 JSON 兜底解析
              │
       [前端 5. 每 2 秒轮询状态]
              │
       [后端 6. 更新数据库 status=1，返回结果]
              │
       [前端 7. uCharts 渲染雷达图/柱状图]

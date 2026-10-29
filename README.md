# 🤖 AI 求职机 (AI Job App)

> 一款面向高校学生的 AI 驱动的全栈智能求职平台。基于大语言模型（LLM），提供从简历解析、多维度 AI 诊断到求职匹配的全链路闭环体验。

## ✨ 核心功能亮点

- **📄 真实文件解析**：支持 PDF、Word、TXT 格式简历上传（≤10MB），后端利用 PDFBox / POI 真实提取文本内容。
- **🧠 AI 智能诊断**：结合 Dify 搭建大模型工作流，从“职位匹配、结构层次、视觉美观、真诚度、亮点呈现”五大维度对简历进行深度评分与建议。
- **🔄 异步状态机与轮询**：针对大模型长耗时痛点，后端采用 `@Async` 异步解耦，前端实现 2 秒轮询与 3 分钟超时兜底，流畅展示“分析中 -> 已生成”状态。
- **📊 数据可视化**：前端基于 uCharts 动态渲染五维雷达图与柱状图，直观展示 AI 诊断结果。
- **🗄️ 真实全栈数据流**：包含登录/个人中心、历史分析记录、岗位列表与多条件联动筛选，全部对接 MySQL 真实数据库。

---

## 📸 界面展示

| 首页与入口 | 简历上传与解析 | AI 分析中 (异步轮询) |
| :---: | :---: | :---: |
| <img src="./images/home.jpg" width="250" /> | <img src="./images/upload.jpg" width="250" /> | <img src="./images/loading.jpg" width="250" /> |

| 简历诊断报告 (多维度可视化) | 历史记录 (真实数据联动) | 个人信息与设置 |
| :---: | :---: | :---: |
| <img src="./images/report.jpg" width="250" /> | <img src="./images/history.jpg" width="250" /> | <img src="./images/profile.jpg" width="250" /> |

| 岗位多条件筛选 | 求职列表 | 诊断报告详情 (雷达图) |
| :---: | :---: | :---: |
| <img src="./images/filter.jpg" width="250" /> | <img src="./images/job.jpg" width="250" /> | <img src="./images/radar.jpg" width="250" /> |

---

## 🏗️ 系统架构图

```text
[前端 UniApp (Vue3 + Vite)]
       │ 
       │ (RESTful API / 轮询状态)
       ▼
[后端 Spring Boot 3 (Java 17)]
       │ 
       ├── (MyBatis-Plus) ──► [MySQL 数据库] (存储用户、简历、报告数据)
       │
       └── (WebClient + @Async) ──► [Dify AI 工作流] (大模型推理与 JSON 格式化)

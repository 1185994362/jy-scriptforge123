# 个人主页

**前后端分离** — 前端纯静态，后端 FastAPI。

---

## 📁 文件夹说明

```
index/
├── conding/          ← 前端（纯 HTML + CSS + JS）
│   ├── index.html      首页
│   ├── style.css       样式
│   ├── script.js       交互
│   └── avatar.svg      头像占位图
│
├── pyding/           ← 后端（FastAPI）
│   ├── main.py         服务入口
│   ├── requirements.txt 依赖
│   ├── start.bat        一键启动
│   ├── README.md        说明文档
│   └── data/            运行时数据（留言/统计）
│
```

- **`conding/`** — 前端，双击 `index.html` 可直接在浏览器打开
- **`pyding/`** — 后端，运行后通过 API 提供留言存储、统计等功能

---

## 🚀 使用方式

### 方式一：纯前端预览（无需后端）

直接双击打开：
```
index\conding\index.html
```

### 方式二：全功能 + 后端 API

```
双击 index\pyding\start.bat
```

或命令行：
```bash
cd index\pyding
pip install -r requirements.txt
python main.py
```

访问：`http://127.0.0.1:8000`

---

## 🌐 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/contact` | 提交联系表单 |
| GET | `/api/stats` | 统计数据 |
| GET | `/api/health` | 健康检查 |

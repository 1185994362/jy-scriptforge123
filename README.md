# 个人主页

**前后端分离** — 前端纯静态，后端 FastAPI，支持 Docker 部署。

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
│   ├── start.bat        一键启动（Windows）
│   ├── README.md        说明文档
│   └── data/            运行时数据（留言/统计）
│
├── model/             ← Docker 部署配置
│   ├── Dockerfile          镜像构建文件
│   ├── docker-compose.yml  Compose 配置
│   └── .dockerignore       构建忽略文件
│
└── README.md          ← 本文件
```

---

## 🐳 Docker 部署（推荐）

### 前置条件
安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 一键启动
```bash
cd C:\Users\Administrator\Desktop\index\model
docker compose up --build
```

### 构建镜像
```bash
cd C:\Users\Administrator\Desktop\index\model
docker build -t personal-site -f Dockerfile ..
```

### 运行容器
```bash
docker run -d -p 8000:8000 --name my-site personal-site
```

### 访问
打开浏览器：`http://localhost:8000`

---

## 💻 本地开发（不用 Docker）

### 前端预览
直接双击打开：
```
index\conding\index.html
```

### 后端启动
```bash
cd index\pyding
pip install -r requirements.txt
python main.py
```
访问：`http://127.0.0.1:8000`

或直接双击 `pyding\start.bat`

---

## 🌐 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET`  | `/`            | 首页 |
| `POST` | `/api/contact` | 提交联系表单 |
| `GET`  | `/api/stats`    | 统计数据 |
| `GET`  | `/api/health`   | 健康检查 |

# ===== 构建阶段 =====
FROM python:3.12-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装（利用 Docker 缓存）
COPY pyding/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ===== 运行阶段 =====
FROM python:3.12-slim

WORKDIR /app

# 安装运行时依赖
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn
COPY --from=builder /usr/local/bin/fastapi /usr/local/bin/fastapi

# 复制整个项目（构建上下文是 index/，所以路径正确）
COPY conding/ ./conding/
COPY pyding/main.py ./main.py
COPY pyding/requirements.txt ./

# 创建数据目录
RUN mkdir -p /app/data && chmod 777 /app/data

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

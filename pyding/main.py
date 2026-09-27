"""
个人主页 - FastAPI 后端
"""
import os
import time
import json
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

# ---------------------------------------------------------------------------
# 路径配置
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent

# conding/ 目录：优先找同级的 conding/，找不到再找上一级的 conding/
if (BASE_DIR / "conding").exists():
    CONDING_DIR = BASE_DIR / "conding"
elif (BASE_DIR.parent / "conding").exists():
    CONDING_DIR = BASE_DIR.parent / "conding"
else:
    CONDING_DIR = BASE_DIR / "conding"   # 兜底

# data/ 目录：优先用同级的 data/，找不到再用 pyding/data/
DATA_DIR = BASE_DIR / "data"
if not DATA_DIR.exists() and (BASE_DIR.parent / "pyding" / "data").exists():
    DATA_DIR = BASE_DIR.parent / "pyding" / "data"
DATA_DIR.mkdir(exist_ok=True)
MESSAGES_FILE = DATA_DIR / "messages.json"
VISITS_FILE = DATA_DIR / "visits.json"


def _read_json(path: Path) -> list:
    if not path.exists():
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def _write_json(path: Path, data: list) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# 应用
# ---------------------------------------------------------------------------
app = FastAPI(
    title="个人主页 API",
    description="张明 - 个人主页后端服务",
    version="1.0.0",
)


# ---------------------------------------------------------------------------
# 数据模型
# ---------------------------------------------------------------------------
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: str = Field(...)
    subject: str = Field(default="", max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)


# ---------------------------------------------------------------------------
# API 路由（必须优先于 StaticFiles 挂载）
# ---------------------------------------------------------------------------
@app.post("/api/contact", summary="提交联系表单")
async def submit_contact(msg: ContactMessage):
    messages = _read_json(MESSAGES_FILE)
    record = {
        "id": int(time.time() * 1000),
        **msg.model_dump(),
        "created_at": datetime.now().isoformat(),
    }
    messages.append(record)
    _write_json(MESSAGES_FILE, messages)
    return JSONResponse(
        status_code=200,
        content={"code": 0, "message": "留言提交成功，感谢您的联系！", "id": record["id"]},
    )


@app.get("/api/stats", summary="获取统计数据")
async def get_stats():
    messages = _read_json(MESSAGES_FILE)
    visits = _read_json(VISITS_FILE)
    return {
        "code": 0,
        "data": {
            "total_visits": len(visits),
            "total_messages": len(messages),
            "today_visits": sum(
                1 for v in visits
                if datetime.fromtimestamp(v["timestamp"]).date() == datetime.today().date()
            ),
        },
    }


@app.get("/api/health", summary="健康检查")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "uptime": time.time() - start_time,
    }


# ---------------------------------------------------------------------------
# 前端静态文件 —— 所有 API 路由之后挂载
# conding/ 目录中的 index.html 使用相对路径引用 style.css / script.js
# ---------------------------------------------------------------------------
if CONDING_DIR.exists():
    app.mount(
        "/",
        StaticFiles(directory=str(CONDING_DIR), html=True),
        name="frontend",
    )


# ---------------------------------------------------------------------------
# 启动
# ---------------------------------------------------------------------------
start_time = time.time()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"  🚀 服务启动:         http://127.0.0.1:{port}")
    print(f"  📁 前端目录 (conding): {CONDING_DIR}")
    print(f"  📁 后端目录 (pyding):  {BASE_DIR}")
    print(f"  📁 数据目录:           {DATA_DIR}")
    print()
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

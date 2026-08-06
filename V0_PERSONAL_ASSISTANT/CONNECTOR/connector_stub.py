from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


BASE_DIR = Path(r"D:\【勿动】海中宝AI中央大盘\战略助手\V0_PERSONAL_ASSISTANT")


@dataclass
class Candidate:
    title: str
    content: str
    source: str
    target_path: str
    confirmed_by: Optional[str] = None


def _resolve_safe_path(rel_path: str) -> Path:
    target = (BASE_DIR / rel_path).resolve()
    if BASE_DIR not in target.parents and target != BASE_DIR:
        raise ValueError(f"Unsafe path: {rel_path}")
    return target


def search_repository(query: str) -> List[str]:
    # Placeholder for real repository search.
    return []


def list_directory(rel_path: str = ".") -> List[str]:
    target = _resolve_safe_path(rel_path)
    if not target.exists():
        return []
    return [p.name for p in target.iterdir()]


def read_file(rel_path: str) -> str:
    target = _resolve_safe_path(rel_path)
    return target.read_text(encoding="utf-8")


def submit_memory_candidate(candidate: Candidate) -> str:
    pending_dir = _resolve_safe_path("INBOX/PENDING")
    pending_dir.mkdir(parents=True, exist_ok=True)
    safe_name = candidate.title.replace("/", "_").replace("\\", "_").strip() or "candidate"
    path = pending_dir / f"{safe_name}.md"
    payload = f"# {candidate.title}\n\nSource: {candidate.source}\n\n{candidate.content}\n"
    path.write_text(payload, encoding="utf-8")
    return str(path)


def approve_memory_candidate(rel_path: str, confirmed_by: str) -> str:
    target = _resolve_safe_path(rel_path)
    text = target.read_text(encoding="utf-8")
    approved_dir = _resolve_safe_path("INBOX/APPROVED")
    approved_dir.mkdir(parents=True, exist_ok=True)
    new_path = approved_dir / target.name
    new_text = f"Confirmed by: {confirmed_by}\n\n{text}"
    new_path.write_text(new_text, encoding="utf-8")
    return str(new_path)


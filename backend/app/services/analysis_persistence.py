from __future__ import annotations

import json
from pathlib import Path
from threading import Lock

from app.models.analysis import AnalysisRecord


class AnalysisPersistenceService:
    def __init__(self, storage_path: Path | None = None) -> None:
        self.storage_path = storage_path or Path(__file__).resolve().parents[2] / "data" / "analyses.json"
        self._lock = Lock()
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.storage_path.exists():
            self.storage_path.write_text("[]\n", encoding="utf-8")

    @classmethod
    def create_default(cls) -> "AnalysisPersistenceService":
        return cls()

    def list_analyses(self) -> list[AnalysisRecord]:
        with self._lock:
            return self._load_all()

    def save_analysis(self, analysis: AnalysisRecord) -> AnalysisRecord:
        with self._lock:
            analyses = self._load_all()
            analyses.append(analysis)
            self._write_all(analyses)
        return analysis

    def _load_all(self) -> list[AnalysisRecord]:
        raw_content = self.storage_path.read_text(encoding="utf-8").strip()
        if not raw_content:
            return []

        payload = json.loads(raw_content)
        if not isinstance(payload, list):
            return []

        return [AnalysisRecord.model_validate(item) for item in payload]

    def _write_all(self, analyses: list[AnalysisRecord]) -> None:
        serialized = [analysis.model_dump() for analysis in analyses]
        self.storage_path.write_text(json.dumps(serialized, indent=2) + "\n", encoding="utf-8")
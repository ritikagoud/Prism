from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import TYPE_CHECKING

from app.models.analysis import AnalysisRecord

if TYPE_CHECKING:
    from app.services.mongodb_analysis_persistence import MongoDBAnalysisPersistenceService


class AnalysisPersistenceService:
    """
    Unified persistence service that supports both MongoDB and JSON file storage.
    
    Automatically uses MongoDB if available, otherwise falls back to JSON file storage.
    """
    
    def __init__(
        self,
        storage_path: Path | None = None,
        mongodb_persistence: "MongoDBAnalysisPersistenceService | None" = None,
    ) -> None:
        self.mongodb_persistence = mongodb_persistence
        self.storage_path = storage_path or Path(__file__).resolve().parents[2] / "data" / "analyses.json"
        self._lock = Lock()
        
        # Initialize JSON storage as fallback
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.storage_path.exists():
            self.storage_path.write_text("[]\n", encoding="utf-8")

    @classmethod
    def create_default(cls) -> "AnalysisPersistenceService":
        """Create persistence service with default JSON storage."""
        return cls()
    
    @classmethod
    def create_with_mongodb(
        cls,
        mongodb_persistence: "MongoDBAnalysisPersistenceService",
    ) -> "AnalysisPersistenceService":
        """Create persistence service with MongoDB backend."""
        return cls(mongodb_persistence=mongodb_persistence)
    
    @property
    def using_mongodb(self) -> bool:
        """Check if using MongoDB for persistence."""
        return self.mongodb_persistence is not None

    def list_analyses(self) -> list[AnalysisRecord]:
        """Retrieve all analysis records."""
        if self.using_mongodb:
            return self.mongodb_persistence.list_analyses()
        
        with self._lock:
            return self._load_all_from_json()

    def save_analysis(self, analysis: AnalysisRecord) -> AnalysisRecord:
        """Save an analysis record."""
        if self.using_mongodb:
            return self.mongodb_persistence.save_analysis(analysis)
        
        with self._lock:
            analyses = self._load_all_from_json()
            analyses.append(analysis)
            self._write_all_to_json(analyses)
        return analysis
    
    def get_analysis(self, analysis_id: str) -> AnalysisRecord | None:
        """Retrieve a specific analysis by ID."""
        if self.using_mongodb:
            return self.mongodb_persistence.get_analysis(analysis_id)
        
        # Fallback to JSON
        analyses = self.list_analyses()
        for analysis in analyses:
            if analysis.analysis_id == analysis_id:
                return analysis
        return None

    def _load_all_from_json(self) -> list[AnalysisRecord]:
        """Load all analyses from JSON file."""
        raw_content = self.storage_path.read_text(encoding="utf-8").strip()
        if not raw_content:
            return []

        payload = json.loads(raw_content)
        if not isinstance(payload, list):
            return []

        return [AnalysisRecord.model_validate(item) for item in payload]

    def _write_all_to_json(self, analyses: list[AnalysisRecord]) -> None:
        """Write all analyses to JSON file."""
        serialized = [analysis.model_dump() for analysis in analyses]
        self.storage_path.write_text(json.dumps(serialized, indent=2) + "\n", encoding="utf-8")
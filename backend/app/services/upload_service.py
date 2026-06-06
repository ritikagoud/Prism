from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.services.pdf_extraction_service import PDFExtractionError, PDFExtractionService

MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
PDF_SIGNATURE = b"%PDF-"


class UploadValidationError(ValueError):
    pass


@dataclass(slots=True)
class UploadResult:
    file_id: str
    filename: str
    size: int
    extracted_text: str


class UploadService:
    def __init__(self, uploads_dir: Path | None = None) -> None:
        self.uploads_dir = uploads_dir or Path(__file__).resolve().parents[2] / "uploads"
        self.uploads_dir.mkdir(parents=True, exist_ok=True)
        self.pdf_extractor = PDFExtractionService()

    async def store_pdf(self, file: UploadFile) -> UploadResult:
        self._validate_metadata(file)

        file_id = uuid4().hex
        stored_filename = self._build_filename(file_id, file.filename or "document.pdf")
        destination = self.uploads_dir / stored_filename
        size = 0
        signature_checked = False

        try:
            with destination.open("wb") as output:
                while True:
                    chunk = await file.read(1024 * 1024)
                    if not chunk:
                        break

                    if not signature_checked:
                        self._validate_signature(chunk)
                        signature_checked = True

                    size += len(chunk)
                    if size > MAX_UPLOAD_SIZE_BYTES:
                        raise UploadValidationError("File size must not exceed 10 MB.")

                    output.write(chunk)

            extracted_text = self.pdf_extractor.extract_text(destination)
            self.pdf_extractor.store_text_sidecar(destination, extracted_text)
        except PDFExtractionError:
            if destination.exists():
                destination.unlink()
            text_path = destination.with_suffix(".txt")
            if text_path.exists():
                text_path.unlink()
            raise
        except Exception:
            if destination.exists():
                destination.unlink()
            text_path = destination.with_suffix(".txt")
            if text_path.exists():
                text_path.unlink()
            raise
        finally:
            await file.close()

        if not signature_checked:
            raise UploadValidationError("Uploaded file is empty.")

        return UploadResult(file_id=file_id, filename=stored_filename, size=size, extracted_text=extracted_text)

    def _validate_metadata(self, file: UploadFile) -> None:
        if not file.filename:
            raise UploadValidationError("A PDF filename is required.")

        filename = file.filename.lower()
        content_type = (file.content_type or "").lower()

        if not filename.endswith(".pdf"):
            raise UploadValidationError("Only PDF files are supported.")
        if content_type not in {"application/pdf", "application/x-pdf", "application/octet-stream"}:
            raise UploadValidationError("Only PDF files are supported.")

    def _validate_signature(self, chunk: bytes) -> None:
        if not chunk.startswith(PDF_SIGNATURE):
            raise UploadValidationError("Uploaded file is not a valid PDF.")

    def _build_filename(self, file_id: str, original_filename: str) -> str:
        stem = Path(original_filename).stem
        safe_stem = re.sub(r"[^A-Za-z0-9_-]+", "-", stem).strip("-_") or "document"
        return f"{file_id}_{safe_stem}.pdf"

from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader


class PDFExtractionError(RuntimeError):
    pass


class PDFExtractionService:
    def extract_text(self, pdf_path: Path) -> str:
        try:
            reader = PdfReader(str(pdf_path))
        except Exception as exc:  # pragma: no cover - library-specific parsing failures
            raise PDFExtractionError("Unable to read PDF content.") from exc

        extracted_pages: list[str] = []
        for page in reader.pages:
            try:
                page_text = page.extract_text() or ""
            except Exception as exc:  # pragma: no cover - library-specific parsing failures
                raise PDFExtractionError("Unable to extract text from PDF.") from exc

            if page_text:
                extracted_pages.append(page_text)

        return "\n".join(extracted_pages).strip()

    def store_text_sidecar(self, pdf_path: Path, extracted_text: str) -> Path:
        text_path = pdf_path.with_suffix(".txt")
        text_path.write_text(extracted_text, encoding="utf-8")
        return text_path
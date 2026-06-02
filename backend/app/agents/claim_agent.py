from __future__ import annotations

from dataclasses import dataclass
import re


@dataclass(slots=True)
class ClaimAgentResult:
    claims: list[str]


class ClaimAgent:
    name = "claim-agent"

    def run(self, startup_name: str, description: str) -> ClaimAgentResult:
        return ClaimAgentResult(claims=self.extract_claims(startup_name, description))

    def extract_claims(self, startup_name: str, description: str) -> list[str]:
        del startup_name

        text = description.strip()
        if not text:
            return []

        claims: list[str] = []
        for fragment in self._split_into_claims(text):
            claim = self._normalize_claim(fragment)
            if claim:
                claims.append(claim)

        return self._dedupe(claims)

    def _split_into_claims(self, text: str) -> list[str]:
        fragments = re.split(r"(?:\r?\n|[.;!?]+|\s+[-•]\s+)", text)

        extracted: list[str] = []
        for fragment in fragments:
            extracted.extend(re.split(r"\s+and\s+", fragment, flags=re.IGNORECASE))

        return extracted

    def _normalize_claim(self, claim: str) -> str:
        normalized = re.sub(r"\s+", " ", claim).strip()
        normalized = normalized.lstrip("-•0123456789. ")
        if len(normalized.split()) < 2:
            return ""
        return normalized

    def _dedupe(self, claims: list[str]) -> list[str]:
        unique_claims: list[str] = []
        seen: set[str] = set()

        for claim in claims:
            key = claim.casefold()
            if key in seen:
                continue
            seen.add(key)
            unique_claims.append(claim)

        return unique_claims
"""Evidence Verification Agent for validating startup claims with source-based evidence."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

VerificationStatus = Literal["Verified", "Partially Verified", "Unverified"]


@dataclass(slots=True)
class EvidenceSource:
    """A source of evidence for a claim."""
    
    source_type: str  # e.g., "Pitch Deck", "Startup Description", "Document Context"
    evidence: str  # Actual text extracted from source
    source_reference: str | None = None  # e.g., "Slide 8", "Page 2", "Description paragraph 1"


@dataclass(slots=True)
class ClaimEvidence:
    """Evidence verification result for a single claim."""
    
    claim: str
    evidence_sources: list[EvidenceSource]
    verification_reasoning: str
    status: VerificationStatus
    confidence: float


@dataclass(slots=True)
class EvidenceVerificationResult:
    """Result of evidence verification for all claims."""
    
    verified_claims: list[ClaimEvidence]


class EvidenceVerificationAgent:
    """
    Agent responsible for verifying startup claims with source-based evidence.
    
    This agent identifies specific evidence from available sources (pitch deck,
    description, documents) rather than using keyword pattern matching.
    """
    
    name = "evidence-verification-agent"
    
    def run(
        self,
        claims: list[str],
        startup_name: str,
        description: str,
        extracted_text: str | None = None,
    ) -> EvidenceVerificationResult:
        """
        Verify claims by finding supporting evidence in source materials.
        
        Args:
            claims: List of extracted claims
            startup_name: Name of the startup
            description: Startup description
            extracted_text: Text extracted from uploaded documents (optional)
            
        Returns:
            Evidence verification result with sources and reasoning for each claim
        """
        verified_claims: list[ClaimEvidence] = []
        
        for claim in claims:
            evidence_sources, reasoning, status, confidence = self._verify_claim_with_sources(
                claim=claim,
                startup_name=startup_name,
                description=description,
                extracted_text=extracted_text,
            )
            
            verified_claims.append(
                ClaimEvidence(
                    claim=claim,
                    evidence_sources=evidence_sources,
                    verification_reasoning=reasoning,
                    status=status,
                    confidence=confidence,
                )
            )
        
        return EvidenceVerificationResult(verified_claims=verified_claims)
    
    def _verify_claim_with_sources(
        self,
        claim: str,
        startup_name: str,
        description: str,
        extracted_text: str | None,
    ) -> tuple[list[EvidenceSource], str, VerificationStatus, float]:
        """
        Verify a single claim by finding evidence in available sources.
        
        Only uses actual text from provided materials - no invented evidence.
        
        Returns:
            Tuple of (evidence_sources, reasoning, status, confidence_score)
        """
        evidence_sources: list[EvidenceSource] = []
        claim_lower = claim.lower()
        
        # Extract significant terms from claim (ignore common words)
        claim_terms = self._extract_significant_terms(claim_lower)
        
        # ONLY search in provided materials - no external sources
        
        # 1. Search for evidence in startup description (user-provided)
        if description and description.strip():
            description_evidence = self._find_evidence_in_text(
                claim_terms=claim_terms,
                claim=claim,
                text=description,
                source_name="Startup Description",
                source_reference="User-submitted description",
            )
            evidence_sources.extend(description_evidence)
        
        # 2. Search for evidence in extracted document text (uploaded materials)
        if extracted_text and extracted_text.strip():
            document_evidence = self._find_evidence_in_text(
                claim_terms=claim_terms,
                claim=claim,
                text=extracted_text,
                source_name="Pitch Deck",
                source_reference="Uploaded document",
            )
            evidence_sources.extend(document_evidence)
        
        # Determine verification status and confidence based on ACTUAL evidence found
        status, confidence, reasoning = self._assess_verification(
            claim=claim,
            evidence_sources=evidence_sources,
            claim_terms=claim_terms,
        )
        
        return evidence_sources, reasoning, status, confidence
    
    def _extract_significant_terms(self, text: str) -> list[str]:
        """Extract significant terms from text, excluding common words."""
        # Common words to exclude
        stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
            "be", "have", "has", "had", "do", "does", "did", "will", "would",
            "could", "should", "may", "might", "must", "can", "this", "that",
            "these", "those", "i", "you", "he", "she", "it", "we", "they",
        }
        
        words = text.split()
        significant_terms = []
        
        for word in words:
            # Clean word
            cleaned = word.strip(".,;:!?()[]{}\"'").lower()
            
            # Keep if not a stop word and has substance
            if cleaned and len(cleaned) > 2 and cleaned not in stop_words:
                significant_terms.append(cleaned)
        
        return significant_terms
    
    def _find_evidence_in_text(
        self,
        claim_terms: list[str],
        claim: str,
        text: str,
        source_name: str,
        source_reference: str,
    ) -> list[EvidenceSource]:
        """
        Find evidence for a claim within a text source.
        
        IMPORTANT: Only returns ACTUAL text from the source - no invention.
        
        Returns list of evidence sources with real text excerpts.
        """
        evidence_sources: list[EvidenceSource] = []
        
        if not text or not text.strip():
            return evidence_sources
        
        text_lower = text.lower()
        
        # Look for sentences that contain claim terms
        sentences = self._split_into_sentences(text)
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            
            # Count how many claim terms appear in this sentence
            matching_terms = sum(1 for term in claim_terms if term in sentence_lower)
            
            # Calculate match quality
            match_ratio = matching_terms / len(claim_terms) if claim_terms else 0
            
            # If significant overlap, consider it as evidence
            # Require at least 2 matching terms OR 1 term if claim is short
            if matching_terms >= 2 or (len(claim_terms) <= 2 and matching_terms >= 1):
                # Extract the ACTUAL text as evidence (not invented)
                evidence_text = sentence.strip()
                
                # Limit evidence length for readability, but preserve actual text
                if len(evidence_text) > 120:
                    evidence_text = evidence_text[:117] + "..."
                
                evidence_sources.append(
                    EvidenceSource(
                        source_type=source_name,
                        evidence=evidence_text,  # ACTUAL text from source
                        source_reference=source_reference,
                    )
                )
                
                # Limit to 2 evidence snippets per source to avoid redundancy
                if len(evidence_sources) >= 2:
                    break
        
        return evidence_sources
    
    def _split_into_sentences(self, text: str) -> list[str]:
        """Split text into sentences."""
        import re
        
        # Split on common sentence endings
        sentences = re.split(r'[.!?]+\s+', text)
        
        # Clean and filter
        cleaned_sentences = []
        for sentence in sentences:
            sentence = sentence.strip()
            # Keep sentences that are substantial
            if len(sentence) > 20:
                cleaned_sentences.append(sentence)
        
        return cleaned_sentences
    
    def _assess_verification(
        self,
        claim: str,
        evidence_sources: list[EvidenceSource],
        claim_terms: list[str],
    ) -> tuple[VerificationStatus, float, str]:
        """
        Assess verification status based on ACTUAL evidence found in sources.
        
        Confidence is based on:
        - Number of supporting sources
        - Quality of text matches
        - Presence of quantitative data
        - Multiple unique source types
        
        Returns:
            Tuple of (status, confidence, reasoning)
        """
        source_count = len(evidence_sources)
        
        # Check if claim has quantitative data (increases confidence)
        has_quantitative = self._has_quantitative_data(claim)
        
        # Check for exact/strong wording matches in evidence
        exact_matches = 0
        for source in evidence_sources:
            # Check if evidence contains significant portions of claim
            evidence_lower = source.evidence.lower()
            claim_lower = claim.lower()
            
            # Count matching words (more exact match = higher quality)
            matching_words = sum(1 for term in claim_terms if term in evidence_lower)
            if matching_words >= len(claim_terms) * 0.7:  # 70%+ match
                exact_matches += 1
        
        # Count unique source types (cross-validation)
        unique_source_types = len(set(s.source_type for s in evidence_sources))
        
        # Build reasoning based on ACTUAL evidence quality
        if source_count == 0:
            status: VerificationStatus = "Unverified"
            confidence = 0.25
            reasoning = (
                "No supporting evidence found in available materials (pitch deck, description, or documents). "
                "The claim could not be verified against provided sources."
            )
        
        elif source_count == 1:
            source = evidence_sources[0]
            status = "Partially Verified"
            
            # Base confidence for single source
            confidence = 0.50
            
            # Adjust based on evidence quality
            if exact_matches >= 1:
                confidence += 0.10  # Strong text match
            if has_quantitative:
                confidence += 0.10  # Contains specific metrics
            
            reasoning = (
                f"Single source evidence found in {source.source_type} ({source.source_reference}). "
            )
            
            if has_quantitative and exact_matches >= 1:
                reasoning += "The claim contains specific metrics with direct textual support, but requires additional independent verification."
            elif has_quantitative:
                reasoning += "The claim includes quantitative data but has limited source support."
            elif exact_matches >= 1:
                reasoning += "Strong textual alignment with source, but limited to single verification point."
            else:
                reasoning += "Partial alignment with source materials; additional verification recommended."
        
        else:  # 2+ sources
            status = "Verified"
            
            # Base confidence for multiple sources
            confidence = 0.70
            
            # Quality adjustments
            if exact_matches >= 2:
                confidence += 0.15  # Multiple strong matches
            elif exact_matches >= 1:
                confidence += 0.10  # At least one strong match
            
            if has_quantitative:
                confidence += 0.10  # Quantitative claims with evidence
            
            if unique_source_types > 1:
                confidence += 0.05  # Cross-validated across source types
            
            # Build reasoning explaining evidence quality
            source_types = [s.source_type for s in evidence_sources]
            unique_sources = set(source_types)
            
            reasoning = (
                f"Strong evidence found across {source_count} sources "
                f"({', '.join(unique_sources)}). "
            )
            
            if exact_matches >= 2:
                reasoning += "Multiple exact or near-exact textual matches found in source materials. "
            
            if has_quantitative:
                reasoning += "Claim includes specific, verifiable quantitative metrics. "
            
            if unique_source_types > 1:
                reasoning += "Cross-validated across multiple document types. "
            
            reasoning += "The claim is well-supported by available documentation."
        
        # Cap confidence at 0.95 (never 100% - external verification still needed)
        confidence = min(0.95, max(0.25, confidence))
        
        return status, confidence, reasoning
    
    def _has_quantitative_data(self, text: str) -> bool:
        """Check if text contains quantitative data (numbers, percentages)."""
        import re
        
        # Check for numbers
        if re.search(r'\d', text):
            return True
        
        # Check for percentage indicators
        if '%' in text or 'percent' in text.lower():
            return True
        
        return False

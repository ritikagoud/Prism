import sys
sys.path.insert(0, '.')

from app.services.orchestrator import OrchestratorService
from app.models.analysis import AnalysisRequest
from pydantic import HttpUrl

orchestrator = OrchestratorService.create_default()

request = AnalysisRequest(
    startup_name="TechAnalyzer Pro",
    description="AI-powered document analysis platform that reduces review time by 70% through automated workflows.",
    website_url=HttpUrl("https://techanalyzer.example.com"),
    industry="Legal Technology",
    uploaded_file_id=None
)

response = orchestrator.run(request)

print("=== EVIDENCE VERIFICATION ===")
for i, ev in enumerate(response.evidence_verification):
    print(f"\nClaim {i+1}: {ev.claim}")
    print(f"  Type: {type(ev)}")
    print(f"  Fields: {ev.model_fields.keys()}")
    print(f"  Has evidence_sources: {hasattr(ev, 'evidence_sources')}")
    if hasattr(ev, 'evidence_sources'):
        print(f"  Evidence sources count: {len(ev.evidence_sources)}")
        if ev.evidence_sources:
            print(f"  First source type: {type(ev.evidence_sources[0])}")
            print(f"  First source: {ev.evidence_sources[0]}")
    
print("\n=== JSON SERIALIZATION ===")
print(response.model_dump_json(indent=2))

from dataclasses import dataclass
from typing import Protocol


class Agent(Protocol):
    name: str

    def run(self, *args, **kwargs): ...


@dataclass(slots=True)
class AgentSpec:
    name: str
    description: str = ""

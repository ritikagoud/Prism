from collections.abc import Iterable

from app.agents.base import AgentSpec


class AgentRegistry:
    def __init__(self) -> None:
        self._agents: dict[str, AgentSpec] = {}

    def register(self, agent: AgentSpec) -> None:
        self._agents[agent.name] = agent

    def get(self, name: str) -> AgentSpec | None:
        return self._agents.get(name)

    def list(self) -> list[AgentSpec]:
        return list(self._agents.values())

    def extend(self, agents: Iterable[AgentSpec]) -> None:
        for agent in agents:
            self.register(agent)

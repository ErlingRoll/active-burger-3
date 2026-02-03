
from math import floor
from pydantic import BaseModel

from src.connection_manager import GameEvent


class HitResult(BaseModel):
    damage: int
    critical: bool


class DamageHitEventPayload(BaseModel):
    hit: "HitResult"
    target_id: str
    source_id: str | None = None


class DamageHitEvent(GameEvent):
    event: str = "damage_hit"
    payload: DamageHitEventPayload


class DamageHit(BaseModel):
    physical: int = 0
    fire: int = 0
    cold: int = 0
    lightning: int = 0
    chaos: int = 0
    critical: bool = False
    critical_multiplier: int = 0

    def total_damage(self) -> int:
        elemental = self.elemental_damage()
        physical = self.physical_damage()
        chaos = self.chaos_damage()
        total_flat = physical + elemental + chaos
        return floor(total_flat)

    def elemental_damage(self) -> int:
        flat = self.fire + self.cold + self.lightning
        return floor(flat + self._crit_damage(flat))

    def physical_damage(self) -> int:
        flat = self.physical
        return floor(flat + self._crit_damage(flat))

    def chaos_damage(self) -> int:
        flat = self.chaos
        return floor(flat + self._crit_damage(flat))

    def _crit_damage(self, damage) -> float:
        if not self.critical:
            return 0

        return damage * (self.critical_multiplier / 100)

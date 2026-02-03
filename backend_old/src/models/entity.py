from src.models.damage_hit import DamageHit, HitResult
from .render_object import RenderObject


class Entity(RenderObject):
    type: str = "entity"
    max_hp: int
    current_hp: int
    db_type: str = "entity"
    level: int = 1
    regen: int = 1

    def damage(self, hit: DamageHit) -> HitResult:
        damage = hit.total_damage()
        self.current_hp -= damage
        if self.current_hp < 0:
            self.current_hp = 0
        return HitResult(damage=damage, critical=hit.critical)

    def heal(self, amount: int):
        self.current_hp += amount
        if self.current_hp > self.max_hp:
            self.current_hp = self.max_hp

    def is_alive(self) -> bool:
        return self.current_hp > 0

    def is_dead(self) -> bool:
        return self.current_hp <= 0

    def roll_damage(self) -> int:
        raise NotImplementedError("roll_damage must be implemented by subclasses")

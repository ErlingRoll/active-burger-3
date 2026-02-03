from src.generators.dice import roll, roll_chance
from src.models.items.mods import WeaponMod
from src.models import Entity
from src.models.objects.loot_table import Lootable
from src.models.damage_hit import DamageHit, HitResult


class Monster(Entity, Lootable):
    type: str = "monster"
    solid: bool = True
    name_visible: bool = True

    def damage(self, hit: DamageHit) -> HitResult:
        damage = hit.total_damage()
        self.current_hp -= damage
        if self.current_hp < 0:
            self.current_hp = 0
        return HitResult(damage=damage, critical=hit.critical)

    def roll_loot(self, fortune: int = 0):
        return self.loot_table.roll_loot(fortune=fortune)

    def roll_hit(self) -> DamageHit:
        weapon_mods = self.props.get("weapon_mods", {})
        if not weapon_mods:
            print(f"Monster {self.name} has no weapon mods defined")
            return DamageHit()

        total_physical = weapon_mods.get(WeaponMod.PHYSICAL_DAMAGE.value, 0) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_DAMAGE.value, 0)) // 100)
        total_fire = weapon_mods.get(WeaponMod.FIRE_DAMAGE.value, 0) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_DAMAGE.value, 0)) // 100) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value, 0)) // 100)
        total_cold = weapon_mods.get(WeaponMod.COLD_DAMAGE.value, 0) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_DAMAGE.value, 0)) // 100) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value, 0)) // 100)
        total_lightning = weapon_mods.get(WeaponMod.LIGHTNING_DAMAGE.value, 0) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_DAMAGE.value, 0)) // 100) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_ELEMENTAL_DAMAGE.value, 0)) // 100)
        total_chaos = weapon_mods.get(WeaponMod.CHAOS_DAMAGE.value, 0) \
            * ((100 + weapon_mods.get(WeaponMod.INCREASED_DAMAGE.value, 0)) // 100)
        added_crit_chance = (weapon_mods.get(WeaponMod.ADDED_CRIT_CHANCE.value, 0) * ((100 + weapon_mods.get(WeaponMod.INCREASED_CRIT_CHANCE.value, 0)) / 100)) \
            // 100

        luck = weapon_mods.get(WeaponMod.LUCK.value, 0)

        hit = DamageHit(
            physical=roll(total_physical, 0, luck=luck),
            fire=roll(total_fire, 0, luck=luck),
            cold=roll(total_cold, 0, luck=luck),
            lightning=roll(total_lightning, 0, luck=luck),
            chaos=roll(total_chaos, 0, luck=luck),
            critical=roll_chance() < (0.05 + added_crit_chance),
            critical_multiplier=50 + weapon_mods.get(WeaponMod.CRIT_MULTIPLIER.value, 0)
        )

        return hit

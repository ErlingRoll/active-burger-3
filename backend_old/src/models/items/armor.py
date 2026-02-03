from src.generators.dice import roll, roll_chance
from src.models.damage_hit import DamageHit
from src.models.equipment import EquipSlot, Equipment
from src.models.items.mods import ArmorMod, armor_mod_value


class Armor(Equipment):
    type: str = "armor"
    equip_slot: str = EquipSlot.ARMOR.value

    def defend_hit(self, hit: DamageHit) -> DamageHit:
        return hit


class Hoodie(Armor):
    item_id: str = "hoodie"
    name: str = "Hoodie"
    description: str = "A comfy looking hoodie. Provides minimal protection."
    texture: str = "item/armor/hoodie"
    value: int = 500
    base_mods: dict[str, int] = {
        ArmorMod.MAX_HP.value: 50,
        ArmorMod.PHYSICAL_RESISTANCE.value: 10,
    }

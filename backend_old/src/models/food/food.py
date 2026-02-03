from src.models import Item


class Food(Item):
    type: str = "food"
    stackable: bool = True
    count: int = 1
    consumable: bool = True

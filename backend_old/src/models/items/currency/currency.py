from pydantic import BaseModel
from src.models.equipment import Equipment
from src.models.item import Item


class ApplyCheckResult(BaseModel):
    success: bool
    message: str = ""


class Currency(Item):
    type: str = "currency"
    stackable: bool = True
    count: int = 1

    def apply_check(self, equipment: Equipment) -> ApplyCheckResult:
        return ApplyCheckResult(success=True)

    def apply_to(self, equipment: Equipment) -> Equipment:
        raise NotImplementedError("This method should be overridden by subclasses")

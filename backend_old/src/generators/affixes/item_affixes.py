from __future__ import annotations
from typing import TYPE_CHECKING
import random

if TYPE_CHECKING:
    from src.models.item import Item


def replace_item_affixes(item: Item) -> None:
    item.props["prefix"] = random.choice(item_prefixes)
    item.props["suffix"] = random.choice(item_suffixes)


def remove_item_affixes(item: Item) -> None:
    item.props.pop("prefix", None)
    item.props.pop("suffix", None)


item_prefixes = [
    "Unfriendly",
    "Questionable",
    "Badonkers",
    "Based",
    "Sigma's",
    "Ola's",
    "Bwoken",
    "Quantum",
    "Moist",
    "Skibidi",
    "Rizzed",
    "Boomer's",
    "Corporate",
    "AI-Generated",
    "Gluten-Free",
    "Tax-Deductible",
    "Delusional",
    "Chat-banned",
    "Soggy",
    "Stinky",
    "Cromulent",
    "Drunk",
    "Cringe",
    "1337",
    "Stonks",
    "Sussy",
]

item_suffixes = [
    "Bitcoin",
    "Gamba",
    "Diarrhea",
    "Inconvenience",
    "Doomscrolling",
    "the Ohio Realm",
    "Infinite Rizz",
    "Emotional Damage",
    "Tickling",
    "the Backrooms",
    "Gooning",
    "Memes",
    "Weak Wi-Fi",
    "Wombo Combo",
    "the Algorithm",
    "Edging",
    "Insomnia",
    "Gaslighting",
    "Deadass",
    "the Grindset",
    "Snus",
    "Paid DLC",
    "Depression",
    "Procrastination",
    "Dark Souls",
    "Embiggening",
    "Dung",
    "Feet",
    "😎",
    "💩",
    "🧠"
]

from random import random, randint


def roll_chance(luck: int = 0):
    # Roll between 0.0 and 1.0
    roll = random()
    unlucky = luck < 0
    for _ in range(abs(luck)):
        new_roll = random()
        if unlucky:
            roll = min(roll, new_roll)
        else:
            roll = max(roll, new_roll)

    return roll


def roll(max_value: int = 100, min_value: int = 0, luck: int = 0, reverse: bool = False) -> int:
    roll = randint(min_value, max_value)
    unlucky = luck < 0
    for _ in range(abs(luck)):
        new_roll = randint(min_value, max_value)
        if (not reverse and unlucky) or (reverse and not unlucky):
            roll = min(roll, new_roll)
        else:
            roll = max(roll, new_roll)

    return roll

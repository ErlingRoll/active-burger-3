import { HitResult } from "../../../../../contexts/gamestate-context"
import { textures } from "../../../../../main"

export function drawLastDamageHit(damageHits: HitResult[]) {
    const hitEvent = damageHits[0]
    if (!hitEvent) return
    const targetCell = document.getElementById(`tile-${hitEvent.tile.x}_${hitEvent.tile.y}`)
    if (!targetCell) return
    const fxLayer = document.getElementById("fx-layer")
    if (!fxLayer) return

    const r = targetCell.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.bottom - 20 // start just above the bottom of the tile

    const damageContainer = document.createElement("div")
    damageContainer.className = "flex items-end"
    Object.assign(damageContainer.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        willChange: "transform, opacity",
    })

    const damageText = document.createElement("p")
    damageText.className = `text-danger dark-shadow`
    Object.assign(damageText.style, {
        fontSize: hitEvent.critical ? "2rem" : "1.8rem",
        fontWeight: hitEvent.critical ? "bolder" : "bold",
    })
    damageText.innerText = hitEvent.damage.toString()
    damageContainer.appendChild(damageText)

    if (hitEvent.critical) {
        const critImg = document.createElement("img")
        critImg.src = textures["/src/assets/textures/symbol/crit.png"] as string
        critImg.className = "w-4 h-4 mb-1"
        damageContainer.appendChild(critImg)
    }

    fxLayer.appendChild(damageContainer)

    // small horizontal jitter so multiple hits don't overlap perfectly
    const jx = (Math.random() * 2 - 1) * 10
    const duration = 2000

    // 3) Animate up & fade, then remove
    damageContainer
        .animate(
            [
                { transform: `translate(-50%, -50%) translate(${jx}px, 0)`, opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${jx}px, -20px)`, opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${jx}px, -40px)`, opacity: 0.7 },
                { transform: `translate(-50%, -50%) translate(${jx}px, -45px)`, opacity: -1 },
            ],
            { duration, easing: "cubic-bezier(.01,.64,.17,1)", fill: "forwards" }
        )
        .finished.catch(() => {}) // ignore if animation is canceled
        .finally(() => damageContainer.remove())
}

// For each hit. Make the monster bob up and down slightly, and maybe add a red flash to the monster tile?
export function playMonsterAttackAnimation(hitResults: HitResult[]) {
    console.log("Playing monster attack animation for hits:", hitResults)
    for (const hit of hitResults) {
        console.log("Processing hit:", hit)
        const targetCell = document.getElementById(`tile-${hit.tile.x}_${hit.tile.y}`)
        if (!targetCell) {
            console.warn("Could not find target cell for hit:", hit)
            continue
        }
        const monsterImg = document.getElementById(`monster-${hit.monsterId}`) as HTMLImageElement
        if (!monsterImg) {
            console.warn("Could not find monster image for hit:", hit)
            continue
        }

        // Animate monster bobbing
        monsterImg.animate(
            [{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }],
            { duration: 300, easing: "ease-out", fill: "forwards" }
        )

        // Add a red flash overlay
        const flash = document.createElement("div")
        Object.assign(flash.style, {
            position: "absolute",
            left: `${targetCell.getBoundingClientRect().left}px`,
            top: `${targetCell.getBoundingClientRect().top}px`,
            width: `${targetCell.offsetWidth}px`,
            height: `${targetCell.offsetHeight}px`,
            backgroundColor: "rgba(255, 255, 0, 0.5)",
            pointerEvents: "none",
        })
        document.body.appendChild(flash)
        flash
            .animate([{ opacity: 0.5 }, { opacity: 0 }], { duration: 300, easing: "ease-out", fill: "forwards" })
            .finished.catch(() => {})
            .finally(() => flash.remove())
    }
}

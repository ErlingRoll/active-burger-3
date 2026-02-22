import { HitResult } from "../../../../../contexts/gamestate-context"
import { textures } from "../../../../../main"

export function drawLastDamageHit(damageHits: HitResult[]) {
    const hitEvent = damageHits[0]
    if (!hitEvent) return
    const targetCell = document.getElementById(`monster-${hitEvent.monsterId}`)
    if (!targetCell) return
    const fxLayer = document.getElementById("fx-layer")
    if (!fxLayer) return

    const r = targetCell.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top

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

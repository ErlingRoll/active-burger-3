import { useContext, useEffect, useMemo, PointerEvent, MouseEvent, useState } from "react"
import { GamestateContext } from "../../../contexts/gamestate-context"
import { CharactersContext } from "../../../contexts/characters-context"
import { UIContext } from "../../../contexts/ui-context"
import { Character, Entity, RenderObject } from "../../../models/object"
import { Terrain } from "../../../models/terrain"

const textures = import.meta.glob("/src/assets/textures/**/*", { as: "url", eager: true })

type GameGridProps = {
    center?: { x: number; y: number; zoom: number }
    renderWidth?: number
    renderHeight?: number
    hoverHighlight?: boolean
    showSelectedCell?: boolean
    onCellClick?: ({ x, y, event }: { x: number; y: number; event: MouseEvent }) => void
    onCellDown?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    onCellEnter?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    onCellLeave?: ({ x, y, event }: { x: number; y: number; event: PointerEvent }) => void
    editMode?: boolean
}

const GameGrid = ({
    center,
    renderWidth = 23,
    renderHeight = 19,
    hoverHighlight = false,
    showSelectedCell = true,
    onCellClick,
    onCellDown,
    onCellEnter,
    onCellLeave,
    editMode = false,
}: GameGridProps) => {
    const { realmSettings, gamestate, terrain, damageHits } = useContext(GamestateContext)
    const { characters: character } = useContext(CharactersContext)
    const { showGrid } = useContext(UIContext)

    const cellName = (x: number, y: number) => `cell-${x},${y}`
    const terrainCellName = (x: number, y: number) => `terrain-${x},${y}`

    function camera() {
        if (editMode && center) return center
        if (!character) return
        return center || { x: character.x, y: character.y, zoom: 1 }
    }

    function drawLastDamageHit() {
        const hitEvent = damageHits[0]
        if (!hitEvent) return
        const targetCell = document.getElementById(`object-${hitEvent.target_id}`)
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
            fontSize: hitEvent.hit.critical ? "1.4rem" : "1.3rem",
            fontWeight: hitEvent.hit.critical ? "bold" : "normal",
        })
        damageText.innerText = hitEvent.hit.damage
        damageContainer.appendChild(damageText)

        if (hitEvent.hit.critical) {
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

    useEffect(() => {
        drawLastDamageHit()
    }, [damageHits])

    function drawObjectCell(obj: RenderObject & Entity & Character, cell: HTMLElement) {
        cell.innerHTML = ""

        // Obj container
        const div = document.createElement("div")
        div.id = `object-${obj.id}`
        div.className = "absolute top-0 left-0 h-full w-full flex flex-col items-center"
        cell.appendChild(div)

        // Add Name
        if (obj.name_visible) {
            const nameContainer = document.createElement("div")
            const nameTagHeightHolder = document.createElement("p")
            nameTagHeightHolder.innerHTML = "&nbsp;"
            nameTagHeightHolder.className = "text-transparent text-[0.7rem] user-select-none select-none"
            nameContainer.appendChild(nameTagHeightHolder)
            const nameTag = document.createElement("p")
            nameTag.className =
                "absolute top-0 left-1/2 transform -translate-x-1/2 text-[0.7rem] text-blue-100 drop-shadow-[0.1px_0.3px_1px_rgb(0,0,0)] font-bold whitespace-nowrap z-10"
            nameTag.innerText = obj.name
            nameContainer.appendChild(nameTag)
            div.appendChild(nameContainer)
        }

        // Add HP bar
        if (obj.max_hp! != null && obj.current_hp != null && obj.current_hp < obj.max_hp) {
            const hpBarContainer = document.createElement("div")
            hpBarContainer.className =
                "w-10 h-2 bg-red-200 rounded border-2 border-dark overflow-hidden pointer-events-none"
            const hpBar = document.createElement("div")
            hpBar.className = "h-2 bg-red-600"
            const hpPercent = Math.max(0, (obj.current_hp / obj.max_hp) * 100)
            hpBar.style.width = hpPercent + "%"
            hpBarContainer.appendChild(hpBar)
            div.appendChild(hpBarContainer)
        }

        if (obj.type !== "character" && obj.texture) {
            const imgContainer = document.createElement("div")
            imgContainer.className = "w-full flex-1 flex"
            const texture = textures[`/src/assets/textures/${obj.texture}.png`]
            imgContainer.style.backgroundImage = `url('${texture}')`
            imgContainer.style.backgroundSize = "contain"
            imgContainer.style.backgroundRepeat = "no-repeat"
            imgContainer.style.backgroundPosition = "center"
            if (obj.direction === "left") imgContainer.style.transform = "scaleX(-1)"
            div.appendChild(imgContainer)
            return
        }

        if (obj.type === "character") {
            const isDead = obj.current_hp !== undefined && obj.max_hp !== undefined && obj.current_hp <= 0
            const imgContainer = document.createElement("div")
            imgContainer.className = "w-full flex-1 flex"
            let texture =
                textures[`/src/assets/textures/character/custom/${obj.id}.gif`] ||
                textures[`/src/assets/textures/character/custom/${obj.id}.png`] ||
                textures[`/src/assets/textures/character/among_us.png`]
            imgContainer.style.backgroundImage = `url('${texture}')`
            imgContainer.style.backgroundSize = "contain"
            imgContainer.style.backgroundRepeat = "no-repeat"
            imgContainer.style.backgroundPosition = "center"
            if (isDead) imgContainer.style.transform = "rotate(270deg)"
            if (obj.direction === "left" && !isDead) imgContainer.style.transform = "scaleX(-1)"
            div.appendChild(imgContainer)
            return
        }
    }

    function drawPlayer() {
        if (!character) return
        const cell = document.getElementById("player-" + cellName(character.x, character.y))
        if (!cell) return
        drawObjectCell(character as any, cell)
    }

    function drawObjects(objects: { [id: string]: RenderObject & Entity & Character }) {
        const _center = camera()
        const pos_list: { x: number; y: number }[] = Array.from({ length: renderWidth * renderHeight }).map(
            (_, index) => {
                const wx = (index % renderWidth) + Math.floor(_center.x - renderWidth / 2) + 1
                const wy = Math.floor(renderHeight / 2) - Math.floor(index / renderWidth) + _center.y
                return { x: wx, y: wy }
            }
        )

        for (const pos of pos_list) {
            const worldX = pos.x
            const worldY = pos.y
            const cell = document.getElementById(cellName(worldX, worldY))
            if (!cell) continue
            cell.innerHTML = ""
            const pos_objects: (RenderObject & Entity & Character)[] = objects[`${pos.x}_${pos.y}`] as any
            if (!pos_objects) continue
            for (const obj of pos_objects) {
                if (obj.id === character.id && !editMode) continue
                drawObjectCell(obj, cell)
            }
        }
    }

    const cellSignatures = new Map<string, string>() // id -> sig

    function terrainKey(x: number, y: number) {
        return x + "_" + y
    }

    function makeSignature(list: Terrain[] | undefined): string {
        // Cheap, order-sensitive signature. Adjust if you reorder arrays elsewhere.
        if (!list || list.length === 0) return ""
        // join a few cheap stable props
        return list.map((t) => `${t.texture}.${t.ext ?? "png"}#${t.z}`).join("|")
    }

    function drawTerrain(terrainData: { [pos: string]: Terrain[] }) {
        const { x: cx, y: cy } = camera()

        // Precompute viewport extents
        const startX = Math.floor(cx - renderWidth / 2) + 1
        const endX = startX + renderWidth - 1

        const startY = Math.floor(cy + renderHeight / 2)
        const endY = startY - (renderHeight - 1)

        // Iterate rows top -> bottom, then columns left -> right
        for (let wy = startY; wy >= endY; wy--) {
            for (let wx = startX; wx <= endX; wx++) {
                const id = terrainCellName(wx, wy)
                const tCell = document.getElementById(id)
                if (!tCell) continue

                const terrains = terrainData[terrainKey(wx, wy)]
                const sig = makeSignature(terrains)
                if (cellSignatures.get(id) === sig) {
                    // Unchanged: skip all DOM work
                    continue
                }
                cellSignatures.set(id, sig)

                if (!terrains || terrains.length === 0) {
                    // Fast clear
                    tCell.replaceChildren()
                    continue
                }

                // Build off-DOM, then swap in once
                const frag = document.createDocumentFragment()

                const container = document.createElement("div")
                container.className = "absolute top-0 left-0 h-full w-full flex flex-col items-center"

                for (let i = 0; i < terrains.length; i++) {
                    const terrain = terrains[i]
                    const img = document.createElement("img")
                    // If textures is a plain object, property access is cheaper than template + bracket; keep the template only for the path:
                    const srcKey = `/src/assets/textures/${terrain.texture}.${terrain.ext || "png"}`
                    img.src = (textures as Record<string, string>)[srcKey]
                    img.className = "absolute top-0 h-full" // keep classes static
                    img.style.zIndex = String(terrain.z) // set z via style only
                    container.appendChild(img)
                }

                frag.appendChild(container)
                tCell.replaceChildren(frag)
            }
        }
    }

    function getSelectedCell() {
        if (editMode) return null
        if (!character || !gamestate) return
        const x = character.x
        const y = character.y

        const newPosMap = {
            up: { x: x, y: y + 1 },
            down: { x: x, y: y - 1 },
            left: { x: x - 1, y: y },
            right: { x: x + 1, y: y },
        }

        return newPosMap[character.direction]
    }

    const selectedCell = useMemo(() => getSelectedCell(), [character])

    useEffect(() => {
        if (!character || editMode) return
        drawPlayer()
    }, [character])

    useEffect(() => {
        drawTerrain(terrain)
    }, [character, terrain, center])

    useEffect(() => {
        if (!gamestate.position_objects) return
        drawObjects(gamestate.position_objects as any)
    }, [character, gamestate, center])

    return (
        <div
            id="game-grid"
            className={`grid auto-rows-[64px] gap-0 border border-gray-100/30`}
            style={{
                gridTemplateColumns: `repeat(${renderWidth}, ${64 * camera().zoom}px)`,
                gridTemplateRows: `repeat(${renderHeight}, ${64 * camera().zoom}px)`,
            }}
        >
            {Array.from({ length: renderWidth * renderHeight }).map((_, index) => {
                const _center = camera()
                const wx = (index % renderWidth) + Math.floor(_center.x - renderWidth / 2) + 1
                const wy = Math.floor(renderHeight / 2) - Math.floor(index / renderWidth) + _center.y
                return (
                    <div
                        key={index}
                        className={`relative`}
                        onPointerDown={(event) => onCellDown && onCellDown({ x: wx, y: wy, event: event })}
                        onPointerEnter={(event) => onCellEnter && onCellEnter({ x: wx, y: wy, event: event })}
                        onPointerLeave={(event) => onCellLeave && onCellLeave({ x: wx, y: wy, event: event })}
                    >
                        {showGrid && (
                            <p className="absolute bottom-0 left-0 ml-[1px] text-[0.8rem] text-light drop-shadow-[0.1px_0.3px_1px_rgb(0,0,0)] z-1000 pointer-events-none">{`${wx}, ${wy}`}</p>
                        )}
                        <img
                            src={textures[`/src/assets/textures/${realmSettings.background}.png`]}
                            className="absolute top-0 left-0 w-full h-full"
                        />
                        <div className="absolute top-0 left-0 w-full h-full" id={terrainCellName(wx, wy)} />
                        <div
                            id={cellName(wx, wy)}
                            className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-around z-10"
                        />
                        <div
                            id={"player-" + cellName(wx, wy)}
                            className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-around z-10"
                        />
                        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-light opacity-10" />
                        {showSelectedCell && selectedCell && selectedCell.x === wx && selectedCell.y === wy && (
                            <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-primary z-50" />
                        )}
                        <div
                            className={`absolute top-0 left-0 w-full h-full z-60 border-orange-300 border-dashed ${
                                hoverHighlight && "cursor-pointer hover:border-2"
                            }`}
                            onClick={(event) => onCellClick && onCellClick({ x: wx, y: wy, event: event })}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default GameGrid

import { useContext, useMemo, useState } from "react"
import DOMpurify from "dompurify"
import { GamestateContext } from "../../../../../contexts/gamestate-context"
import { PlayerContext } from "../../../../../contexts/player-context"

const tabs = ["Chat", "Game"]

const Log = () => {
    const [tab, setTab] = useState<number>(1)
    const [message, setMessage] = useState<string>("")

    const { log, chatMessages } = useContext(GamestateContext)
    const { gameActions } = useContext(PlayerContext)

    const tabName = useMemo(() => {
        return tabs[tab]
    }, [tab])

    function sendMessage() {
        const _message = message.trim()
        if (!_message) return
        gameActions.sendChatMessage({ message: _message })
        setMessage("")
    }

    return (
        <div className="bg-dark/90 min-h-64 center-col text-light rounded select-text pointer-events-auto justify-between! overflow-hidden">
            <div className="w-full flex flex-row items-stretch justify-between">
                {tabs.map((t, i) => (
                    <button
                        key={t}
                        className={`inline h-full text-lg font-bold px-4 rounded-none! ${
                            tab !== i && "bg-light text-dark"
                        }`}
                        onClick={() => setTab(i)}
                    >
                        {t}
                    </button>
                ))}
                <div className="min-w-24 grow bg-light" />
            </div>
            {tabName === "Chat" && (
                <div>
                    <div className="flex flex-col-reverse gap-1 min-h-38 max-h-64 min-w-32 w-[20vw] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 pb-0">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="bg-light/20 rounded-xs py-[1px] px-[0.3rem]">
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: DOMpurify.sanitize(
                                            `[${new Date(msg.timestamp).toLocaleTimeString("no")}] ${
                                                msg.character_name
                                            }: ${msg.message}`
                                        ),
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full box-border bg-light/80 text-dark p-1 outline-none rounded"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                    </div>
                </div>
            )}
            {tabName === "Game" && (
                <div className="flex flex-col-reverse gap-1 min-h-38 max-h-64 min-w-32 w-[20vw] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                    {log.map((msg, index) => (
                        <div key={index} className="bg-light/20 rounded-xs py-[1px] px-[0.3rem]">
                            {msg}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Log

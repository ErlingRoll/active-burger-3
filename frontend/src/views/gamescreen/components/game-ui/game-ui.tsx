import { useContext } from "react"
import { UIContext } from "../../../../contexts/ui-context"
import SettingsMenu from "./components/settings-menu"
import { ToastContainer } from "react-toastify"

const GameUI = ({ selectedCell }: { selectedCell: { x: number; y: number } | null }) => {
    const { shopOpen, craftingBenchOpen } = useContext(UIContext)

    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center overflow-hidden select-none z-200 pointer-events-none">
            <ToastContainer
                position="top-right"
                limit={5}
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={true}
                closeButton={false}
                rtl={false}
                theme="dark"
                className={"cursor-pointer pointer-events-auto"}
                toastClassName={"bg-dark! border-2 border-primary"}
            />
            <div className="absolute flex flex-col items-end p-4 bottom-0 right-0 gap-4 pointer-events-none">
                <SettingsMenu />
                {/* <Log /> */}
            </div>
            {/* {shopOpen && <Shop />}
            {craftingBenchOpen && <CraftingBench />} */}
        </div>
    )
}

export default GameUI

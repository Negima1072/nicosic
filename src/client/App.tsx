import { MainFrame } from "./components/MainFrame/MainFrame";
import { SideBar } from "./components/SideBar/SideBar";

export const App = () => {
    return (
        <div id="container">
            <div id="main">
                <SideBar />
                <MainFrame />
            </div>
            <div id="controller">
                Controller
            </div>
        </div>
    );
};

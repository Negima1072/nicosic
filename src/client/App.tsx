import { MainFrame } from "./components/MainFrame/MainFrame";
import { SideMenu } from "./components/SideMenu/SideMenu";

export const App = () => {
    return (
        <div id="container">
            <div id="main">
                <SideMenu />
                <MainFrame />
            </div>
            <div id="controller">Controller</div>
        </div>
    );
};

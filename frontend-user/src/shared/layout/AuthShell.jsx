import { Outlet } from "react-router-dom";
import PageTransition from "../ui/PageTransition";
import Toaster from "../ui/Toaster";

const AuthShell = () => {
    return (
        <>
            <main>
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Toaster />
        </>
    );
};

export default AuthShell;

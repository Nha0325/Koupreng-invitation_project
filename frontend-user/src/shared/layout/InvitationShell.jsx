import { Outlet } from "react-router-dom";
import PageTransition from "../ui/PageTransition";


const InvitationShell = () => {
    return (
        <PageTransition>
            <Outlet />
        </PageTransition>
    );
};

export default InvitationShell;

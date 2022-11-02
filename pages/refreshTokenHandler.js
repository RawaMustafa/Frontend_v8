import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import Axios from "./api/Axios";


const RefreshTokenHandler = (props) => {
    const { data: session } = useSession();

    useEffect(() => {
        if (!!session) {
            // We did set the token to be ready to refresh after 23 hours, here we set interval of 23 hours 30 minutes.
            const timeRemaining = Math.round((((session.accessTokenExpiry * 1000) - Date.now()) / 1000));

            if (timeRemaining <= 0) {
                const logOut = async () => {
                    await Axios.post("/users/logOut");
                }
                logOut();
                signOut({ callbackUrl: '/Login', redirect: true });
            }
            props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
        }
    }, [session, props]);

    return null;
}

export default RefreshTokenHandler;
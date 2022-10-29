
import UserHeader from "../Component/UserHeader"

const ResellerLayout = ({ children }) => {

    return (

        < >
            <UserHeader />
            <div className=" pt-28  scrollbar-hide  ">
                {children}
            </div>

        </>
    );
}
export default ResellerLayout;
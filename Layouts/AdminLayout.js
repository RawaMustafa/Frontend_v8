
import Header from "../Component/Header"
import Sidebar from "../Component/Sidebar"
 

const AdminLayout = ({ children }) => {

    return (

        < >
            <Header />
            <div className="rtl:lg:mr-72   ltr:lg:mr-10 rtl:lg:ml-10 ltr:lg:ml-72  pt-28  scrollbar-hide  ">

                {children}
            </div>

            <Sidebar />
        </>
    );
}
export default AdminLayout;
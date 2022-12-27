
import Header from "../Component/Header"
import Sidebar from "../Component/Sidebar"
 

const AdminLayout = ({ children }) => {

    return (

        <div className="">
            <Header />
            <div className="rtl:lg:mr-64 mx-2  ltr:lg:mr-5  rtl:lg:ml-10 ltr:lg:ml-64  pt-28  scrollbar-hide standalone:pt-40 standalone:mb-10 ">
                {children}
            </div>

            <Sidebar />
            <div className="mb-80"></div>
        </div>
    );
}
export default AdminLayout;
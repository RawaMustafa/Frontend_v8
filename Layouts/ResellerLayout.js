
import QarzHeader from "../Component/ResellerHeader"
import QarzSidebar from "../Component/ResellerSidebar"

const QarzLayout = ({ children }) => {

    return (

        < >
            <QarzHeader />
            <div className="rtl:lg:mr-64  ltr:lg:mr-5 rtl:lg:ml-5 ltr:lg:ml-64 pt-28  scrollbar-hide  ">

                {children}
            </div>
            <QarzSidebar />

        </>
    );
}
export default QarzLayout;
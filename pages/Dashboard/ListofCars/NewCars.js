import useLanguage from '../../../Component/language';
import Paint from '../../../Component/Paint';
import AdminLayout from '../../../Layouts/AdminLayout';
import Head from 'next/head'
import { useState, useEffect } from "react"
import axios from "axios"
import Axios from "../../api/Axios";
import { ToastContainer, toast, } from 'react-toastify';
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/router';





export const getServerSideProps = async ({ req }) => {
    const session = await getSession({ req })



    if (!session || !session?.userRole == "Admin") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }

        }
    }



    return {
        props: {
            SessionID: session.id,

        }
    }
}



const NewCars = ({ SessionID }) => {

    const session = useSession()
    const router = useRouter()

    const [page, setPage] = useState(1)
    const [UserQarz, setUserQarz] = useState({})
    const [pictureandvideorepair, setPictureandvideorepair] = useState([])
    const [pictureandvideodamage, setPictureandvideodamage] = useState([])
    const [FirstImage, setFirstImage] = useState([])
    const [CarDamage, setCarDamage] = useState([])
    const [Note, setNote] = useState('')
    const [QarzUserId, setQarzUserId] = useState("")
    const [IsCanvasChanged, setIsCanvasChanged] = useState(1)


    const GlobalState = {
        IsCanvasChanged, setIsCanvasChanged
    }

    const [Data, setData] = useState({

        'Tocar': "Sedan",
        "Price": 0,
        "IsSold": "",
        "ModeName": "",
        "Model": "",
        "Color": "",
        "Mileage": "",
        "VINNumber": "",
        "WheelDriveType": "",



        "PricePaidbid": 0,
        // "UserGiven": "",
        "Tobalance": "",
        "Tire": "",
        "Location": "",
        "Date": "",
        // "ArrivedToKurd": "",
        // "ArrivedToDoubai": "",
        "FeesinAmericaStoragefee": 0,
        "FeesinAmericaCopartorIAAfee": 0,

        "FeesAndRepaidCostDubairepairCost": 0,
        // "FeesAndRepaidCostDubaiFees": "",
        "FeesAndRepaidCostDubaiothers": 0,
        "FeesAndRepaidCostDubainote": "",

        "CoCCost": 0,

        "TransportationCostFromAmericaLocationtoDubaiGCostLocation": "",
        "TransportationCostFromAmericaLocationtoDubaiGCostTranscost": 0,
        "TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost": 0,

        "DubaiToIraqGCostTranscost": 0,
        "DubaiToIraqGCostgumrgCost": 0,

        "RaqamAndRepairCostinKurdistanrepairCost": 0,
        "RaqamAndRepairCostinKurdistanRaqam": "",
        "RaqamAndRepairCostinKurdistanothers": 0,
        "RaqamAndRepairCostinKurdistannote": ""

    });



    const l = useLanguage();




    const HandleAddCars = (event) => {

        const type = event.target.getAttribute('type')
        const savename = event.target.getAttribute('name')
        const savevalue = event.target.value;

        if (type == "number") {
            savevalue = event.target.value.match(/^[0-9]{0,12}/)?.map(Number)[0];

        }
        if (type == "text") {
            savevalue = event.target.value.match(/^[0-9a-zA-Z-_ ]{0,40}/)?.map(String)[0];

        }

        if (type == "text" && event.target.tagName == 'TEXTAREA') {
            savevalue = event.target.value.match(/^[0-9a-zA-Z-_ ]{0,100}/)?.map(String)[0];

        }

        if (type == "date") {
            savevalue = event.target.value.match(/\d{2,4}(\/|\-)\d{2,4}(\/|\-)\d{2,4}/)

        }

        if (savename == "Tocar" || savename == "Tobalance") {
            savevalue = event.target.value.match(/^[a-zA-Z]{2,8}/)?.map(String)[0]

        }


        const newdata = { ...Data }
        newdata[savename] = savevalue;
        setData(newdata);

    }


    const DataUpload =
    {

        "Tocar": Data.Tocar || "Sedan",
        "Price": Data.Price || 0,
        "IsSold": Data.IsSold || 0,
        "ModeName": Data.ModeName || "No Data",
        "Model": Data.Model || 0,
        "Color": Data.Color || "No Data",
        "Mileage": Data.Mileage || 0,
        "VINNumber": Data.VINNumber || 0,
        "WheelDriveType": Data.WheelDriveType || 0,
        "PricePaidbid": Data.PricePaidbid || 0,
        // //"UserGiven": Data.UserGiven,
        "Tobalance": Data.Tobalance || "Cash",
        "Tire": Data.Tire || "Public",
        "Location": Data.Location || "USA",
        "date": Data.Date?.[0] || new Date(Date.now()).toLocaleDateString(),
        // "ArrivedToKurd": Data.ArrivedToKurd || false,
        // "ArrivedToDoubai": Data.ArrivedToDoubai || false,
        "FeesinAmericaStoragefee": Data.FeesinAmericaStoragefee || 0,
        "FeesinAmericaCopartorIAAfee": Data.FeesinAmericaCopartorIAAfee || 0,

        "FeesAndRepaidCostDubairepairCost": Data.FeesAndRepaidCostDubairepairCost || 0,
        // "FeesAndRepaidCostDubaiFees": Data.FeesAndRepaidCostDubaiFees || 0,
        "FeesAndRepaidCostDubaiothers": Data.FeesAndRepaidCostDubaiothers || 0,
        "FeesAndRepaidCostDubainote": Data.FeesAndRepaidCostDubainote || "No Data",

        "CoCCost": Data.CoCCost || 0,

        "TransportationCostFromAmericaLocationtoDubaiGCostLocation": Data.TransportationCostFromAmericaLocationtoDubaiGCostLocation || "No Data",
        "TransportationCostFromAmericaLocationtoDubaiGCostTranscost": Data.TransportationCostFromAmericaLocationtoDubaiGCostTranscost || 0,
        "TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost": Data.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost || 0,

        "DubaiToIraqGCostTranscost": Data.DubaiToIraqGCostTranscost || 0,
        "DubaiToIraqGCostgumrgCost": Data.DubaiToIraqGCostgumrgCost || 0,

        "RaqamAndRepairCostinKurdistanrepairCost": Data.RaqamAndRepairCostinKurdistanrepairCost || 0,
        "RaqamAndRepairCostinKurdistanRaqam": Data.RaqamAndRepairCostinKurdistanRaqam || 0,
        "RaqamAndRepairCostinKurdistanothers": Data.RaqamAndRepairCostinKurdistanothers || 0,
        "RaqamAndRepairCostinKurdistannote": Data.RaqamAndRepairCostinKurdistannote || "No Data"



    }



    const postCarsId = async () => {


        const id = toast.loading(l.loading)

        let BalanceCosts =
            Data.CoCCost +
            Data.FeesAndRepaidCostDubairepairCost +
            Data.FeesAndRepaidCostDubaiothers +
            Data.DubaiToIraqGCostTranscost +
            Data.DubaiToIraqGCostgumrgCost +
            Data.RaqamAndRepairCostinKurdistanrepairCost +
            Data.RaqamAndRepairCostinKurdistanothers


        let RentCost =
            Data.PricePaidbid +
            Data.FeesinAmericaStoragefee +
            Data.FeesinAmericaCopartorIAAfee +
            Data.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
            Data.TransportationCostFromAmericaLocationtoDubaiGCostTranscost







        try {

            const auth = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            }

            const UDetails = await Axios.get(`/users/detail/${SessionID}`, auth)



            let DataBalance = UDetails.data.userDetail.TotalBals


            // save image from canvas
            if (typeof document != "undefined") {
                var canvas = document.getElementById("canvas");
                let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                setCarDamage(imageBlob)
            }

            //! change  data and Image to FormData ----------------------------------

            let FormDataCar = new FormData();

            for (let key in DataUpload) {
                FormDataCar.append(key, DataUpload[key]);
            }

            for (let i = 0; i < pictureandvideorepair.length; i++) {
                console.log(pictureandvideorepair[i])

                FormDataCar.append("Pictureandvideorepair", pictureandvideorepair[i], `image${i}.jpeg`);

            }


            for (let i = 0; i < pictureandvideodamage.length; i++) {
                FormDataCar.append("Pictureandvideodamage", pictureandvideodamage[i], "image.jpeg");

            }

            CarDamage != '' && FormDataCar.append("CarDamage", CarDamage, "image.png");


            FirstImage != '' && FormDataCar.append("FirstImage", FirstImage, "image.png");

            //! change  data and Image to FormData ----------------------------------


            if (Data.Tobalance == "Cash") {
                let TotalCosts = RentCost + BalanceCosts

                if (TotalCosts <= DataBalance) {



                    await Axios.post('/cars/', FormDataCar, auth

                    ).then(async (response) => {

                        const one = `/users/${SessionID}`
                        const two = `/bal/`

                        const users = Axios.patch(one, { TotalBals: DataBalance - TotalCosts }, auth)
                        const bal = Axios.post(two, {
                            amount: -TotalCosts,
                            action: "Buy",
                            carId: response.data.Id,
                            userId: SessionID,
                            note: Data.ModeName
                        }, auth)

                        await axios.all([users, bal]).then(axios.spread(() => {
                            toast.update(id, { render: l.adddata, type: "success", isLoading: false, autoClose: 2000 });
                        })).catch(errors => {
                            toast.update(id, { render: "something went to wrong *", type: "error", isLoading: false, autoClose: 2000 });
                        })


                    }).catch(error => {
                        toast.update(id, { render: "error to save car *", type: "error", isLoading: false, autoClose: 2000 });


                    })

                }
                else {
                    toast.update(id, { render: "You don't have enough balance", type: "warn", isLoading: false, autoClose: 2000 });

                }
            }

            else if (Data.Tobalance == "Rent" && QarzUserId != "") {

                if (BalanceCosts <= DataBalance) {

                    const UDetailss = await Axios.get(`/users/detail/${QarzUserId}`, auth)

                    const totalBal = UDetailss.data.userDetail.TotalBals

                    await Axios.post('/cars/', FormDataCar, auth

                    ).then(async (response) => {

                        const one = `/qarz/`
                        const two = `/bal/`
                        const thre = `/users/${QarzUserId}`
                        const forth = `/users/${SessionID}`


                        const qarz = Axios.post(one, {
                            userId: QarzUserId,
                            carId: response.data.Id,
                            isPaid: false,

                        }, auth)

                        const bal = Axios.post(two, {
                            amount: RentCost || 0,
                            action: "Rent",
                            carId: response.data.Id,
                            userId: QarzUserId,
                            note: Note,
                            isPaid: false
                        }, auth)

                        const balAdmin = Axios.post(two, {
                            amount: -BalanceCosts || 0,
                            action: "Buy",
                            carId: response.data.Id,
                            userId: SessionID,
                            note: Data.ModeName

                        }, auth)


                        const users = Axios.patch(thre, { TotalBals: totalBal + RentCost }, auth)
                        const Admin = Axios.patch(forth, { TotalBals: DataBalance - BalanceCosts }, auth)

                        await axios.all([qarz, bal, balAdmin, users, Admin]).then(axios.spread(() => {
                            toast.update(id, { render: l.adddata, type: "success", isLoading: false, autoClose: 2000 });

                        })).catch(errors => {
                            toast.update(id, { render: 'something went to wrong *', type: "error", isLoading: false, autoClose: 2000 });

                        })


                    }).catch(() => {
                        toast.update(id, { render: "error to save car *", type: "error", isLoading: false, autoClose: 2000 });

                    })


                }

                else {

                    toast.update(id, { render: "You don't have enough balance", type: "warn", isLoading: false, autoClose: 2000 });
                }

            }

            else if (Data.Tobalance == "" || QarzUserId == "") {

                toast.update(id, { render: "Please Select type of Balance", type: "warning", isLoading: false, autoClose: 2000 });

            }


        } catch (e) {
            toast.update(id, { render: "error to get user balance *", type: "error", isLoading: false, autoClose: 2000 });


        }


    }


    useEffect(() => {

        if (session.status == "authenticated") {

            const handeleUserQarz = async () => {
                try {
                    const res = await Axios.get('users/Qarz', {
                        headers: {
                            "Content-Type": "application/json",

                            'Authorization': `Bearer ${session?.data?.Token}`
                        }
                    },)


                    const data = res.data
                    setUserQarz(data)
                } catch { }
            }
            handeleUserQarz()
        }
    }, [session.status])




    if (session.status === "loading") {
        return (<>
            <Head>
                <title >{l.newcard}</title>
                <meta name="Dashboard" content="initial-scale=1.0, width=device-width all data " />
            </Head>
            <div className="text-center">
                {l.loading}
            </div>
        </>)
    }

    if (session.status === "unauthenticated") {
        return router.push("/")
    }
    if (session.status === "authenticated") {

        return (


            <div className="">

                <Head>
                    <title >{l.newcard}</title>

                </Head>

                <>

                    <ToastContainer
                        rtl={l.yes === "Yes" ? false : true}
                        draggablePercent={40}
                        limit={2}
                        autoClose={2000}
                        className="w-64 m-auto mt-20 text-sm ltr:mr-0 md:w-64 "
                        position={toast.POSITION.TOP_RIGHT} />


                    <div className={`${page != 1 ? "hidden" : ""} `} >
                        <div className="px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl">

                            <div className="py-32 space-y-20 text-center ">


                                {/* <div>
                                <label for="hs-inline-leading-pricing-select-label" class="block text-sm font-medium mb-2 dark:text-white">Price</label>
                                <div class="relative">
                                    <input type="number" id="hs-inline-leading-pricing-select-label" name="inline-add-on" class="py-3 px-4 pl-9 pr-20 block w-full border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" placeholder="0.00" />
                                    <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                                        <span class="text-gray-500">$</span>
                                    </div>
                                    <div class="absolute inset-y-0 right-0 flex items-center text-gray-500 pr-px">
                                        <label for="hs-inline-leading-select-currency" class="sr-only">Currency</label>
                                        <select id="hs-inline-leading-select-currency" name="hs-inline-leading-select-currency" class="block w-full border-transparent rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-800">
                                            <option>USD</option>
                                            <option>AED</option>
                                        </select>
                                    </div>
                                </div>
                            </div> */}



                                <div>
                                    <h1 className="py-2">{l.seletkcar}</h1>
                                    <select name='Tocar' required onChange={(e) => { HandleAddCars(e) }} className="w-full max-w-xs select select-info">
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>PickUp</option>
                                    </select>
                                </div>

                                <div>
                                    <h1 className="py-2">{l.visibility}</h1>
                                    <select name='Tire' defaultValue={"Public"} required onChange={(e) => { HandleAddCars(e) }} className="w-full max-w-xs select select-info">
                                        <option value={"Public"}>{l.public}</option>
                                        <option value={"Private"}>{l.private}</option>
                                    </select>
                                </div>
                                <div>
                                    <h1 className="py-2">{l.visibility}</h1>
                                    <select name='Location' defaultValue={"USA"} required onChange={(e) => { HandleAddCars(e) }} className="w-full max-w-xs select select-info">
                                        <option value={"USA"}>{l.USA}</option>
                                        <option value={"Dubai"}>{l.Dubai}</option>
                                        <option value={"Kurdistan"}>{l.Kurdistan}</option>
                                    </select>
                                </div>

                                <div><h1 className="py-2">{l.seletkbalance}</h1>
                                    <select name='Tobalance' defaultValue={"select"} required onChange={(e) => { HandleAddCars(e), setQarzUserId("") }} className="w-full max-w-xs select select-info">
                                        <option disabled value={"select"} >{l.select} </option>
                                        <option value="Cash"> {l.cash} </option>
                                        <option value="Rent" > {l.rent} </option>
                                    </select>
                                </div>

                                {Data.Tobalance == "Rent" && <>
                                    <div><h1 className="py-2">{l.rent}</h1>
                                        <select name='UserQarz' defaultValue={"Select"} onChange={(eve) => {
                                            setQarzUserId(eve.target.value)
                                        }}
                                            className="w-full max-w-xs select select-info">
                                            <option disabled value={"Select"} >{l.none}</option>
                                            {UserQarz.userDetail?.map((item, idx) => {

                                                return <option value={item._id} key={idx}>{item.userName}</option>
                                            })}
                                        </select>
                                    </div>
                                    <input type="text" onChange={(e) => { setNote(e.target.value) }} placeholder={l.note} className="w-full max-w-xs input input-bordered input-info" />

                                </>
                                }



                            </div>
                        </div>



                        <div className="flex justify-around px-6 py-5 my-5 space-x-5 overflow-auto border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl">
                            <button type='button' className="btn btn-wide " onClick={() => { setPage(2) }}>{l.next}</button>
                        </div >
                    </div>

                    <div className={`${page != 2 ? "hidden" : ""} `} >


                        <div className="px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl">


                            <h1 className="mt-5 text-center">{l.price}</h1>
                            <div className="flex justify-center">
                                <input name='Price' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.price} className="input input-bordered    input-info w-[200%] mt-5   max-w-xl mb-8" />
                            </div>
                            <h1 className="mt-5 text-center">{l.namecar}</h1>
                            <div className="flex justify-center">
                                <input name='ModeName' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.namecar} className="input input-bordered input-info w-[200%] mt-5   max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.modelyear}</h1>
                            <div className="flex justify-center">
                                <input name='Model' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.modelyear} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.color}</h1>
                            <div className="flex justify-center">
                                <input name='Color' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.color} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            {/* <h1 className="mt-5 text-center">{l.tire}</h1>
                        <div className="flex justify-center">
                            <input name='Tire' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.tire} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div> */}



                            <h1 className="mt-5 text-center">{l.mileage}</h1>
                            <div className="flex justify-center">
                                <input name='Mileage' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.mileage} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.vinnumber}</h1>
                            <div className="flex justify-center">
                                <input name='VINNumber' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.vinnumber} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.wheeldrivetype}</h1>
                            <div className="flex justify-center">
                                <input name='WheelDriveType' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.wheeldrivetype} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.show}</h1>
                            <div className="flex justify-center">
                                <input name='Pictureandvideodamage' onChange={(e) => {
                                    setFirstImage(e.target.files[0])
                                }} type="file" placeholder={l.pictureandvideoofcardamage} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>

                            <h1 className="mt-5 text-center">{l.pictureandvideoofcardamage}</h1>
                            <div className="flex justify-center">
                                <input multiple name='Pictureandvideodamage' onChange={(e) => { setPictureandvideodamage(e.target.files) }} type="file" placeholder={l.pictureandvideoofcardamage} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>






                            <h1 className="mt-5 text-center">{l.pictureandvideoofcarafterrepair}</h1>
                            <div className="flex justify-center">
                                <input multiple name='Pictureandvideorepair' onChange={(e) => { setPictureandvideorepair(e.target.files) }} type="file" placeholder={l.pictureandvideoofcarafterrepair} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>




                            <h1 className="mt-5 text-center">{l.pricepaidorcaratbid}</h1>
                            <div className="flex justify-center">
                                <input name='PricePaidbid' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.pricepaidorcaratbid} className={`input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8 ${Data.Tobalance == "Rent" ? "border-red-600 focus:outline-red-600" : ""} `} />
                            </div>


                            <h1 className="mt-5 text-center">{l.coccost}</h1>
                            <div className="flex justify-center">
                                <input name='CoCCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.coccost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.date}</h1>
                            <div className="flex justify-center">
                                <input name='Date' onChange={(e) => { HandleAddCars(e) }} type="date" className="input  input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>



                        </div>
                        <div className={`${Data.Location != "USA" ? "hidden" : ""}`}>

                            <hr className='mx-8 mt-10' />

                            <h1 className="my-8 text-4xl text-center">{l.feesinamerica}</h1>

                            <hr className='mx-8 mt-10' />


                            <div className={`px-6 mt-20 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl  `} >


                                <h1 className="mt-5 text-center">{l.storagefee}</h1>
                                <div className="flex justify-center">
                                    <input name='FeesinAmericaStoragefee' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.storagefee} className={`input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8 ${Data.Tobalance == "Rent" ? "border-red-600 focus:outline-red-600" : ""} `} />
                                </div>

                                <h1 className="mt-5 text-center">{l.copartoriaafee}</h1>
                                <div className="flex justify-center">
                                    <input name='FeesinAmericaCopartorIAAfee' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.copartoriaafee} className={`input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8 ${Data.Tobalance == "Rent" ? "border-red-600 focus:outline-red-600" : ""} `} />
                                </div>

                                <h1 className="mt-5 text-center">{l.fromamericatodubaicost}</h1>
                                <div className="flex justify-center">
                                    <input name='TransportationCostFromAmericaLocationtoDubaiGCostTranscost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromamericatodubaicost} className={`input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8 ${Data.Tobalance == "Rent" ? "border-red-600 focus:outline-red-600" : ""} `} />
                                </div>

                                <h1 className="mt-5 text-center">{l.fromamericatodubaigumrg} </h1>
                                <div className="flex justify-center">
                                    <input name='TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromamericatodubaigumrg} className={`input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8 ${Data.Tobalance == "Rent" ? "border-red-600 focus:outline-red-600" : ""} `} />
                                </div>


                                <h1 className="mt-5 text-center">{l.uslocation}</h1>
                                <div className="flex justify-center">
                                    <input name='TransportationCostFromAmericaLocationtoDubaiGCostLocation' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.uslocation} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>

                            </div>
                        </div>


                        <div className={`${(Data.Location != "USA" && Data.Location != "Dubai") ? "hidden" : ""}`}>
                            <hr className='mx-8 mt-10' />

                            <h1 className="my-8 text-4xl text-center">{l.feesinadubai}</h1>

                            <hr className='mx-8 mt-10' />


                            <div className="px-6 mt-20 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl ">


                                <h1 className="mt-5 text-center">{l.repaircost}</h1>
                                <div className="flex justify-center">
                                    <input name='FeesAndRepaidCostDubairepairCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.repaircost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>



                                <h1 className="mt-5 text-center">{l.feesother}</h1>
                                <div className="flex justify-center">
                                    <input name='FeesAndRepaidCostDubaiothers' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fees} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>



                                <h1 className="mt-5 text-center">{l.fromdubaitokurdistancosts}</h1>
                                <div className="flex justify-center">
                                    <input name='DubaiToIraqGCostTranscost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistancosts} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>



                                <h1 className="mt-5 text-center">{l.fromdubaitokurdistangumrg} </h1>
                                <div className="flex justify-center">
                                    <input name='DubaiToIraqGCostgumrgCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistangumrg} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>



                                <h1 className="mt-5 text-center">{l.note}</h1>
                                <div className="flex justify-center">
                                    <textarea name='FeesAndRepaidCostDubainote' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.note} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                                </div>


                            </div>

                        </div>



                        {/* <hr className='mx-8 mt-10' />

                        <h1 className="my-8 text-4xl text-center">{l.transportationcost}</h1>

                        <hr className='mx-8 mt-10' />


                        <div className="px-6 mt-20 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl ">





                            <h1 className="mt-5 text-center">{l.fromdubaitokurdistancosts}</h1>
                            <div className="flex justify-center">
                                <input name='DubaiToIraqGCostTranscost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistancosts} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>



                            <h1 className="mt-5 text-center">{l.fromdubaitokurdistangumrg} </h1>
                            <div className="flex justify-center">
                                <input name='DubaiToIraqGCostgumrgCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistangumrg} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>




                        </div> */}


                        <hr className='mx-8 mt-10' />

                        <h1 className="my-8 text-4xl text-center">{l.numberandrepaircostinkurdistan}</h1>

                        <hr className='mx-8 mt-10' />


                        <div className="px-6 mt-20 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl ">



                            <h1 className="mt-5 text-center">{l.repaircostinkurdistan}</h1>
                            <div className="flex justify-center">
                                <input name='RaqamAndRepairCostinKurdistanrepairCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.repaircostinkurdistan} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.numberinkurdistan}</h1>
                            <div className="flex justify-center">
                                <input name='RaqamAndRepairCostinKurdistanRaqam' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.numberinkurdistan} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.raqamAndRepairCostinKurdistanothers} other</h1>
                            <div className="flex justify-center">
                                <input name='RaqamAndRepairCostinKurdistanothers' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.raqamAndRepairCostinKurdistanothers} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>


                            <h1 className="mt-5 text-center">{l.note}</h1>
                            <div className="flex justify-center">
                                <textarea name='RaqamAndRepairCostinKurdistannote' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.note} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                            </div>

                        </div>




                        <div className="flex justify-around px-6 py-5 my-5 space-x-5 overflow-auto border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl">

                            <button type='button' className="btn lg:btn-wide " onClick={() => { setPage(1) }}>{l.back}</button>
                            <button type='submit' className="btn lg:btn-wide " title={l.next} onClick={() => { setPage(3) }} >{l.next}</button>
                        </div >

                    </div>

                    <div className={`  ${page != 3 ? "hidden" : ""}  `} >

                        <Paint Tocar={Data.Tocar} setDataImage={setCarDamage} GlobalState={GlobalState} page={page} />

                        <div className="flex justify-around py-5 my-5 space-x-5 overflow-auto border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl">


                            <button type='button' className="btn lg:btn-wide " onClick={() => { setPage(2) }}>{l.back}</button>
                            <button type="submit" disabled={IsCanvasChanged == 0 ? false : true} className="btn lg:btn-wide " onClick={() => {
                                postCarsId()
                                setPage(1)
                            }} title={l.next}>{l.don}</button>

                        </div >




                    </div >


                </ >
            </div >
        );
    }
}
NewCars.Layout = AdminLayout;

export default NewCars;

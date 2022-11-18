
import useLanguage from '../../../Component/language';
import AdminLayout from '../../../Layouts/AdminLayout';
// import Image from "next/image";
import Head from 'next/head'
import { useState, useEffect, useRef } from "react"

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'

import { faRedo, faUndo, faTrashAlt, faSave, faPaintBrush, faCircle, faSquare, faPenNib, faPalette, faPaintRoller, faGear, faWandMagicSparkles, faCheck } from '@fortawesome/free-solid-svg-icons';

import { faCircle as farFaCoffee, faSquare as farfaSquare, } from '@fortawesome/free-regular-svg-icons'

import $ from 'jquery';

import axios from "axios"
import Axios from "../../api/Axios";

import { ToastContainer, toast, } from 'react-toastify';



import { getSession, useSession } from "next-auth/react";

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


var canData = [],
    canDataCount = 0,
    mouse = { x1: 0, y1: 0, x0: 0, y0: 0 },
    lineJoin = 'round',
    lineCap = 'round',
    paintArray = [],
    undoData = [],
    oldData = [];


let IsTimeToDrawing = ""


const NewCars = ({ SessionID }) => {

    const session = useSession()

    const [page, setPage] = useState(1)
    const [UserQarz, setUserQarz] = useState({})
    const [UserQarzRent, setUserQarzRent] = useState({})
    const [pictureandvideorepair, setPictureandvideorepair] = useState([])
    const [pictureandvideodamage, setPictureandvideodamage] = useState([])
    const [CarDamage, setCarDamage] = useState([])
    const [QarzUserId, setQarzUserId] = useState("")
    const [IsCanvasChanged, setIsCanvasChanged] = useState(1)




    const [Data, setData] = useState({

        'Tocar': "Sedan",
        "Price": 0,
        "IsSold": 0,
        "ModeName": "",
        "Model": 0,
        "Color": "",
        "Mileage": "",
        "VINNumber": "",
        "WheelDriveType": "",



        "PricePaidbid": 0,
        // "UserGiven": "",
        "Tobalance": "",
        "Tire": "",
        "Date": "",
        "Arrived": 0,
        "FeesinAmericaStoragefee": 0,
        "FeesinAmericaCopartorIAAfee": 0,

        "FeesAndRepaidCostDubairepairCost": 0,
        "FeesAndRepaidCostDubaiFees": 0,
        "FeesAndRepaidCostDubaiothers": 0,
        "FeesAndRepaidCostDubainote": "",

        "CoCCost": 0,

        "TransportationCostFromAmericaLocationtoDubaiGCostLocation": "",
        "TransportationCostFromAmericaLocationtoDubaiGCostTranscost": 0,
        "TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost": 0,

        "DubaiToIraqGCostTranscost": 0,
        "DubaiToIraqGCostgumrgCost": 0,

        "RaqamAndRepairCostinKurdistanrepairCost": 0,
        "RaqamAndRepairCostinKurdistanRaqam": 0,
        "RaqamAndRepairCostinKurdistanothers": 0,
        "RaqamAndRepairCostinKurdistannote": ""

    });





    const l = useLanguage();

    const GAlpha = useRef(0.5)
    const [SGAlpha, setSGAlpha] = useState(.5)

    const a = SGAlpha
    const [r, setr] = useState(0)
    const [g, setg] = useState(0)
    const [b, setb] = useState(0)

    const color = `rgba(${r},${g},${b},${a})`


    const canvasRef = useRef()
    const contextRef = useRef()
    const range = useRef(5)
    const [rangee, setRangee] = useState("5")
    const image = useRef()
    const [drawingTool, setDrawingTool] = useState('pen')




    useEffect(() => {
        const canvass = canvasRef.current;
        const contextt = canvass.getContext('2d')
        // contextt.lineCap = "round"
        contextRef.current = contextt
        clear()

        canvass.width = window.innerWidth >= 1023 && window.innerWidth <= 2100 ? window.innerWidth - 375 : window.innerWidth >= 2100 ? 2100 - 375 : window.innerWidth - 40;
        canvass.height = canvass.width / 1.6;

        const image = new Image()
        image.src = `/${Data.Tocar}.PNG`;



        contextt.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);


    }, [Data.Tocar, page])



    var size = rangee

    const startTuch = (e) => {
        IsTimeToDrawing = "Yes"

        setIsCanvasChanged(1)

        getTouchPos()
        paintArray = [];

        if (drawingTool == 'pen') {
            contextRef.current.beginPath();;
            contextRef.current.moveTo(mouse.x2, mouse.y2);
            // //
        } else if (drawingTool == 'rect' || drawingTool == 'rect_fill' || drawingTool == 'circle' || drawingTool == 'circle_fill' || drawingTool == 'line') {

            var touch = e.touches[0];

            mouse.x0 = touch.pageX - touch.target.offsetLeft;
            mouse.y0 = touch.pageY - touch.target.offsetTop;
        }


        canvas.addEventListener('touchmove', paint, false);

    }


    ///////////////////////////////
    const startDrawing = ({ nativeEvent }) => {
        IsTimeToDrawing = "Yes"
        setIsCanvasChanged(1)
        paintArray = [];

        if (drawingTool == 'pen') {
            contextRef.current.beginPath();
            contextRef.current.moveTo(mouse.x1, mouse.y1);



        } else if (drawingTool == 'rect' || drawingTool == 'rect_fill' || drawingTool == 'circle' || drawingTool == 'circle_fill' || drawingTool == 'line') {
            mouse.x0 = nativeEvent.pageX - canvasRef.current.offsetLeft;
            mouse.y0 = nativeEvent.pageY - canvasRef.current.offsetTop;
        }


        canvas.addEventListener('mousemove', paint, false);


    }

    ///////////////////////////////

    const endTuch = () => {
        IsTimeToDrawing = "No"

        setIsCanvasChanged(1)

        canvasRef.current?.removeEventListener('touchmove', paint, false);

        if (drawingTool == 'rect' || drawingTool == 'rect_fill' || drawingTool == 'circle' || drawingTool == 'circle_fill' || drawingTool == 'line') {

            paintArray.push({ x: mouse.x1, y: mouse.y1, x0: mouse.x0, y0: mouse.y0, size: size, color: color, drawingTool: drawingTool });
        }
        canData[canDataCount] = paintArray;
        undoData = canData;
        oldData = canData;
        canDataCount++;
        getTouchPos()

    }

    function getTouchPos(e) {

        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger

                var touch = e.touches[0]; // Get the information for finger #1

                mouse.x2 = touch.pageX - touch.target.offsetLeft;
                mouse.y2 = touch.pageY - touch.target.offsetTop;

            }
        }
    }



    const endDrawing = () => {
        IsTimeToDrawing = "No"

        canvasRef.current?.removeEventListener('mousemove', paint, false);
        canvasRef.current?.removeEventListener('mousemove', draw, true);
        if (drawingTool == 'rect' || drawingTool == 'rect_fill' || drawingTool == 'circle' || drawingTool == 'circle_fill' || drawingTool == 'line') {
            paintArray.push({ x: mouse.x1, y: mouse.y1, x0: mouse.x0, y0: mouse.y0, size: size, color: color, drawingTool: drawingTool });
        }
        canData[canDataCount] = paintArray;
        undoData = canData;
        oldData = canData;
        canDataCount++;


        setIsCanvasChanged(1)
    }

    ///////////////////////////////


    canvasRef.current?.addEventListener('touchmove', function (e) {

        e.preventDefault();
        var touch = e.touches[0];

        mouse.x1 = touch.pageX - touch.target.offsetLeft
        mouse.y1 = touch.pageY - touch.target.offsetTop

        // (mouse.x2)

    }, { passive: false });






    ///////////////////////////// //^//
    const draw = ({ nativeEvent }) => {


        mouse.x1 = nativeEvent.pageX - canvasRef.current.offsetLeft
        mouse.y1 = nativeEvent.pageY - canvasRef.current.offsetTop
    }


    var paint = (function () {



        if (drawingTool == 'pen' && IsTimeToDrawing == "Yes") {
            paint_with_pen();
            paintArray.push({ x: mouse.x1, y: mouse.y1, x0: mouse.x0, y0: mouse.y0, size: size, color: color, drawingTool: drawingTool });
        } else if (drawingTool == 'rect') {
            paint_with_rect();
        } else if (drawingTool == 'rect_fill') {
            paint_with_rect_fill();
        } else if (drawingTool == 'circle') {
            paint_with_circle();
        } else if (drawingTool == 'circle_fill') {
            paint_with_circle_fill();
        } else if (drawingTool == 'line') {
            paint_with_line();
        }

    });

    var paint_with_pen = (function () {
        drawPen(mouse.x1, mouse.y1, size, color);
    });

    var paint_with_rect = (function () {
        restore();
        drawRect(mouse.x0, mouse.y0, mouse.x1, mouse.y1, size, color);
    });

    var paint_with_rect_fill = (function () {
        restore();
        drawRect_fill(mouse.x0, mouse.y0, mouse.x1, mouse.y1, size, color);
    });
    var paint_with_circle = (function () {
        restore();
        drawEllipse(mouse.x0, mouse.y0, mouse.x1, mouse.y1, size, color);
    });

    var paint_with_circle_fill = (function () {
        restore();
        drawEllipse_fill(mouse.x0, mouse.y0, mouse.x1, mouse.y1, size, color);
    });

    var paint_with_line = (function () {
        restore();
        drawLine(mouse.x0, mouse.y0, mouse.x1, mouse.y1, size, color);
    });



    var drawPen = (function (x1, y1, size, color) {

        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;
        contextRef.current.strokeStyle = color;
        contextRef.current.lineTo(x1, y1);
        contextRef.current.stroke();
        // //
    });

    var drawRect = (function (x1, y1, x2, y2, size, color) {
        var x = Math.min(x2, x1),
            y = Math.min(y2, y1),
            w = Math.abs(x2 - x1),
            h = Math.abs(y2 - y1);

        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;
        // contextRef.current.strokeStyle = color;
        contextRef.current.strokeStyle = color


        // contextRef.current.strokeRect(x, y, w, h);
        // contextRef.current.rect(x, y, w, h);
        // contextRef.current.fill();

        contextRef.current.strokeRect(x, y, w, h);


    });
    var drawRect_fill = (function (x1, y1, x2, y2, size, color) {
        var x = Math.min(x2, x1),
            y = Math.min(y2, y1),
            w = Math.abs(x2 - x1),
            h = Math.abs(y2 - y1);

        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;

        contextRef.current.fillStyle = color


        contextRef.current.fillRect(x, y, w, h);
        contextRef.current.fill()





    });

    var drawLine = (function (x1, y1, x2, y2, size, color) {
        contextRef.current.beginPath();
        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;
        contextRef.current.strokeStyle = color;
        contextRef.current.moveTo(x1, y1);
        contextRef.current.lineTo(x2, y2);

        contextRef.current.stroke();
    });


    var drawEllipse = (function (x1, y1, x2, y2, size, color) {
        var radiusX = (x2 - x1) * 0.5,
            radiusY = (y2 - y1) * 0.5,
            centerX = x1 + radiusX,
            centerY = y1 + radiusY,
            step = 0.01,
            a = step,
            pi2 = Math.PI * 2 - step;

        contextRef.current.beginPath();
        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;
        contextRef.current.strokeStyle = color;
        contextRef.current.moveTo(centerX + radiusX * Math.cos(0),
            centerY + radiusY * Math.sin(0));

        for (; a < pi2; a += step) {
            contextRef.current.lineTo(centerX + radiusX * Math.cos(a),
                centerY + radiusY * Math.sin(a));
        }

        contextRef.current.closePath();
        contextRef.current.stroke();
    });

    var drawEllipse_fill = (function (x1, y1, x2, y2, size, color) {
        var radiusX = (x2 - x1) * 0.5,
            radiusY = (y2 - y1) * 0.5,
            centerX = x1 + radiusX,
            centerY = y1 + radiusY,
            step = 0.01,
            a = step,
            pi2 = Math.PI * 2 - step;

        contextRef.current.beginPath();
        contextRef.current.lineWidth = size;
        contextRef.current.lineJoin = lineJoin;
        contextRef.current.lineCap = lineCap;
        contextRef.current.fillStyle = color;
        contextRef.current.moveTo(centerX + radiusX * Math.cos(0),
            centerY + radiusY * Math.sin(0));

        for (; a < pi2; a += step) {
            contextRef.current.lineTo(centerX + radiusX * Math.cos(a),
                centerY + radiusY * Math.sin(a));
        }

        contextRef.current.closePath();
        contextRef.current.fill();
    });






    var restore = (function () {

        const image = new Image()
        image.src = `/${Data.Tocar}.PNG`;


        contextRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (canData.length > 0) {

            for (var i = 0; i < canData.length; i++) {
                contextRef.current.beginPath();

                $.each(canData[i], function (para, element) {
                    restoreMe(element);


                });

            }
        }
    });

    var restoreMe = (function (element) {
        if (element.drawingTool == 'pen') {
            drawPen(element.x, element.y, element.size, element.color);
        } else if (element.drawingTool == 'rect') {
            drawRect(element.x0, element.y0, element.x, element.y, element.size, element.color);
        } else if (element.drawingTool == 'rect_fill') {
            drawRect_fill(element.x0, element.y0, element.x, element.y, element.size, element.color);
        } else if (element.drawingTool == 'circle') {
            drawEllipse(element.x0, element.y0, element.x, element.y, element.size, element.color);
        } else if (element.drawingTool == 'circle_fill') {
            drawEllipse_fill(element.x0, element.y0, element.x, element.y, element.size, element.color);
        } else if (element.drawingTool == 'line') {
            drawLine(element.x0, element.y0, element.x, element.y, element.size, element.color);
        }
    })



    var undo = (function () {

        const image = new Image()
        image.src = `/${Data.Tocar}.PNG`;


        if (canData.length > 0) {
            contextRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
            canData = canData.slice(0, -1);
            undoData = undoData.slice(0, -1);
            canDataCount--;

            for (var i = 0; i < undoData.length; i++) {
                contextRef.current.beginPath();
                $.each(undoData[i], function (para, element) {
                    restoreMe(element);
                });
            }
        }
    });

    var redo = (function () {
        if (oldData.length > canData.length) {
            var _canDataLength = canData.length;
            var _oldData = oldData[_canDataLength];

            contextRef.current.beginPath();
            $.each(_oldData, function (index, element) {
                restoreMe(element);
            });

            canData[canDataCount] = _oldData;
            undoData = canData;
            canDataCount++;
        }
    });




    const to_image = () => {
        if (typeof window !== 'undefined') {

            // const image = canvas?.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

            var canvas = document.getElementById("canvas");
            const BlobImage = async () => {

                let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                setCarDamage(imageBlob)

            }
            BlobImage()


            var url = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.download = 'filename.png';
            link.href = url;

            const rrrrrr = link.href.toString
            // setDamagepictur({ rrrrrr });
            // consol.log(rrrrrr)
            link.click();

            // var image = canvas?.toDataURL("image/png").replace("image/png", "image/octet-stream");
            // el.href = image;
        }


    }

    const clear = () => {
        if (typeof window !== 'undefined') {

        }

        const image = new Image()
        image.src = `/${Data.Tocar}.PNG`;


        contextRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        canDataCount = 0;
        canData = [];
        undoData = canData;
        oldData = canData;
        contextRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canDataCount = 0;
        canData = [];
        undoData = canData;
        oldData = canData;

    }




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
        // // //"UserGiven": Data.UserGiven,

        "Tobalance": Data.Tobalance || "Cash",
        "Tire": Data.Tire || "No Data",
        "Date": Data.Date?.[0] || "2022-01-01",
        // "Date": "iuywgado78wgad087aouybsdty79vwa6789d",
        "Arrived": Data.Arrived || false,
        "FeesinAmericaStoragefee": Data.FeesinAmericaStoragefee || 0,
        "FeesinAmericaCopartorIAAfee": Data.FeesinAmericaCopartorIAAfee || 0,

        "FeesAndRepaidCostDubairepairCost": Data.FeesAndRepaidCostDubairepairCost || 0,
        "FeesAndRepaidCostDubaiFees": Data.FeesAndRepaidCostDubaiFees || 0,
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


        let TotalCosts =
            Data.PricePaidbid +
            Data.CoCCost +
            Data.FeesinAmericaStoragefee +
            Data.FeesinAmericaCopartorIAAfee +
            Data.FeesAndRepaidCostDubairepairCost +
            Data.FeesAndRepaidCostDubaiFees +
            Data.FeesAndRepaidCostDubaiothers +
            Data.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost +
            Data.TransportationCostFromAmericaLocationtoDubaiGCostTranscost +
            Data.DubaiToIraqGCostTranscost +
            Data.DubaiToIraqGCostgumrgCost +
            Data.RaqamAndRepairCostinKurdistanrepairCost +
            Data.RaqamAndRepairCostinKurdistanothers


        try {
            //FIXME -  chage Email to Id
            const UDetails = await Axios.get(`/users/detail/${SessionID}`, {
                headers: {
                    "Content-Type": "application/json",

                    'Authorization': `Bearer ${session?.data?.Token}`
                }
            },)




            let DataBalance = UDetails.data.userDetail.TotalBals



            //Tobalnce .............  
            // save image from canvas
            if (typeof document != "undefined") {
                var canvas = document.getElementById("canvas");
                let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/PNG'));
                setCarDamage(imageBlob)
            }

            //^ change  data and Image to FormData 
            let FormDataCar = new FormData();

            for (let key in DataUpload) {
                FormDataCar.append(key, DataUpload[key]);
            }

            for (let i = 0; i < pictureandvideorepair.length; i++) {

                FormDataCar.append("Pictureandvideorepair", pictureandvideorepair[i], `image${i}.JPEG`);

            }


            for (let i = 0; i < pictureandvideodamage.length; i++) {

                FormDataCar.append("Pictureandvideodamage", pictureandvideodamage[i], "image.JPEG");

            }

            CarDamage != '' && FormDataCar.append("CarDamage", CarDamage, "image.png");


            //decrice balance  from Admin

            if (Data.Tobalance == "Cash") {
                if (TotalCosts <= DataBalance) {

                    // setTimeout(async () => {
                    const res = await Axios.post('/cars/', FormDataCar, {

                        header: {

                            'Content-Type': 'multipart/form-data',


                            'Authorization': `Bearer ${session?.data?.Token}`

                        }

                    }



                    ).then(async (response) => {
                        try {

                            await Axios.patch(`/users/${SessionID}`, { TotalBals: DataBalance - TotalCosts }, {
                                headers: {
                                    "Content-Type": "application/json",

                                    'Authorization': `Bearer ${session?.data?.Token}`
                                }
                            },)


                            await Axios.post("/bal/",
                                {
                                    amount: -TotalCosts,
                                    action: "Add",
                                    carId: response.data.Id,
                                    userId: SessionID
                                }, {
                                headers: {
                                    "Content-Type": "application/json",

                                    'Authorization': `Bearer ${session?.data?.Token}`
                                }
                            },)

                            toast.success("Your Balance Now= " + (DataBalance - TotalCosts) + " $");

                        } catch (err) {

                            toast.error("Error from user balance *")

                        }
                        toast.success(l.adddata);

                    }).catch(error => {

                        toast.error("error to save car *")


                    })
                    // }, 100);




                }


                else {
                    toast.warn("You don't have enough balance");

                }
            }

            else if (Data.Tobalance == "Loan" && QarzUserId != "") {


                await Axios.post('/cars/', FormDataCar, {

                    header: {

                        'Content-Type': 'multipart/form-data',

                        'Authorization': `Bearer ${session?.data?.Token}`

                    }

                }

                ).then(async (response) => {


                    try {

                        await Axios.post(`/qarz/`, {
                            userId: QarzUserId.split(",")?.[0],
                            amount: Math.floor(TotalCosts),
                            isPaid: false,

                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        toast.success("Qarz ");



                    } catch (err) {

                        toast.error("Error from qarz balance *")

                    }
                    toast.success(l.adddata);

                }).catch(error => {

                    toast.error("error to save car *")


                })

            }


            else if (Data.Tobalance == "Rent" && QarzUserId != "") {



                // setTimeout(async () => {
                const response = await Axios.post('/cars/', FormDataCar, {

                    header: {

                        'Content-Type': 'multipart/form-data',


                        'Authorization': `Bearer ${session?.data?.Token}`

                    }

                }



                ).then(async (response) => {
                    try {

                        await Axios.post(`/qarz/`, {
                            userId: QarzUserId,
                            carId: response.data.Id
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${session?.data?.Token}`
                            }
                        },)

                        toast.success("Rent Car Successfully")


                    } catch (err) {

                        toast.error("Error from user balance *")

                    }
                    toast.success(l.adddata);

                }).catch(error => {

                    toast.error("error to save car *")


                })
                // }, 100);





            }

            else if (Data.Tobalance == "" || QarzUserId == "") {
                toast.warn("Please Select type of Balance");
            }


        } catch (e) {
            toast.error("error to get user balance *");

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
                } catch {

                }

            }
            handeleUserQarz()
        }
    }, [session.status])






    return (


        <div className="">

            <Head>
                <title >{l.newcard}</title>

            </Head>

            < >

                {/* <div className=" px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl  "> onSubmit={handleSubmit(postCarsId)}*/}
                <ToastContainer
                    rtl={l.yes === "Yes" ? false : true}
                    draggablePercent={40}
                    limit={2}
                    autoClose={5000}
                    className="w-64 text-sm m-auto mt-20  ltr:mr-0 md:w-64 "
                    position={toast.POSITION.TOP_RIGHT}
                />

                <div className={`${page != 1 ? "hidden" : ""} `} >
                    <div className=" px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl  ">

                        <div className=" space-y-20 text-center py-32">

                            <div >
                                <h1 className="py-2">{l.seletkcar}</h1>
                                <select name='Tocar' required onChange={(e) => { HandleAddCars(e) }} className="select select-info w-full max-w-xs">
                                    <option>Sedan</option>
                                    <option>SUV</option>
                                    <option>PickUp</option>
                                </select>
                            </div>

                            <div><h1 className="py-2">{l.seletkbalance}</h1>
                                <select name='Tobalance' defaultValue={"select"} required onChange={(e) => { HandleAddCars(e), setQarzUserId("") }} className="select select-info w-full max-w-xs">
                                    <option disabled value={"select"} >{l.none} </option>
                                    <option value="Cash"> {l.cash} </option>
                                    <option value="Loan" > {l.loan} </option>
                                    <option value="Rent" > {l.rent} </option>
                                </select>
                            </div>

                            {Data.Tobalance == "Loan" &&
                                <div><h1 className="py-2">{l.lakeqarzkrdwa}</h1>
                                    <select name='UserQarz' defaultValue={"Select"} onChange={(eve) => {
                                        setQarzUserId(eve.target.value)
                                    }}
                                        className="select select-info w-full max-w-xs">

                                        <option disabled value={"Select"} >{l.none}</option>
                                        {UserQarz.userDetail?.map((item, idx) => {

                                            return <option value={[item._id, item.TotalBals]} key={idx}>{item.userName}</option>
                                        })}
                                    </select>
                                </div>
                            }

                            {Data.Tobalance == "Rent" &&
                                <div><h1 className="py-2">{l.rent}</h1>
                                    <select name='UserQarz' defaultValue={"Select"} onChange={(eve) => {
                                        setQarzUserId(eve.target.value)
                                    }}
                                        className="select select-info w-full max-w-xs">

                                        <option disabled value={"Select"} >{l.none}</option>
                                        {UserQarz.userDetail?.map((item, idx) => {

                                            return <option value={item._id} key={idx}>{item.userName}</option>
                                        })}
                                    </select>
                                </div>
                            }



                        </div>
                    </div>



                    <div className="flex  justify-around px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl py-5 my-5  space-x-5 overflow-auto">


                        <button type='button' className="btn btn-wide " onClick={() => { setPage(2) }}>{l.next}</button>

                    </div >


                </div>

                <div className={`${page != 2 ? "hidden" : ""} `} >


                    <div className=" px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl   ">


                        <h1 className="mt-5 text-center">{l.amount}</h1>
                        <div className="flex  justify-center">
                            <input name='Price' value={Data.Price} onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.amount} className="input input-bordered    input-info w-[200%] mt-5   max-w-xl mb-8" />
                        </div>
                        <h1 className="mt-5 text-center">{l.namecar}</h1>
                        <div className="flex  justify-center">
                            <input name='ModeName' value={Data.ModeName} onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.namecar} className="input input-bordered input-info w-[200%] mt-5   max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.modelyear}</h1>
                        <div className="flex  justify-center">
                            <input name='Model' value={Data.Model} onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.modelyear} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.color}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.Color} name='Color' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.color} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.tire}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.Tire} name='Tire' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.tire} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>



                        <h1 className="mt-5 text-center">{l.mileage}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.Mileage} name='Mileage' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.mileage} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.vinnumber}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.VINNumber} name='VINNumber' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.vinnumber} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.wheeldrivetype}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.WheelDriveType} name='WheelDriveType' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.wheeldrivetype} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.pictureandvideoofcardamage}</h1>
                        <div className="flex  justify-center">
                            <input multiple name='Pictureandvideodamage' onChange={(e) => { setPictureandvideodamage(e.target.files) }} type="file" placeholder={l.pictureandvideoofcardamage} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>






                        {/* ////////////////////////////////// ? */}
                        <div className="grid grid-cols-5 gap-1">
                            {/* {convertturl1.map((image, index) =>

                                    < img key={index} className="" id='gg' src={image} alt="" width="300" height="300" />

                                )} */}
                        </div>  {/* ////////////////////////////////// */}








                        <h1 className="mt-5 text-center">{l.pictureandvideoofcarafterrepair}</h1>
                        <div className="flex  justify-center">
                            <input multiple name='Pictureandvideorepair' onChange={(e) => { setPictureandvideorepair(e.target.files) }} type="file" placeholder={l.pictureandvideoofcarafterrepair} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                        {/* ////////////////////////////////// ?*/}
                        <div className="grid grid-cols-5 gap-1">
                            {/* {convertturl2.map((image, index) =>
                                    < img key={index} className="" id='gg' src={image} alt="" width="300" height="300" />

                                )} */}
                        </div>
                        {/* ////////////////////////////////// */}







                        <h1 className="mt-5 text-center">{l.pricepaidorcaratbid}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.PricePaidbid} name='PricePaidbid' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.pricepaidorcaratbid} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.coccost}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.CoCCost} name='CoCCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.coccost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.date}</h1>




                        <div className="flex  justify-center">
                            <input name='Date' onChange={(e) => { HandleAddCars(e) }} type="date" placeholder="YYYY-MM-DD" defaultValue={"2022-1-1"} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                    </div>


                    <hr className='mx-8 mt-10' />

                    <h1 className="my-8 text-center text-4xl">{l.feesinamerica}</h1>

                    <hr className='mx-8 mt-10' />


                    <div className="mt-20 px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl   ">


                        <h1 className="mt-5 text-center">{l.storagefee}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.FeesinAmericaStoragefee} name='FeesinAmericaStoragefee' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.storagefee} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                        <h1 className="mt-5 text-center">{l.copartoriaafee}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.FeesinAmericaCopartorIAAfee} name='FeesinAmericaCopartorIAAfee' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.storagefee} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        {/* <h1 className="mt-5 text-center">{l.note}</h1>
                        <div className="flex  justify-center">
                            <textarea value={Data.NoteAmerica} name='NoteAmerica' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.note} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div> */}



                    </div>


                    <hr className='mx-8 mt-10' />

                    <h1 className="my-8 text-center text-4xl">{l.feesinadubai}</h1>

                    <hr className='mx-8 mt-10' />


                    <div className="mt-20 px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl   ">


                        <h1 className="mt-5 text-center">{l.repaircost}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.FeesAndRepaidCostDubairepairCost} name='FeesAndRepaidCostDubairepairCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.repaircost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.fees}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.FeesAndRepaidCostDubaiFees} name='FeesAndRepaidCostDubaiFees' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fees} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                        <h1 className="mt-5 text-center">{l.feesother}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.FeesAndRepaidCostDubaiothers} name='FeesAndRepaidCostDubaiothers' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fees} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.note}</h1>
                        <div className="flex  justify-center">
                            <textarea value={Data.FeesAndRepaidCostDubainote} name='FeesAndRepaidCostDubainote' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.note} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                    </div>


                    <hr className='mx-8 mt-10' />

                    <h1 className="my-8 text-center text-4xl">{l.transportationcost}</h1>

                    <hr className='mx-8 mt-10' />


                    <div className="mt-20 px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl   ">



                        <h1 className="mt-5 text-center">{l.fromamericatodubaicost}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.TransportationCostFromAmericaLocationtoDubaiGCostTranscost} name='TransportationCostFromAmericaLocationtoDubaiGCostTranscost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromamericatodubaicost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                        <h1 className="mt-5 text-center">{l.uslocation}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.TransportationCostFromAmericaLocationtoDubaiGCostLocation} name='TransportationCostFromAmericaLocationtoDubaiGCostLocation' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.uslocation} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                        <h1 className="mt-5 text-center">{l.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost} </h1>
                        <div className="flex  justify-center">
                            <input value={Data.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost} name='TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.fromdubaitokurdistancosts}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.DubaiToIraqGCostTranscost} name='DubaiToIraqGCostTranscost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistancosts} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>



                        <h1 className="mt-5 text-center">{l.fromdubaitokurdistangumrg} </h1>
                        <div className="flex  justify-center">
                            <input value={Data.DubaiToIraqGCostgumrgCost} name='DubaiToIraqGCostgumrgCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.fromdubaitokurdistangumrg} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>




                    </div>


                    <hr className='mx-8 mt-10' />

                    <h1 className="my-8 text-center text-4xl">{l.numberandrepaircostinkurdistan}</h1>

                    <hr className='mx-8 mt-10' />


                    <div className="mt-20 px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl   ">



                        <h1 className="mt-5 text-center">{l.repaircostinkurdistan}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.RaqamAndRepairCostinKurdistanrepairCost} name='RaqamAndRepairCostinKurdistanrepairCost' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.repaircostinkurdistan} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.numberinkurdistan}</h1>
                        <div className="flex  justify-center">
                            <input value={Data.RaqamAndRepairCostinKurdistanRaqam} name='RaqamAndRepairCostinKurdistanRaqam' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.numberinkurdistan} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.raqamAndRepairCostinKurdistanothers} other</h1>
                        <div className="flex  justify-center">
                            <input value={Data.RaqamAndRepairCostinKurdistanothers} name='RaqamAndRepairCostinKurdistanothers' onChange={(e) => { HandleAddCars(e) }} type="number" placeholder={l.raqamAndRepairCostinKurdistanothers} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>


                        <h1 className="mt-5 text-center">{l.note}</h1>
                        <div className="flex  justify-center">
                            <textarea value={Data.ModeName} name='RaqamAndRepairCostinKurdistannote' onChange={(e) => { HandleAddCars(e) }} type="text" placeholder={l.note} className="input input-bordered input-info w-[200%] mt-5 max-w-xl mb-8" />
                        </div>

                    </div>




                    <div className="flex  justify-around px-6 border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl py-5 my-5  space-x-5 overflow-auto">


                        <button type='button' className="btn lg:btn-wide " onClick={() => { setPage(1) }}>{l.back}</button>
                        <button type='submit' className="btn lg:btn-wide " title={l.next} onClick={() => { setPage(3) }} >{l.next}</button>
                        {/*  */}
                    </div >

                </div>

                <div className={`transition-transform delay-10000   ${page != 3 ? "hidden" : ""}  `} >
                    <div className=" border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl  ">

                        <div className="space-y-20 text-center ">
                            <div>
                                <div >

                                    <div className="box  "  >
                                        <div className='flex justify-between px-2 items-center border rounded-full shadow-2xl  py-2 m-1 '>

                                            <div className="space-x-8 flex  justify-center items-center  ">



                                                <div className="dropdown lg:hidden  rtl:mx-8 rtl:dropdown-left ltr:dropdown-right">
                                                    <FontAwesomeIcon icon={faPaintRoller} tabIndex={0} className="text-2xl    cursor-pointer active:scale-90" fixedWidth />


                                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-20 ">
                                                        <li>

                                                            <FontAwesomeIcon icon={faPaintBrush} className="text-2xl rtl:mx-5   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('pen') }} />


                                                        </li>
                                                        <li>

                                                            <FontAwesomeIcon icon={faPenNib} className="text-2xl   cursor-pointer active:scale-90" onClick={() => { setDrawingTool('line') }} fixedWidth />


                                                        </li>
                                                        <li>

                                                            <FontAwesomeIcon icon={faCircle} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('circle_fill') }} fixedWidth />



                                                        </li>
                                                        <li>

                                                            <FontAwesomeIcon icon={farFaCoffee} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('circle') }} fixedWidth />



                                                        </li>
                                                        <li>

                                                            <FontAwesomeIcon icon={faSquare} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool("rect_fill") }} fixedWidth />



                                                        </li>
                                                        <li>


                                                            <FontAwesomeIcon icon={farfaSquare} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool("rect") }} fixedWidth />


                                                        </li>

                                                    </ul>
                                                </div>
                                                <div className="space-x-10 hidden  lg:block">
                                                    <FontAwesomeIcon icon={faPaintBrush} className="text-2xl rtl:mx-5   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('pen') }} />
                                                    <FontAwesomeIcon icon={faPenNib} className="text-2xl   cursor-pointer active:scale-90" onClick={() => { setDrawingTool('line') }} fixedWidth />
                                                    <FontAwesomeIcon icon={farFaCoffee} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('circle') }} fixedWidth />
                                                    <FontAwesomeIcon icon={faCircle} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool('circle_fill') }} fixedWidth />
                                                    <FontAwesomeIcon icon={farfaSquare} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool("rect") }} fixedWidth />
                                                    <FontAwesomeIcon icon={faSquare} className="text-2xl   cursor-pointer active:scale-90" onClick={(e) => { setDrawingTool("rect_fill") }} fixedWidth />
                                                </div>


                                                <div className="dropdown rtl:dropdown-left ltr:dropdown-right">
                                                    <FontAwesomeIcon icon={faWandMagicSparkles} tabIndex={0} className="text-2xl   cursor-pointer active:scale-90" fixedWidth />


                                                    <ul tabIndex={0} className="dropdown-content  menu p-2 shadow bg-base-100 rounded-box w-52 ">
                                                        <li><a>

                                                            <div className="w-40 "> <input type="range" min={1} max={50} defaultValue={5} onChange={() => { setRangee(range.current.value) }} ref={range} className="range" />
                                                                <div className={`w-full flex justify-between items-center text-xs px-2 `}>

                                                                    <span className=" text-[8px] ">⚫</span>
                                                                    <span className=" text-[10px] ">⚫</span>
                                                                    <span className=" text-[12px] ">⚫</span>
                                                                    <span className=" text-[14px] ">⚫</span>
                                                                    <span className=" text-[16px] ">⚫</span>
                                                                    <span className=" text-[18px] ">⚫</span>
                                                                    <span className=" text-[20px] ">⚫</span>
                                                                    <span className=" text-[22px]  [ background-color : red ]">⚫</span>


                                                                </div>
                                                            </div>

                                                        </a></li>
                                                        <li><a>


                                                            <div className="w-40"><input type="range" step={0.1} min={.1} max={1} defaultValue={.5} className="range" onChange={() => { setSGAlpha(GAlpha.current.value) }} ref={GAlpha} />
                                                                <div className={` w-full flex justify-between text-xs px-2 `} >

                                                                    <span className="[opacity:0.1] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.2] text-[10px] ">⚫</span>
                                                                    <span className=" [opacity:0.3] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.4] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.5] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.6] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.7] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.8] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:0.9] text-[10px] ">⚫</span>
                                                                    <span className="[opacity:1] text-[10px] ">⚫</span>



                                                                </div></div>


                                                        </a></li>
                                                    </ul>
                                                </div>



                                                <div className="dropdown text-center ">
                                                    <FontAwesomeIcon icon={faPalette} tabIndex={0} className="text-2xl   cursor-pointer active:scale-90" fixedWidth />


                                                    <ul tabIndex={0} className="dropdown-content menu p-2 grid grid-cols-2 shadow bg-base-100 rounded-box w-52 text-start">
                                                        <li>
                                                            {l.rash}
                                                            <span title={l.rash} className='  w-16 h-16 rounded-full  badge badge-xs bg-gray-900 active:scale-90 cursor-cell' onClick={() => { setr(0), setg(0), setb(0) }}></span>


                                                        </li>
                                                        <li>
                                                            {l.spe}
                                                            <span title={l.spe} className='  w-16 h-16 rounded-full  badge badge-xs bg-white active:scale-90 cursor-cell' onClick={() => { setr(255), setg(255), setb(255) }}></span>

                                                        </li>
                                                        <li>{l.boyaxh}
                                                            <span title={l.boyaxh} className='  w-16 h-16 rounded-full badge badge-xs bg-blue-900 active:scale-90 cursor-cell' onClick={() => { setr(68), setg(114), setb(196) }}></span>


                                                        </li>
                                                        <li>{l.goraw_belade}
                                                            <span title={l.goraw_belade} className='  w-16 h-16 rounded-full badge badge-xs bg-yellow-600 active:scale-90 cursor-cell' onClick={() => { setr(255), setg(192), setb(0) }}></span>


                                                        </li>
                                                        <li>{l.goraw_tejare}
                                                            <span title={l.goraw_tejare} className='  w-16 h-16 rounded-full badge badge-xs bg-lime-900 active:scale-90 cursor-cell' onClick={() => { setr(84), setg(130), setb(53) }}></span>


                                                        </li>
                                                        <li>{l.ta3del}
                                                            <span title={l.ta3del} className='  w-16 h-16 rounded-full badge badge-xs bg-sky-600 active:scale-90 cursor-cell' onClick={() => { setr(0), setg(176), setb(240) }}></span>


                                                        </li>
                                                        <li>
                                                            {l.ta3del_sard}
                                                            <span title={l.ta3del_sard} className='  w-16 h-16 rounded-full badge badge-xs bg-violet-900 active:scale-90 cursor-cell' onClick={() => { setr(112), setg(48), setb(160) }}></span>

                                                        </li>
                                                        <li>{l.lazga_nofa7s}
                                                            <span title={l.lazga_nofa7s} className='  w-16 h-16 rounded-full badge badge-xs bg-orange-900 active:scale-90 cursor-cell' onClick={() => { setr(197), setg(90), setb(17) }}></span>


                                                        </li>
                                                        <li>{l.salamat}
                                                            <span title={l.salamat} className='w-16 h-16 rounded-full badge badge-xs bg-blue-900 active:scale-90 cursor-cell' onClick={() => { setr(68), setg(114), setb(196) }}></span>


                                                        </li>
                                                        <li>{l.sestam}
                                                            <span title={l.sestam} className='w-16 h-16 rounded-full badge badge-xs bg-yellow-600 active:scale-90 cursor-cell' onClick={() => { setr(255), setg(192), setb(0) }}></span>


                                                        </li>
                                                        <li>{l.taqew}
                                                            <span title={l.taqew} className='w-16 h-16 rounded-full badge badge-xs bg-red-700 active:scale-90 cursor-cell' onClick={() => { setr(255), setg(0), setb(0) }}></span>


                                                        </li>



                                                    </ul>
                                                </div>




                                            </div>

                                            <div className='ltr:mx-3  '>

                                                <div className='space-x-5  hidden xl:block '>
                                                    <FontAwesomeIcon icon={faSave} className="text-2xl rtl:mx-5  cursor-pointer active:scale-90" onClick={to_image} />
                                                    <FontAwesomeIcon icon={faTrashAlt} className="text-2xl   cursor-pointer active:scale-90" onClick={clear} />
                                                    <FontAwesomeIcon icon={faUndo} className="text-2xl          cursor-pointer   active:scale-90" onClick={undo} />
                                                    <FontAwesomeIcon icon={faRedo} className="text-2xl   cursor-pointer   active:scale-90" onClick={redo} />

                                                </div>
                                                <div className="dropdown xl:hidden ltr:dropdown-left rtl:dropdown-right">
                                                    <FontAwesomeIcon icon={faGear} tabIndex={0} className="text-2xl   cursor-pointer active:scale-90" fixedWidth />


                                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-20  ">
                                                        <li>
                                                            <FontAwesomeIcon icon={faSave} className="text-2xl   cursor-pointer active:scale-90" onClick={to_image} />


                                                        </li>
                                                        <li>
                                                            <FontAwesomeIcon icon={faTrashAlt} className="text-2xl   cursor-pointer active:scale-90" onClick={clear} />



                                                        </li>
                                                        <li>
                                                            <FontAwesomeIcon icon={faUndo} className="text-2xl          cursor-pointer   active:scale-90" onClick={undo} />


                                                        </li>
                                                        <li>
                                                            <FontAwesomeIcon icon={faRedo} className="text-2xl       cursor-pointer   active:scale-90" onClick={redo} />


                                                        </li>


                                                    </ul>
                                                </div>


                                            </div>

                                        </div>
                                        <div className=" flex justify-center text-center   ">
                                            <canvas
                                                ref={canvasRef}
                                                id="canvas"
                                                className='mycanvas '
                                                // width={900}
                                                // height={800}

                                                onMouseDown={startDrawing}
                                                onMouseUp={endDrawing}
                                                onMouseMove={draw}


                                                onTouchStart={startTuch}
                                                onTouchEnd={endTuch}

                                            // onMouseLeave={async () => {

                                            //     var canvas = document.getElementById("canvas");

                                            //     let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                            //     setCarDamage(imageBlob)

                                            //     // setDamagepictur(canvas?.toDataURL("image/png").replace("image/png", "image/octet-stream"))
                                            // }}
                                            // onTouch={() => {
                                            //     setDamagepictur(canvas?.toDataURL("image/png").replace("image/png", "image/octet-stream"))
                                            // }}



                                            />

                                        </div>

                                    </div>

                                    <div className="flex  justify-around  border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl py-5 my-5  space-x-5 overflow-auto">


                                        <button type='button' disabled={IsCanvasChanged == 1 ? false : true} className="btn btn-success lg:btn-wide " onClick={async () => {

                                            var canvas = document.getElementById("canvas");

                                            let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                            setCarDamage(imageBlob)
                                            setIsCanvasChanged(0)

                                        }}><FontAwesomeIcon className="text-2xl" icon={faCheck} /> </button>

                                    </div >

                                    <div>
                                        <img ref={image} width={1920} height={1080} className="hidden" id='ImageDrowing' name="ImageDrowing" src={`/${Data.Tocar}.PNG`} alt="Tocar" />

                                    </div>

                                </div>


                            </div>
                        </div>

                    </div>
                    <div className="flex  justify-around  border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl py-5 my-5  space-x-5 overflow-auto">


                        <button type='button' className="btn lg:btn-wide " onClick={() => { setPage(2) }}>{l.back}</button>
                        <button type="submit" disabled={IsCanvasChanged == 0 ? false : true} className="btn lg:btn-wide " onClick={postCarsId} title={l.next}>{l.don}</button>

                    </div >



                </div >


            </ >


        </div >

    );
}

NewCars.Layout = AdminLayout;

export default NewCars;

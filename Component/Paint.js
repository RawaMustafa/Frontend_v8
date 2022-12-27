
import useLanguage from './language';
import AdminLayout from '../Layouts/AdminLayout';
import Head from 'next/head'
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faRedo, faUndo, faTrashAlt, faSave, faPaintBrush, faCircle, faSquare, faPenNib, faPalette, faPaintRoller, faGear, faWandMagicSparkles, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farFaCoffee, faSquare as farfaSquare, } from '@fortawesome/free-regular-svg-icons'
import $ from 'jquery';
import { getSession, useSession } from "next-auth/react";
import { useMemo } from 'react';





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


const Paint = ({ setDataImage, Tocar, GlobalState, page }) => {

    const { IsCanvasChanged, setIsCanvasChanged } = GlobalState


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
    const imagee = useRef()
    const [drawingTool, setDrawingTool] = useState('pen')
    var size = rangee






    useEffect(() => {
        const hi = async () => {
            if (typeof window != 'undefined') {
                clear()
                const image = new Image()
                image.src = await `/${Tocar}.png`;
                const canvass = canvasRef?.current;
                const contextt = canvass?.getContext('2d')
                contextRef.current = contextt
                canvass.width = window.innerWidth >= 1023 && window.innerWidth <= 2100 ? window.innerWidth - 375 : window.innerWidth >= 2100 ? 2100 - 375 : window.innerWidth - 40;
                canvass.height = canvass.width / 1.6;
                await contextt.drawImage(image, 0, 0, canvass.width, canvass.height);

            }

        }
        hi()


    }, [Tocar, canvasRef.current, contextRef.current, page])











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
        image.src = `/${Tocar}.png`;


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
        image.src = `/${Tocar}.png`;


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
            // const BlobImage = async () => {

            //     let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            //     // setCarDamage(imageBlob)
            // }
            // BlobImage()
            var url = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.download = 'filename.png';
            link.href = url;
            link.href.toString
            link.click();

        }

    }

    const clear = () => {

        const image = new Image()
        image.src = `/${Tocar}.png`;
        contextRef.current?.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        canDataCount = 0;
        canData = [];
        undoData = canData;
        oldData = canData;
        canDataCount = 0;
        canData = [];
        undoData = canData;
        oldData = canData;
        contextRef.current?.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    }




    return (


        <div className="">

            <Head>
                <title >{l.newcard}</title>

            </Head>

            <>
                <div className={`transition-transform delay-10000     `} >
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
                                                onMouseDown={startDrawing}
                                                onMouseUp={endDrawing}
                                                onMouseMove={draw}
                                                onTouchStart={startTuch}
                                                onTouchEnd={endTuch}

                                            />

                                        </div>

                                    </div>

                                    <div className="flex  justify-around  border dark:border-slate-700 ltr:mx-2 rtl:mx-2 rounded-xl py-5 my-5  space-x-5 overflow-auto">


                                        <button type='button' disabled={IsCanvasChanged == 1 ? false : true} className="btn btn-success lg:btn-wide " onClick={async () => {

                                            var canvas = document.getElementById("canvas");

                                            let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                                            setDataImage(imageBlob)
                                            setIsCanvasChanged(0)

                                        }}><FontAwesomeIcon className="text-2xl" icon={faCheck} /> </button>

                                    </div >

                                    <div>
                                        <img ref={imagee} width={1920} height={1080} className="hidden" id='ImageDrowing' name="ImageDrowing" src={`/${Tocar}.png`} alt="Tocar" />

                                    </div>

                                </div>


                            </div>
                        </div>

                    </div>




                </div >

            </ >
        </div >
    );

}
Paint.Layout = AdminLayout;

export default Paint;

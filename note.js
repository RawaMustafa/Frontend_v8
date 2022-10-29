










<tbody className={`${detpage !== 1 ? "hidden" : ""} `}>
    <tr className="">
        <td>{l.tocar} :</td>
        <td>{cars.carDetail.tocar}</td>
    </tr>
    <tr className="">
        <td>{l.tire} :</td>
        <td>{cars.carDetail.tire}</td>
    </tr>
    <tr className="">
        <td>{l.date} :</td>
        <td>{cars.carDetail.date}</td>
    </tr>
    <tr className="">
        <td>{l.namecar} :</td>
        <td>{cars.carDetail.modeName}</td>
    </tr>
    <tr className="">
        <td>{l.modelyear} :</td>
        <td>{cars.carDetail.model}</td>
    </tr>
    <tr className="">
        <td>{l.vinnumber} :</td>
        <td>{cars.carDetail.VINNumber}</td>
    </tr>
    <tr className="">
        <td>{l.mileage} :</td>
        <td>{cars.carDetail.mileage}</td>
    </tr>
    <tr className="">
        <td>{l.color} :</td>
        <td>{cars.carDetail.color}</td>
    </tr>
    <tr className="">
        <td>{l.arived}:</td>
        <td className="">{cars.carDetail.arrived?.toString()}</td>
    </tr>
    <tr className="">
        <td>{l.wheeldrivetype} :</td>
        <td>{cars.carDetail.wheelDriveType}</td>
    </tr>
    <tr className="">
        <td>{l.price} :</td>
        <td>{cars.carDetail.carCost.price}</td>
    </tr>
    <tr className="">
        <td>{l.isSold} :</td>
        <td>{cars.carDetail.carCost.isSold?.toString()}</td>
    </tr>
    <tr className="">
        <td>{l.tobalance} :</td>
        <td>{cars.carDetail.tobalance}</td>
    </tr>
    <tr className="">
        <td>{l.pricepaidorcaratbid}:</td>
        <td>{cars.carDetail.carCost.pricePaidbid}</td>
    </tr>
    <tr className="">
        <td>{l.storagefee} :</td>
        <td>{cars.carDetail.carCost.feesinAmericaStoragefee}</td>
    </tr>
    <tr className="">
        <td>{l.copartoriaafee} :</td>
        <td>{cars.carDetail.carCost.feesinAmericaCopartorIAAfee}</td>
    </tr>
    <tr className="">
        <td> {l.dubairepaircost} :</td>
        <td>{cars.carDetail.carCost.feesAndRepaidCostDubairepairCost}</td>
    </tr>
    <tr className="">
        <td> {l.feesinadubai} :</td>
        <td>{cars.carDetail.carCost.feesAndRepaidCostDubaiFees}</td>
    </tr>
    <tr className="">
        <td> {l.feesAndRepaidCostDubaiothers} :</td>
        <td>{cars.carDetail.carCost.feesAndRepaidCostDubaiothers}</td>
    </tr>
    <tr className="">
        <td>{l.coccost} :</td>
        <td>{cars.carDetail.carCost.coCCost}</td>
    </tr>
    <tr className="">
        <td> {l.uslocation} :</td>
        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostLocation}</td>
    </tr>
    <tr className="">
        <td>{l.fromamericatodubai} :</td>
        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostTranscost}</td>
    </tr>
    <tr className="">
        <td>{l.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost} :</td>
        <td>{cars.carDetail.carCost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost}</td>

    </tr>


    <tr className="">
        <td>{l.fromdubaitokurdistan} :</td>
        <td>{cars.carDetail.carCost.dubaiToIraqGCostTranscost}</td>
    </tr>
    <tr className="">
        <td>{l.dubaiToIraqGCostgumrgCost} :</td>
        <td>{cars.carDetail.carCost.dubaiToIraqGCostgumrgCost}</td>
    </tr>




    <tr className="">
        <td>{l.numberinkurdistan} :</td>
        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanRaqam}</td>
    </tr>
    <tr className="">
        <td>{l.repaircostinkurdistan} :</td>
        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanrepairCost}</td>
    </tr>


    <tr className="">
        <td>{l.raqamAndRepairCostinKurdistanothers} :</td>
        <td>{cars.carDetail.carCost.raqamAndRepairCostinKurdistanothers}</td>
    </tr>







</tbody>
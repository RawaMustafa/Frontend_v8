import { useState } from "react"
import Paint from "./Paint"
const Test = () => {

    const [DataImage, setDataImage] = useState(null)
    const [Tocar, setTocar] = useState("Sedan")
    console.log(DataImage, Tocar)
    return (
        <div>

            <select className="select select-info w-full max-w-xs" defaultValue={"Sedan"} onChange={(e) => { setTocar(e.target.value) }}>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="PickUp">PickUp</option>
            </select>
            <Paint setDataImage={setDataImage} Tocar={Tocar} />
        </div>
    )
}

export default Test
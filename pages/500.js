import useLanguage from '../Component/language'
import { useRouter } from 'next/router';

import Image from 'next/image';
const Error = () => {

    // const router = useRouter()
    const l = useLanguage();

    // setTimeout(() => {

    //     router.push("/")

    // }, 2000)

    // - 500 error page

    return (
        <div className="m-auto top-[50%] -translate-y-[50%] absolute -translate-x-[50%] left-[50%] ">
            < Image src="/404.svg" alt="Error" className="w-96 " width={404} height={404} />
            {/* <img src="/404.svg" alt="Error" className="w-96 " /> */}
            <div className="mt-20 text-center text-xl " > {l.error}</div >
            <div className=" text-center text-4xl">{l.error500}</div>

        </div >
    )
}
export default Error
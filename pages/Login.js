import Head from 'next/head'
import useLanguage from "../Component/language";
import { useRef, useEffect, useState } from "react"

import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { useRouter } from "next/router";
import { useSession, getSession, signIn } from "next-auth/react";
import Image from 'next/image';




export async function getServerSideProps({ req }) {

  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }


}



const emai_regex = /^[\w-\.]{4,20}@([a-z]{2,6}\.)+[a-z]{2,4}$/;
const password_regex = /^[a-zA-Z0-9\.\-\_]{4,16}$/;



const Login = () => {

  const router = useRouter()
  const { status } = useSession()
  if (status == "authenticated") {
    router.push('/');
  }


  const emailRef = useRef();
  const passwordRef = useRef();

  const [Email, setEmail] = useState("")
  const [EValid, setEValid] = useState(false)
  const [EFocus, setEFocus] = useState(false)


  const [Password, setPassword] = useState("")
  const [PValid, setPValid] = useState(false)
  const [PFocus, setPFocus] = useState(false)


  const [Error, setError] = useState("false")
  const [Message, setMessage] = useState([])

  const l = useLanguage();



  useEffect(() => {
    // setEValid(emai_regex.test(Email))
    Email.match(emai_regex) == null || Email.match(emai_regex)[0] != Email ? setEValid(false) : setEValid(true);


  }, [Email], [])



  useEffect(() => {

    Password.match(password_regex) == null || Password.match(password_regex)[0] != Password ? setPValid(false) : setPValid(true);

  }, [Password], [])




  const onSubmit = () => {
    if (EValid && PValid) {
      signIn('credentials', { email: Email, password: Password, callbackUrl: '/', redirect: true })
    }
  }




  return (
    <>
      <Head>
        <title >{l.login}</title>
      </Head>

      <div className=" container mx-auto flex items-center sm:h-screen justify-center    ">


        <div className="max-h-screen overflow-auto scrollbar-hide  sm:bg-gray-200 dark:sm:bg-slate-700 rounded-3xl pt-20 my-10 px-4 sm:px-6 lg:px-8 ">

          <div className="max-w-md w-full space-y-10  sm:px-16  ">
            <div>
              <div className=" flex  justify-center  ">
                <Image alt="LogInImage" src="/svg_Login.svg" width={200} height={200} />
              </div>
            </div>

            <div >

              <div className=" space-y-10">
                <div className="mb-8">
                  <label htmlFor="email" >{l.email}{" "}:{" "}

                    {EValid && <FontAwesomeIcon className="text-green-600" icon={faCheck} />}
                    {!EValid && Email != "" && <FontAwesomeIcon className="text-red-600" icon={faTimes} />}
                  </label>

                  <input
                    defaultValue={Email}
                    autoComplete='off'
                    required
                    // aria-invalid={EValid ? "false" : "true"}
                    aria-describedby='email-error'
                    onFocus={() => setEFocus(true)}
                    onBlur={() => setEFocus(false)}
                    onClick={(e) => {
                      setEmail(e.target.value)
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    type="email"
                    ref={emailRef}
                    id="email"
                    name="email"
                    placeholder={l.email}
                    className={` input  w-full  max-w-xl  focus:outline-0 border-blue-600   ${!EValid && "focus:border-red-600"}  ${EValid && "focus:border-green-600"}`}
                  />

                  <p id="email-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black ${Email && !EValid && !EFocus ? "block" : "hidden"}`}>
                    Email incorrect
                    <br />
                    12 to 24 charactars


                  </p>

                </div>

                <div className="">
                  <label htmlFor="password"> {l.password} :{" "}
                    {PValid && <FontAwesomeIcon className="text-green-600" icon={faCheck} />}
                    {!PValid && Password != "" && <FontAwesomeIcon className="text-red-600" icon={faTimes} />}

                  </label>

                  <input
                    required
                    aria-invalid={PValid ? "false" : "true"}
                    aria-describedby='password-error'
                    onFocus={() => setPFocus(true)}
                    onBlur={() => setPFocus(false)}
                    name="password"
                    type="password"
                    id="password"
                    placeholder={l.password}
                    className={`input  w-full max-w-xl focus:outline-0 border-blue-600   ${!PValid && "focus:border-red-600"}  ${PValid && "focus:border-green-600"}`}
                    onClick={(e) => {
                      setPassword(e.target.value)

                    }}
                    onChange={(e) => {
                      setPassword(e.target.value)

                    }}
                  />
                  <p id="password-error" className={`bg-rose-400 rounded m-1 text-sm p-2 text-black  ${Password && !PFocus && !PValid ? "block" : "hidden"}`}>
                    Password incorrect
                    <br />
                    4 to 16 charactars


                  </p>

                </div>
              </div>

              <div className="text-center my-10 ">
                <input type="submit" value={l.login} disabled={PValid && EValid ? false : true} className={`btn btn-accent btn-wide ${!PValid && !EValid && "shadow-red-600 shadow-sm"} `}

                  onClick={onSubmit}

                />
              </div>
            </div>


          </div>
        </div>





      </div >
    </>
  )

}

export default Login;


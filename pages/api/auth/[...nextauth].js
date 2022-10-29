
import axios from 'axios';
import Axios from '../Axios'

import dayjs from "dayjs"


import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// export default NextAuth(() => {

const nextAuthOptions = (req, res) => {
    return {
        providers: [

            CredentialsProvider({
                type: 'credentials',
                name: 'credentials',
                async authorize(credentials) {


                    try {
                        const user = await Axios.post('/users/login',
                            {
                                email: credentials.email,
                                password: credentials.password
                            },

                        )


                        if (user) {
                            return { status: 'success', data: user.data }

                        }


                    } catch (e) {
                        const errorMessage = e
                        // Redirecting to the login page with error message          in the URL
                        throw new Error(errorMessage + '     &email=    ' + credentials.email + '     &password=    ' + credentials.password)
                    }
                }
            })
        ],



        callbacks: {



            jwt({ token, user }) {

                if (user) {
                    token.accessToken = user.data.token
                    token.refreshToken = user.data.refreshToken;
                    token.userRole = user.data.UserRole
                    token.id = user.data.id
                    token.accessTokenExpiry = user.data.refreshEXP
                }

                if (dayjs.unix(token.accessTokenExpiry).diff(dayjs()) < 1) {
                    token.error = "RefreshAccessTokenError"
                    return Promise.resolve(token);
                }




                token = refreshAccessToken(token);
                return Promise.resolve(token);


            },


            session({ session, token }) {


                if (token) {
                    session.userRole = token.userRole
                    session.error = token.error
                    session.id = token.id
                    session.accessTokenExpiry = token.accessTokenExpiry

                }

                return session;

            },

        },

        pages: {
            signIn: '/Login',
            signOut: '/Login',
            error: '/Login'

        }
    }

}
// });


export default (req, res) => {
    return NextAuth(req, res, nextAuthOptions(req, res))
}



async function refreshAccessToken(tokenObject) {

    try {

        const tokenResponse = await Axios.post("/users/reLogin", {

            patata: tokenObject.refreshToken

        });




        return {
            ...tokenObject,
            accessToken: tokenResponse.data.token,
        }
    } catch (error) {

        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",

        }
    }
}
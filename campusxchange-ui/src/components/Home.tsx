import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

type Props = {}

const Home: React.FC<Props> = () => {
    const [token, setToken] = useState<string | null>('')

    useEffect(() => {
        // Get the token from cookies
        const authToken = Cookies.get('authToken')
        setToken(authToken || 'No token found')
    }, [])

    return (
        <div className="container">
            <header className="jumbotron">
                <h1>CampusXchange</h1>
            </header>
            <div>
                <h3>Your Auth Token:</h3>
                <p>{token}</p>
            </div>
        </div>
    )
}

export default Home

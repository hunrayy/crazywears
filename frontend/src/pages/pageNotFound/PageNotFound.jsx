


import { Link } from "react-router-dom"
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
import "./pageNotFound.css"
const PageNotFound = () => {
    return <div>
        <Navbar />
        <div className="page-not-found-container">
            <div className="page-not-found-wrapper">
                <p>404</p>
                <div>
                    <h1>Page not found!</h1>
                    <p>The link that brought you here seems to be faulty</p>
                </div>
                <Link to ="/" className="page-not-found-button ">Back to home</Link>
            </div>
        </div>
        <Footer />

    </div>
}

export default PageNotFound
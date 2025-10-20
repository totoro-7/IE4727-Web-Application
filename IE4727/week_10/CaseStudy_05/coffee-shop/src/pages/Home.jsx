import '../styles/pages/Home.css'

const Home = () => {
    return (
        <div className="home-page">
            <h2>Follow the Winding Road to JavaJam</h2>
            <div className="content">
                <img src="/winding_road.png" width="400" height="200" className="left-img" alt="Winding Road" />
                <div className="ul-contents">
                    <ul>
                        <li>Specialty Coffee and Tea</li>
                        <li>Bagels, Muffins, and Organic Snacks</li>
                        <li>Music and Poetry Readings</li>
                        <li>Open Mic Night Every Friday</li>
                    </ul>

                    <p>
                        54321 Route 42
                        <br />Elison Bay, WI 54210
                        <br />888-555-8888
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home
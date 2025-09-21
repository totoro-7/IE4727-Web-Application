import React from 'react';
import '../styles/pages/Home.css';

const Home = () => {
    return (
        <div class="main">
            <div id="rightcolumn">
                <h2>Coffee at JavaJam</h2>
                <div class="content">
                    <table>
                        <tr>
                            <td class="type"><b>Just Java</b></td>
                            <td>
                                Regular house blend, decaffinated coffee, or flavor of the day. <br />
                                <b>Endless Cup $2.00</b>
                            </td>
                        </tr>
                        <tr>
                            <td class="type"><b>Cafe au Lait</b></td>
                            <td>
                                House blend coffee infused into a smooth, steamed milk.<br />
                                <b>Single $2.00 Double $3.00</b> 
                            </td>
                        </tr>
                        <tr>
                            <td class="type"><b>Iced Cappucino</b></td>
                            <td>
                                Sweetened espresso blended with icy-cold milk and served in a chilled glass. <br />
                                <b>Single $4.75 Double $5.75</b>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home;
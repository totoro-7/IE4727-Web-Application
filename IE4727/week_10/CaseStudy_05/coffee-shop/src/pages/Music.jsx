import '../styles/pages/Music.css'

const Music = () => {
    return (
        <div className="music-page">
            <h2>Music at JavaJam</h2>
            <p>
                The first Friday night each month at JavaJam is a special night. Join us from 8pm to 11pm for some music you won't want to miss!
            </p>

            <div className="music-event">
                <h3>January</h3>
                <div className="performer">
                    <img src="/winding_road.png" alt="Melanie Morris" className="performer-img" />
                    <div className="performer-info">
                        <strong>Melanie Morris entertains with her melodic folk style.</strong>
                        <p>
                            Melanie Morris is a singer/songwriter from the Midwest. She has performed at festivals and coffeehouses throughout the region.
                        </p>
                    </div>
                </div>
            </div>

            <div className="music-event">
                <h3>February</h3>
                <div className="performer">
                    <img src="/winding_road.png" alt="Tahoe Greg" className="performer-img" />
                    <div className="performer-info">
                        <strong>Tahoe Greg is back from his tour. New songs. New stories.</strong>
                        <p>
                            Tahoe Greg's unique folk style is sure to please. Join us for an evening of songs and stories about his adventures in the mountains.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Music
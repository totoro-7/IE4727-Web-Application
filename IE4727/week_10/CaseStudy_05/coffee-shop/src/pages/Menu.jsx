import { useState } from 'react'
import '../styles/pages/Menu.css'

const Menu = () => {
    const [quantities, setQuantities] = useState({
        justJava: 0,
        cafeAuLait: 0,
        icedCappuccino: 0
    })

    const [sizes, setSizes] = useState({
        cafeAuLait: 'single',
        icedCappuccino: 'single'
    })

    const prices = {
        justJava: 2.00,
        cafeAuLait: { single: 2.00, double: 3.00 },
        icedCappuccino: { single: 4.75, double: 5.75 }
    }

    const handleQuantityChange = (item, value) => {
        setQuantities(prev => ({
            ...prev,
            [item]: parseInt(value) || 0
        }))
    }

    const handleSizeChange = (item, size) => {
        setSizes(prev => ({
            ...prev,
            [item]: size
        }))
    }

    const calculateSubtotal = (item) => {
        if (item === 'justJava') {
            return (quantities[item] * prices[item]).toFixed(2)
        }
        return (quantities[item] * prices[item][sizes[item]]).toFixed(2)
    }

    const calculateTotal = () => {
        let total = quantities.justJava * prices.justJava
        total += quantities.cafeAuLait * prices.cafeAuLait[sizes.cafeAuLait]
        total += quantities.icedCappuccino * prices.icedCappuccino[sizes.icedCappuccino]
        return total.toFixed(2)
    }

    return (
        <div className="menu-page">
            <h2>Coffee at JavaJam</h2>
            
            <table className="menu-table">
                <tbody>
                    <tr>
                        <td className="item-name"><strong>Just Java</strong></td>
                        <td className="item-description">
                            Regular house blend, decaffeinated coffee, or flavor of the day.
                            <br />
                            Endless Cup $2.00
                        </td>
                        <td className="item-quantity">
                            <label>
                                Quantity: 
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={quantities.justJava}
                                    onChange={(e) => handleQuantityChange('justJava', e.target.value)}
                                />
                            </label>
                        </td>
                        <td className="item-subtotal">
                            ${calculateSubtotal('justJava')}
                        </td>
                    </tr>

                    <tr>
                        <td className="item-name"><strong>Cafe au Lait</strong></td>
                        <td className="item-description">
                            House blended coffee infused into a smooth, steamed milk.
                            <br />
                            <label>
                                <input 
                                    type="radio" 
                                    name="cafeAuLait" 
                                    value="single"
                                    checked={sizes.cafeAuLait === 'single'}
                                    onChange={(e) => handleSizeChange('cafeAuLait', e.target.value)}
                                /> Single $2.00
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="cafeAuLait" 
                                    value="double"
                                    checked={sizes.cafeAuLait === 'double'}
                                    onChange={(e) => handleSizeChange('cafeAuLait', e.target.value)}
                                /> Double $3.00
                            </label>
                        </td>
                        <td className="item-quantity">
                            <label>
                                Quantity: 
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={quantities.cafeAuLait}
                                    onChange={(e) => handleQuantityChange('cafeAuLait', e.target.value)}
                                />
                            </label>
                        </td>
                        <td className="item-subtotal">
                            ${calculateSubtotal('cafeAuLait')}
                        </td>
                    </tr>

                    <tr>
                        <td className="item-name"><strong>Iced Cappuccino</strong></td>
                        <td className="item-description">
                            Sweetened espresso blended with icy-cold milk and served in a chilled glass.
                            <br />
                            <label>
                                <input 
                                    type="radio" 
                                    name="icedCappuccino" 
                                    value="single"
                                    checked={sizes.icedCappuccino === 'single'}
                                    onChange={(e) => handleSizeChange('icedCappuccino', e.target.value)}
                                /> Single $4.75
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    name="icedCappuccino" 
                                    value="double"
                                    checked={sizes.icedCappuccino === 'double'}
                                    onChange={(e) => handleSizeChange('icedCappuccino', e.target.value)}
                                /> Double $5.75
                            </label>
                        </td>
                        <td className="item-quantity">
                            <label>
                                Quantity: 
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={quantities.icedCappuccino}
                                    onChange={(e) => handleQuantityChange('icedCappuccino', e.target.value)}
                                />
                            </label>
                        </td>
                        <td className="item-subtotal">
                            ${calculateSubtotal('icedCappuccino')}
                        </td>
                    </tr>

                    <tr>
                        <td colSpan="3" className="total-label"><strong>Total:</strong></td>
                        <td className="total-amount"><strong>${calculateTotal()}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Menu
import { useState } from 'react'
import '../styles/pages/Jobs.css'

const Jobs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        startDate: '',
        experience: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required'
        }

        if (!formData.experience.trim()) {
            newErrors.experience = 'Experience is required'
        }

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validateForm()

        if (Object.keys(newErrors).length === 0) {
            // Form is valid, submit the data
            console.log('Form submitted:', formData)
            alert('Application submitted successfully!')
            // Reset form
            setFormData({
                name: '',
                email: '',
                startDate: '',
                experience: ''
            })
        } else {
            setErrors(newErrors)
        }
    }

    return (
        <div className="jobs-page">
            <h2>Jobs at JavaJam</h2>
            <p>
                Want to work at JavaJam? Fill out the form below to start your application. All positions are part-time with a starting wage of $12.00 per hour.
            </p>

            <form onSubmit={handleSubmit} className="jobs-form">
                <div className="form-group">
                    <label htmlFor="name">* Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">* Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">* Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={errors.startDate ? 'error' : ''}
                    />
                    {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="experience">* Experience:</label>
                    <textarea
                        id="experience"
                        name="experience"
                        rows="5"
                        value={formData.experience}
                        onChange={handleChange}
                        className={errors.experience ? 'error' : ''}
                    ></textarea>
                    {errors.experience && <span className="error-message">{errors.experience}</span>}
                </div>

                <button type="submit" className="submit-btn">Apply Now</button>
            </form>
        </div>
    )
}

export default Jobs
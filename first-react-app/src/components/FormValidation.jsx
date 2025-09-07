import { useState } from "react";

const FormValidation = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert("Form submitted successfully!");
        console.log(formData);

        // Reset form
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

    return (
        <div className="form-validation">
            <h1>Form Validation</h1>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    required 
                />
                <br />
                <label>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                />
                <br />
                <label>Password:</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                    minLength="6" 
                />
                <br />
                <label>Confirm Password:</label>
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required 
                    minLength="6" 
                />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default FormValidation;
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const Form = () => {
    const [formData, setFormData] = useState({
        name: '',
        father_name: '',
        property_size: '',
        sale_amount: '',
        date: '',
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/generate-pdf`,
                formData,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sale-deed.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('PDF download failed', err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl"
        >
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your Full Name"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div>
                <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                </label>
                <input
                    type="text"
                    name="father_name"
                    id="father_name"
                    placeholder="Enter Father's Name"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div>
                <label htmlFor="property_size" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Size (sq.ft.)
                </label>
                <input
                    type="number"
                    name="property_size"
                    id="property_size"
                    placeholder="e.g. 1200"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div>
                <label htmlFor="sale_amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Amount (₹)
                </label>
                <input
                    type="number"
                    name="sale_amount"
                    id="sale_amount"
                    placeholder="e.g. 500000"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Sale
                </label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div className="flex justify-center pt-4">
                <button
                    type="submit"
                    className="bg-red-700 hover:bg-red-600 text-white py-2 px-6 rounded-md font-semibold shadow-md transition duration-200"
                >
                    Generate PDF
                </button>
            </div>
        </form>

    );
};

export default Form;

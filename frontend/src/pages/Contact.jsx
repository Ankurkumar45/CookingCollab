import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Please fill in all required fields'
            });
            return;
        }

        // Store message in localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            ...formData,
            id: Date.now(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Show success message
        setStatus({
            type: 'success',
            message: 'Message sent successfully! We will get back to you soon.'
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });

        // Clear status after 3 seconds
        setTimeout(() => {
            setStatus({ type: '', message: '' });
        }, 3000);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center mb-4">Contact Us</h1>

                            {status.message && (
                                <div className={`alert alert-${status.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                                    {status.message}
                                    <button type="button" className="btn-close" onClick={() => setStatus({ type: '', message: '' })}></button>
                                </div>
                            )}

                            <div className="row mb-4">
                                <div className="col-md-4 text-center mb-3 mb-md-0">
                                    <div className="d-inline-block p-3 bg-light rounded-circle mb-2">
                                        <i className="bi bi-geo-alt text-danger fs-4"></i>
                                    </div>
                                    <h5>Address</h5>
                                    <p className="text-muted">Gopalganj<br />Bihar, 841428</p>
                                </div>
                                <div className="col-md-4 text-center mb-3 mb-md-0">
                                    <div className="d-inline-block p-3 bg-light rounded-circle mb-2">
                                        <i className="bi bi-envelope text-danger fs-4"></i>
                                    </div>
                                    <h5>Email</h5>
                                    <p className="text-muted">ankur@gmail.com</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <div className="d-inline-block p-3 bg-light rounded-circle mb-2">
                                        <i className="bi bi-telephone text-danger fs-4"></i>
                                    </div>
                                    <h5>Phone</h5>
                                    <p className="text-muted">+91 7079076206</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="subject" className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="message" className="form-label">Message *</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-danger w-100">
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
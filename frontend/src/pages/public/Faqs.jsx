import React, { useState } from 'react';
import './Faqs.css';

export default function Faqs() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: 'How do I create an account?',
            answer: 'Click the Sign Up button and fill in your details. Verify your email and you\'re ready to go!'
        },
        {
            question: 'What is SubletMatch?',
            answer: 'SubletMatch is a platform connecting subletters with renters looking for temporary housing solutions.'
        },
        {
            question: 'How do I list a sublet?',
            answer: 'Go to your dashboard, click "Create Listing", add property details, photos, and availability dates.'
        },
        {
            question: 'What are the fees?',
            answer: 'We charge a 5% service fee on all successful bookings. No hidden fees!'
        },
        {
            question: 'How do I contact support?',
            answer: 'Email us at support@subletmatch.com or use the contact form on our website.'
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faqs-container">
            <h1>Frequently Asked Questions</h1>
            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div key={index} className="faq-item">
                        <button
                            className="faq-question"
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{item.question}</span>
                            <span className={`arrow ${openIndex === index ? 'open' : ''}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className="faq-answer">{item.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
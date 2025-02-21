import {useState} from 'react';
import emailjs from 'emailjs-com';
import {useLanguage} from '../contexts/LanguageContext.jsx';
import {translations} from '../translations/translations';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom'; // Import useNavigate

const ContactForm = () => {
    const {language} = useLanguage();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission status
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();

        // Disable the submit button to prevent spamming
        setIsSubmitting(true);

        // Replace these with your EmailJS credentials
        const SERVICE_ID = 'service_de7zaoc';
        const TEMPLATE_ID = 'template_p67pv5n'; // Template for your team
        const AUTOREPLY_TEMPLATE_ID = 'template_4shu2y1'; // Template for the user
        const USER_ID = 'ldEv3ChqooxIHs22_';

        // Send email to your team
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target, USER_ID)
            .then((result) => {
                console.log('Email to team sent:', result.text);
                const autoreplyData = {
                    email,
                    firstName,
                    lastName,
                    message,
                    subject: translations.emailResponse.subject[language],
                    greeting: translations.emailResponse.greeting[language],
                    thankYouMessage: translations.emailResponse.thankYouMessage[language],
                    yourMessageLabel: translations.emailResponse.yourMessageLabel[language],
                    responseMessage: translations.emailResponse.responseMessage[language],
                    footerMessage: translations.emailResponse.footerMessage[language],
                    bestRegards: translations.emailResponse.bestRegards[language],
                };
                return emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, autoreplyData, USER_ID);
            })
            .then((result) => {
                console.log('Autoreply sent:', result.text);
                setIsSubmitted(true);
                setFirstName('');
                setLastName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setErrorMessage('');

                // Redirect to the main page after 3 seconds
                setTimeout(() => {
                    navigate('/'); // Replace '/' with your main page route
                }, 3000); // 3 seconds
            }, (error) => {
                console.error('Error:', error);
                setErrorMessage(translations.contactForm.error[language]);
            })
            .finally(() => {
                // Re-enable the submit button after the request is complete
                setIsSubmitting(false);
            });
    };

    return (
        <StyledWrapper>
            <div className="contact-form-container">
                {isSubmitted ? (
                    <p className="title">{translations.contactForm.success[language]}</p>
                ) : (
                    <>
                        <p className="title">{translations.contactForm.title[language]}</p>
                        <form className="form" onSubmit={handleSubmit}>
                            <p className="message">{translations.contactForm.description[language]}</p>
                            <div className="flex">
                                <label>
                                    <input
                                        className="input"
                                        type="text"
                                        name="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    <span>{translations.personalInfo.firstName[language]}</span>
                                </label>
                                <label>
                                    <input
                                        className="input"
                                        type="text"
                                        name="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    <span>{translations.personalInfo.lastName[language]}</span>
                                </label>
                            </div>
                            <label>
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span>{translations.personalInfo.email[language]}</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    name="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                                <span>{translations.contactForm.subject[language]}</span>
                            </label>
                            <label>
                            <textarea
                                className="input"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={translations.contactForm.message[language]}
                                required
                            />
                            </label>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button className="submit" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? translations.contactForm.submitting[language] : translations.contactForm.submit[language]}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px); // Adjust based on your header height
    padding: 2rem;

    .contact-form-container {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        padding: 2rem;
        transition: box-shadow 0.3s ease;

        &:hover {
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
    }

    .form label textarea.input::placeholder {
        color: grey;
        font-size: 0.9em;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        max-width: 450px;
        background-color: #fff;
        padding: 20px;
        border-radius: 20px;
        position: relative;
    }

    .title {
        font-size: 28px;
        color: #149d80;
        font-weight: 600;
        letter-spacing: -1px;
        position: relative;
        display: flex;
        align-items: center;
        padding-left: 30px;
    }

    .title::before, .title::after {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        border-radius: 50%;
        left: 0px;
        background-color: #149d80;
    }

    .title::before {
        width: 18px;
        height: 18px;
        background-color: #149d80;
    }

    .title::after {
        width: 18px;
        height: 18px;
        animation: pulse 1s linear infinite;
    }

    .message, .signin {
        color: rgba(88, 87, 87, 0.822);
        font-size: 14px;
    }

    .signin {
        text-align: center;
    }

    .signin a {
        color: #149d80;
    }

    .signin a:hover {
        text-decoration: underline #149d80;
    }

    .flex {
        display: flex;
        width: 100%;
        gap: 6px;
    }

    .form label {
        position: relative;
    }

    .form label .input {
        width: 100%;
        padding: 10px 10px 20px 10px;
        outline: 0;
        border: 1px solid rgba(105, 105, 105, 0.397);
        border-radius: 10px;
    }

    .form label .input + span {
        position: absolute;
        left: 10px;
        top: 15px;
        color: grey;
        font-size: 0.9em;
        cursor: text;
        transition: 0.3s ease;
    }

    .form label .input:placeholder-shown + span {
        top: 15px;
        font-size: 0.9em;
    }

    .form label .input:focus + span, .form label .input:valid + span {
        top: 30px;
        font-size: 0.7em;
        font-weight: 600;
    }

    .form label .input:valid + span {
        color: green;
    }

    .submit {
        border: none;
        outline: none;
        background-color: #149d80;
        padding: 10px;
        border-radius: 10px;
        color: #fff;
        font-size: 16px;
        transition: .3s ease;
    }

    .submit:hover {
        background-color: #0d7c66;
    }

    @keyframes pulse {
        from {
            transform: scale(0.9);
            opacity: 1;
        }

        to {
            transform: scale(1.8);
            opacity: 0;
        }
    }
`;

export default ContactForm;
import {useState} from 'react';
import emailjs from 'emailjs-com';
import {useLanguage} from '../contexts/LanguageContext.jsx';
import {translations} from '../translations/translations';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import {StyledWrapper} from '../styles/ContactForm.styles';

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

        const SERVICE_ID = 'service_de7zaoc';
        const TEMPLATE_ID = 'template_p67pv5n';
        const AUTOREPLY_TEMPLATE_ID = 'template_4shu2y1';
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

export default ContactForm;
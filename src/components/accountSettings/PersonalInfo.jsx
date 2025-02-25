import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { translations } from '../../translations/translations.js';

export function PersonalInfo() {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const [userInfo, setUserInfo] = useState({
        name: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [editField, setEditField] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');

                if (!token || !email) {
                    setError('User not authenticated');
                    return;
                }

                const response = await axios.get(`http://localhost:8000/api/users/email/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const userData = response.data.data.user;
                setUserInfo({
                    name: userData.name || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || ''
                });
            } catch (err) {
                setError('Failed to fetch user information');
                console.error(err);
                setUserInfo({
                    name: '',
                    lastName: '',
                    email: '',
                    phone: ''
                });
            }
        };

        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const handleSubmit = async (fieldName) => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            if (!token || !email) {
                setError('User not authenticated');
                return;
            }

            await axios.put(`http://localhost:8000/api/users/email/${email}`, userInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });

            setEditField(null);
            setError(null);
        } catch (err) {
            setError('Failed to update user information');
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl min-w-[48rem] mx-auto p-8 space-y-8">
            <div className="flex items-center space-x-2 text-gray-600">
                <button onClick={() => navigate('/account-settings')} className="hover:underline">
                    {translations.accountSettings.account[language]}
                </button>
                <span>&gt;</span>
                <span>{translations.personalInfo.title[language]}</span>
            </div>

            <h1 className="text-3xl font-semibold mb-8">{translations.personalInfo.title[language]}</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <StyledForm>
                {/* Legal Name Section */}
                <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 min-w-[200px]">
                            {translations.personalInfo.legalName[language]}
                        </span>
                        {editField !== 'name' ? (
                            <button
                                onClick={() => setEditField('name')}
                                className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                            >
                                {translations.personalInfo.edit[language]}
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleSubmit('name')}
                                    className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                                >
                                    {translations.personalInfo.save[language]}
                                </button>
                                <button
                                    onClick={() => setEditField(null)}
                                    className="text-gray-600 text-sm font-semibold hover:text-gray-800"
                                >
                                    {translations.personalInfo.cancel[language]}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {editField === 'name' ? (
                            <>
                                <label className="flex-1">
                                    <input
                                        type="text"
                                        name="name"
                                        value={userInfo.name}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                    <span>{translations.personalInfo.firstName[language]}</span>
                                </label>
                                <label className="flex-1">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userInfo.lastName}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                    <span>{translations.personalInfo.lastName[language]}</span>
                                </label>
                            </>
                        ) : (
                            <div className="flex-1">
                                <p className="text-gray-600">{`${userInfo.name} ${userInfo.lastName}`}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Section */}
                <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 min-w-[200px]">
                            {translations.personalInfo.emailAddress[language]}
                        </span>
                        {editField !== 'email' ? (
                            <button
                                onClick={() => setEditField('email')}
                                className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                            >
                                {translations.personalInfo.edit[language]}
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleSubmit('email')}
                                    className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                                >
                                    {translations.personalInfo.save[language]}
                                </button>
                                <button
                                    onClick={() => setEditField(null)}
                                    className="text-gray-600 text-sm font-semibold hover:text-gray-800"
                                >
                                    {translations.personalInfo.cancel[language]}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {editField === 'email' ? (
                            <label className="flex-1">
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                                <span>{translations.personalInfo.email[language]}</span>
                            </label>
                        ) : (
                            <div className="flex-1">
                                <p className="text-gray-600">{userInfo.email}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phone Section */}
                <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 min-w-[200px]">
                            {translations.personalInfo.phoneNumber[language]}
                        </span>
                        {editField !== 'phone' ? (
                            <button
                                onClick={() => setEditField('phone')}
                                className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                            >
                                {translations.personalInfo.edit[language]}
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleSubmit('phone')}
                                    className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                                >
                                    {translations.personalInfo.save[language]}
                                </button>
                                <button
                                    onClick={() => setEditField(null)}
                                    className="text-gray-600 text-sm font-semibold hover:text-gray-800"
                                >
                                    {translations.personalInfo.cancel[language]}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {editField === 'phone' ? (
                            <label className="flex-1">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                                <span>{translations.personalInfo.phoneNumber[language]}</span>
                            </label>
                        ) : (
                            <div className="flex-1">
                                <p className="text-gray-600">{userInfo.phone}</p>
                            </div>
                        )}
                    </div>
                </div>
            </StyledForm>
        </div>
    );
}

const StyledForm = styled.div`
    label {
        position: relative;
    }

    label .input {
        width: 100%;
        padding: 10px 10px 20px 10px;
        outline: 0;
        border: 1px solid rgba(105, 105, 105, 0.397);
        border-radius: 10px;
    }

    label .input + span {
        position: absolute;
        left: 10px;
        top: 15px;
        color: grey;
        font-size: 0.9em;
        cursor: text;
        transition: 0.3s ease;
    }

    label .input:placeholder-shown + span {
        top: 15px;
        font-size: 0.9em;
    }

    label .input:focus + span,
    label .input:valid + span {
        top: 30px;
        font-size: 0.7em;
        font-weight: 600;
    }

    label .input:valid + span {
        color: #149d80;
    }
`;
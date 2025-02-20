import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { translations } from '../../translations/translations.js';

export function LoginAndSecurity() {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [editField, setEditField] = useState(null);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handlePasswordUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            if (!token || !email) {
                setError('User not authenticated');
                return;
            }

            await axios.put(`http://localhost:8000/api/users/email/${email}`, passwordData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });

            setEditField(null);
            setError(null);
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
            console.error(err);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');

            if (!token || !email) {
                setError('User not authenticated');
                return;
            }

            await axios.delete(`http://localhost:8000/api/users/email/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('email');
            navigate('/login');
        } catch (err) {
            setError('Failed to delete settings');
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
                <span>{translations.security.title[language]}</span>
            </div>

            <h1 className="text-3xl font-semibold mb-8">{translations.security.title[language]}</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <StyledForm>
                {/* Password Section */}
                <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 min-w-[200px]">
                            {translations.security.password[language]}
                        </span>
                        {editField !== 'password' ? (
                            <button
                                onClick={() => setEditField('password')}
                                className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                            >
                                {translations.personalInfo.edit[language]}
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={handlePasswordUpdate}
                                    className="text-[#149d80] text-sm font-semibold hover:text-[#0f7a63]"
                                >
                                    {translations.personalInfo.save[language]}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditField(null);
                                        setPasswordData({
                                            current_password: '',
                                            password: '',
                                            password_confirmation: ''
                                        });
                                    }}
                                    className="text-gray-600 text-sm font-semibold hover:text-gray-800"
                                >
                                    {translations.personalInfo.cancel[language]}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {editField === 'password' ? (
                            <>
                                <label className="flex-1">
                                    <input
                                        type="password"
                                        name="current_password"
                                        value={passwordData.current_password}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                    <span>{translations.security.currentPassword[language]}</span>
                                </label>
                                <label className="flex-1">
                                    <input
                                        type="password"
                                        name="password"
                                        value={passwordData.password}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                    <span>{translations.security.newPassword[language]}</span>
                                </label>
                                <label className="flex-1">
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={passwordData.password_confirmation}
                                        onChange={handleInputChange}
                                        className="input"
                                        required
                                    />
                                    <span>{translations.security.confirmNewPassword[language]}</span>
                                </label>
                            </>
                        ) : (
                            <div className="flex-1">
                                <p className="text-gray-600">********</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Account Section */}
                <div className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 min-w-[200px]">
                            {translations.security.deleteAccount[language]}
                        </span>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-red-500 text-sm font-semibold hover:text-red-700"
                            >
                                {translations.security.delete[language]}
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="text-red-500 text-sm font-semibold hover:text-red-700"
                                >
                                    {translations.security.confirm[language]}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="text-gray-600 text-sm font-semibold hover:text-gray-800"
                                >
                                    {translations.personalInfo.cancel[language]}
                                </button>
                            </div>
                        )}
                    </div>
                    {showDeleteConfirm && (
                        <div className="mt-4">
                            <p className="text-red-500">
                                {translations.security.warning[language]}
                            </p>
                        </div>
                    )}
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
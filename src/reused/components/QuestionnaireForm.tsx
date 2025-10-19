'use client';

import {useState, ChangeEvent, FormEvent, JSX, useEffect} from 'react';
import { QuestionnaireFormData, QuestionnaireErrors, SubmitStatus } from '../types/questionnaire.type';
import {sendToTelegram} from "@/api/send-to-tg";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function QuestionnaireForm() {
    const [formData, setFormData] = useState<QuestionnaireFormData>({
        fio: '',
        presence: '',
        secondDay: '',
        children: '',
        wishes: ''
    });

    const [errors, setErrors] = useState<QuestionnaireErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('');
    const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState<boolean>(false);

    // Загрузка reCAPTCHA
    useEffect(() => {
        const loadRecaptcha = () => {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setIsRecaptchaLoaded(true);
            };
            document.head.appendChild(script);
        };

        if (!window.grecaptcha) {
            loadRecaptcha();
        } else {
            setIsRecaptchaLoaded(true);
        }
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof QuestionnaireErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: QuestionnaireErrors = {};

        if (!formData.fio.trim()) newErrors.fio = 'ФИО обязательно';
        if (!formData.presence) newErrors.presence = 'Ответьте на вопрос';
        if (!formData.secondDay) newErrors.secondDay = 'Ответьте на вопрос';
        if (!formData.children) newErrors.children = 'Ответьте на вопрос';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const executeRecaptcha = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!window.grecaptcha) {
                reject(new Error('reCAPTCHA not loaded'));
                return;
            }

            window.grecaptcha.ready(async () => {
                try {
                    const token = await window.grecaptcha.execute(
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                        { action: 'questionnaire_submit' }
                    );
                    resolve(token);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitStatus('error');
            return;
        }

        if (!isRecaptchaLoaded) {
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('');

        try {
            // Получаем токен reCAPTCHA
            const recaptchaToken = await executeRecaptcha();

            // Отправляем данные вместе с токеном
            const result = await sendToTelegram({
                ...formData,
                recaptchaToken
            });

            if (result.success) {
                setSubmitStatus('success');
                setFormData({
                    fio: '',
                    presence: '',
                    secondDay: '',
                    children: '',
                    wishes: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAnswerText = (question: string, value: string): string => {
        const answers: Record<string, Record<string, string>> = {
            presence: {
                'yes': 'Да, с большим удовольствием!',
                'no': 'К сожалению, не смогу быть.'
            },
            secondDay: {
                'yes-definitely': 'Да, обязательно!',
                'no': 'Нет, к сожалению, не получится'
            },
            children: {
                'no-children': 'Нет, без детей',
                'with-children': 'Да, будем вместе с ребенком'
            }
        };

        return answers[question]?.[value] || value;
    };

    const renderRadioGroup = (
        name: keyof QuestionnaireFormData,
        question: string,
        options: string[],
        error?: string
    ): JSX.Element => (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                {question} *
            </label>
            {options.map((value) => (
                <label key={value} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        checked={formData[name] === value}
                        onChange={handleInputChange}
                        className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{getAnswerText(name, value)}</span>
                </label>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Опрос</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        ФИО *
                    </label>
                    <input
                        type="text"
                        name="fio"
                        value={formData.fio}
                        onChange={handleInputChange}
                        placeholder="ФИО"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.fio ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.fio && <p className="text-red-500 text-sm">{errors.fio}</p>}
                </div>

                {renderRadioGroup(
                    'presence',
                    'Подтвердите, пожалуйста, свое присутствие',
                    ['yes', 'no'],
                    errors.presence
                )}

                {renderRadioGroup(
                    'secondDay',
                    'Будете ли вы на втором дне?',
                    ['yes-definitely', 'no'],
                    errors.secondDay
                )}

                {renderRadioGroup(
                    'children',
                    'Будет ли с Вами ребенок/дети?',
                    ['no-children', 'with-children'],
                    errors.children
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Ваши пожелания и идеи для нашего праздника
                        <span className="text-gray-500 text-sm ml-1">(необязательно)</span>
                    </label>
                    <input
                        type="text"
                        name="wishes"
                        value={formData.wishes}
                        onChange={handleInputChange}
                        placeholder="Ваши пожелания и идеи..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isRecaptchaLoaded}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить ответы'}
                    </button>

                    {submitStatus === 'error' && (
                        <p className="text-red-500 text-sm text-center">
                            {!isRecaptchaLoaded ? 'Загрузка защиты...' : 'Ответьте на все обязательные вопросы'}
                        </p>
                    )}

                    {submitStatus === 'success' && (
                        <p className="text-green-500 text-sm text-center">
                            Ответы успешно отправлены!
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
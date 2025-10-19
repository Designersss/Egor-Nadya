'use server';

interface TelegramResponse {
    ok: boolean;
    result?: never;
    description?: string;
}

interface RecaptchaResponse {
    success: boolean;
    score?: number;
    action?: string;
}

export async function sendToTelegram(formData: {
    fio: string;
    presence: string;
    secondDay: string;
    children: string;
    wishes: string;
    recaptchaToken: string;
}) {
    const { fio, presence, secondDay, children, wishes, recaptchaToken } = formData;

    // Валидация reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

    if (!recaptchaSecret) {
        return { success: false, error: 'Server configuration error' };
    }

    try {
        // Проверка reCAPTCHA
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
        });

        const recaptchaData: RecaptchaResponse = await recaptchaResponse.json();

        if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
            return { success: false, error: 'reCAPTCHA verification failed' };
        }
    } catch (error) {
        return { success: false, error: 'reCAPTCHA verification error' };
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return { success: false, error: 'Server configuration error' };
    }

    const message = `
🎉 *Новый ответ на опрос!*

👤 *ФИО:* ${fio}

✅ *Присутствие:* ${getPresenceText(presence)}
📅 *Второй день:* ${getSecondDayText(secondDay)}
👶 *Дети:* ${getChildrenText(children)}
💭 *Пожелания:* ${wishes || 'Не указано'}
  `.trim();

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            }
        );

        const data: TelegramResponse = await response.json();

        if (data.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.description };
        }
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

function getPresenceText(value: string): string {
    const map: Record<string, string> = {
        'yes': 'Да, с большим удовольствием!',
        'no': 'К сожалению, не смогу быть.'
    };
    return map[value] || value;
}

function getSecondDayText(value: string): string {
    const map: Record<string, string> = {
        'yes-definitely': 'Да, обязательно!',
        'no': 'Нет, к сожалению, не получится'
    };
    return map[value] || value;
}

function getChildrenText(value: string): string {
    const map: Record<string, string> = {
        'no-children': 'Нет, без детей',
        'with-children': 'Да, будем вместе с ребенком'
    };
    return map[value] || value;
}
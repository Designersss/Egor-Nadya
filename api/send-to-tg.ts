'use server';

interface TelegramResponse {
    ok: boolean;
    result?: never;
    description?: string;
}

export async function sendToTelegram(formData: {
    fio: string;
    presence: string;
    companion: string;
    secondDay: string;
    children: string;
    wishes: string;
}) {
    const { fio, presence, companion, secondDay, children, wishes } = formData;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return { success: false, error: 'Server configuration error' };
    }

    const message = `
🎉 *Новый ответ на опрос!*

👤 *ФИО:* ${fio}

✅ *Присутствие:* ${getPresenceText(presence)}
👥 *Сопровождение:* ${getCompanionText(companion)}
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
        'no': 'К сожалению, не смогу быть.',
        'unsure': 'Пока не уверен(а), уточню позже'
    };
    return map[value] || value;
}

function getCompanionText(value: string): string {
    const map: Record<string, string> = {
        'alone': 'Я буду один/одна',
        'couple': 'Мы будем вдвоем (я + мой партнер/спутник)',
        'unsure-companion': 'Затрудняюсь ответить пока'
    };
    return map[value] || value;
}

function getSecondDayText(value: string): string {
    const map: Record<string, string> = {
        'yes-definitely': 'Да, обязательно!',
        'probably-yes': 'Скорее да, чем нет',
        'unsure-mood': 'Еще не знаю, посмотрим по настроению',
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
'use client';

import { useState, useEffect } from 'react';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateCountdown = () => {
            const targetDate = new Date('2026-04-24T00:00:00').getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft('00:00:00:00:00');
                return;
            }

            const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
            const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const format = (num: number) => num.toString().padStart(2, '0');

            setTimeLeft(`${format(weeks)}:${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`);
        };

        const timer = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call

        return () => clearInterval(timer);
    }, []);

    const parts = timeLeft.split(':');
    const labels = ['Недель', 'Дней', 'Часов', 'Минут', 'Секунд'];

    return (
        <div className="flex justify-between mt-[80px]">
            {parts.map((part, index) => (
                <div key={labels[index]} className="text-center">
                    <div className="text-[50px] font-bold max-md:text-[24px]">
                        {part}
                    </div>
                    <div className="text-[20px] -mt-2 text-gray-600 max-md:text-[16px]">
                        {labels[index]}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Countdown;
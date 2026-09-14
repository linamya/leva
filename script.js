document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rsvpForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Предотвращаем стандартную перезагрузку страницы

        // Находим кнопку отправки, чтобы временно заблокировать её во время отправки
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        // Собираем данные из формы
        const fullname = document.getElementById('fullname').value.trim();
        const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
        const attendance = selectedAttendance ? selectedAttendance.value : '';

        // Формируем красивый текст сообщения для ВК бота
        const messageText = `💌 Новая анкета с сайта!\n\n👤 Имя: ${fullname}\n✨ Ответ: ${attendance}`;

        // URL вашего Cloudflare Worker (замените на ваш актуальный адрес Worker)
        const WORKER_URL = 'https://vkpolya.awsjfe.workers.dev/'; 

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: messageText })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert(`Спасибо, ${fullname}! Ваш ответ успешно отправлен.`);
                form.reset();
            } else {
                throw new Error(result.error || 'Ошибка сервера');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
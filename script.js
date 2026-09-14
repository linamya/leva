document.addEventListener('DOMContentLoaded', () => {
    // Логика заставки и музыки
    const welcomeScreen = document.getElementById('welcomeScreen');
    const bgMusic = document.getElementById('bgMusic');

    if (welcomeScreen && bgMusic) {
        welcomeScreen.addEventListener('click', () => {
            // Включаем музыку
            bgMusic.play().catch(error => {
                console.log("Автовоспроизведение заблокировано браузером:", error);
            });

            // Скрываем заставку с картинкой 12.png
            welcomeScreen.classList.add('hidden');
        });
    }

    // Логика отправки анкеты
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            const fullname = document.getElementById('fullname').value.trim();
            const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
            const attendance = selectedAttendance ? selectedAttendance.value : '';

            const messageText = `💌 Новая анкета с сайта!\n\n👤 Имя: ${fullname}\n✨ Ответ: ${attendance}`;
            const WORKER_URL = 'https://vkpolya.awsjfe.workers.dev/'; 

            try {
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});

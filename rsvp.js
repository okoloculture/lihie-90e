document.addEventListener('alpine:init', () => {
    Alpine.data('rsvp', () => ({
        // поля формы
        name: '',
        status: '',
        company: 'Один',
        guest: '',
        song: '',
        wish: '',
        // состояние
        sent: false,
        sending: false,
        error: false,
        count: null,

        init() {
            this.fetchCount();
        },

        async fetchCount() {
            if (!window.RSVP_ENDPOINT) {
                return;
            }
            try {
                const res = await fetch(`${window.RSVP_ENDPOINT}?action=count`);
                const data = await res.json();
                if (typeof data.count === 'number') {
                    this.count = data.count;
                }
            } catch (err) {
                // молча — счётчик просто не покажется
            }
        },

        async submit() {
            // без настроенного бэкенда просто показываем окно (локальный тест)
            if (!window.RSVP_ENDPOINT) {
                this.sent = true;
                return;
            }

            this.sending = true;
            this.error = false;

            const payload = {
                name: this.name,
                status: this.status,
                company: this.company,
                guest: this.guest,
                song: this.song,
                wish: this.wish,
            };

            try {
                const res = await fetch(window.RSVP_ENDPOINT, {
                    method: 'POST',
                    // text/plain, чтобы браузер не слал preflight (Apps Script его не любит)
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (typeof data.count === 'number') {
                    this.count = data.count;
                }
            } catch (err) {
                this.error = true;
            } finally {
                this.sending = false;
                this.sent = true;
            }
        },

        reset() {
            this.sent = false;
            this.error = false;
            this.name = '';
            this.status = '';
            this.company = 'Один';
            this.guest = '';
            this.song = '';
            this.wish = '';
        },
    }));
});

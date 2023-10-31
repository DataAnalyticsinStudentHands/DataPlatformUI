import { toast } from 'vue3-toastify';

export default {
    methods: {
        handleError(error) {
            console.log(error);
            toast.error("An unexpected error has occurred and has been logged for future improvement. Please try again later.", {
                position: 'top-right',
                toastClassName: 'Toastify__toast--error'
            });
        }
    }
}
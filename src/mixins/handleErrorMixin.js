import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    methods: {
        handleError(error) {
            console.error(error);
            toast.error("An unexpected error has occurred and has been logged for future improvement. Please try again later.", {
                position: 'top-right',
                toastClassName: 'Toastify__toast--delete',
                limit: 1,
            });
        }
    }
}
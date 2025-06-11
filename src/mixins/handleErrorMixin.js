/**
 * src/mixins/handleErrorMixin.js
 * 
 * Vue mixin providing standardized error handling across components. Displays user-friendly
 * error messages via toast notifications while logging detailed error information to the
 * console for debugging purposes.
 */

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    methods: {
        // Display error toast and log error details to console
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
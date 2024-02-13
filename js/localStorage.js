const STORAGE_KEY = 'SOOTHE';
export default {
    get() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    },

    set(userProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    }
}
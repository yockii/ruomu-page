import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
    state: (): {
        theme: string;
    } => ({
        theme: "",
    }),
    getters: {},
    actions: {
        setTheme(theme: string) {
            this.theme = theme;
        },
    },
    persist: true,
});

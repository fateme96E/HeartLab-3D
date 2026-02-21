import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.DEPLOY_ENV === 'GH_PAGES' ? '/HeartLab-3D/' : '/',
});
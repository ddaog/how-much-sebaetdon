import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
    appName: 'sebaetdon-survey',
    brand: {
        displayName: '세뱃돈 메이커',
        primaryColor: '#3182F6',
        icon: '', // TODO: Add icon URL if available
    },
    web: {
        host: '192.168.35.217',
        port: 5173,
        commands: {
            dev: 'vite',
            build: 'vite build',
        },
    },
    permissions: [],
});

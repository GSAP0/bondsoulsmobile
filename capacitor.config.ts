import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.bondsouls.app',
    appName: 'BondSouls',
    webDir: 'dist',
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
        Keyboard: {
            resize: 'body',  // ή 'ionic' ή 'native'
            style: 'dark',
            resizeOnFullScreen: true
        }
    },
};

export default config;

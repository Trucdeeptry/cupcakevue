import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/material' //PrimeVue
import 'primeicons/primeicons.css'; // Import PrimeIcons
export default (vuejs) => {
    vuejs.use(PrimeVue, {
        theme:{
            preset: Aura,
        },
        
    })
}
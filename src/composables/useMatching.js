import {ref} from "vue";

const match = ref(null)
export function useMatching(){

    async function load(){
        const res = await axios.get('/match')
        match.value = Object.hasOwn(res.data, 'id') ? res.data : null
    }

    async function finishMatching(){
        await axios.post('/match/finish')
    }
    async function feedbackMatching(){}

    return {
        match,

        load,
        finishMatching,
        feedbackMatching
    }
}
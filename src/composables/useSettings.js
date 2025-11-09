import {computed, onMounted, reactive, ref} from "vue";

const settings = reactive({
    match_state: null
})

export function useSettings() {
    async function load(){
        const res = await axios.get('/settings')
        settings.match_state = res.data.match_state
    }

    return {
        settings,
        load
    }
}
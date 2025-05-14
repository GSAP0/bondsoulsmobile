import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";

export const useGlobalStore = defineStore('global-store', () => {
    const router = useRouter()

    const user = ref(null)
    const loaded = ref(false)
    const questions = ref([])
    const answers = ref([])

    const total_answered = computed(() => {
        let ret = {}
        answers.value.forEach(ans => {
            ret[ans.question_id] = ans
        })

        return Object.keys(ret).length
    })

    const questions_required = computed(() => {
        return questions.value
            .filter(item => item.required)
    })

    const questions_unanswered = computed(() => {
        const question_ids = answers.value.map(item => item.question_id)
        return questions.value
            .filter(item => !question_ids.includes(item.uuid))
    })

    const questions_unanswered_required = computed(() => {
        return questions_unanswered.value
            .filter(item => item.required)
    })

    async function loadQuestions(){
        const res = await axios.get('questions')
        questions.value = res.data
    }

    async function loadAnswers(){
        const res = await axios.get('answers')
        answers.value = res.data
    }

    async function load(){
        await Promise.all([
            loadQuestions(),
            loadAnswers()
        ])
        loaded.value = true
        if(questions_unanswered_required.value.length > 0) await router.replace(`/questions?required`)
    }

    function logout(){
        localStorage.removeItem('user')
        user.value = null
        window.location = ``
    }

    return {
        answers,
        total_answered,
        loaded,
        user,
        questions,
        questions_required,
        questions_unanswered,
        questions_unanswered_required,

        loadAnswers,
        loadQuestions,
        load,
    }
})
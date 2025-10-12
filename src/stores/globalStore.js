import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useLocalStorage} from "@vueuse/core";

export const useGlobalStore = defineStore('global-store', () => {
    const router = useRouter()


    const user = ref(null)
    const loaded = ref(false)
    const questions = ref([])
    const answers = ref([])
    const interests = ref([])
    const faq = ref([])
    const currentTheme = useLocalStorage('theme', 'light')
    const themeClass = computed(() => (currentTheme.value === 'light' ? 'theme-light' : 'theme-dark'));

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

    async function loadQuestions() {
        const res = await axios.get('questions')
        questions.value = res.data
    }

    async function loadAnswers() {
        const res = await axios.get('answers')
        answers.value = res.data
    }

    async function loadInterests() {
        const res = await axios.get('interests')
        interests.value = res.data
    }

    async function loadUser() {
        const res = await axios.get('user')
        user.value = res.data
    }

    async function loadFaq(){
        const res = await axios.get('faq')
        faq.value = res.data
    }

    async function load() {
        await Promise.all([
            loadQuestions(),
            loadAnswers(),
            loadInterests(),
            loadFaq()
        ])

        window.echo.private('App.Models.MobileUser').notification((notification) => {
            user.value.notifications.push(notification)
            console.log(notification)
        })

        loaded.value = true
        if (questions_unanswered_required.value.length > 0) await router.replace(`/questions?required`)
    }

    function logout() {
        localStorage.removeItem('user')
        user.value = null
        window.location = ``
    }

    async function submitReferralCode(referralCodeInput) {
        if (!referralCodeInput) return

        const response = await axios.post('/referral/verify', {
            referral_code: referralCodeInput
        })

        return response.data
    }

    return {
        answers,
        total_answered,
        loaded,
        user,
        faq,
        interests,
        questions,
        questions_required,
        questions_unanswered,
        questions_unanswered_required,
        currentTheme,
        themeClass,

        submitReferralCode,
        logout,
        loadAnswers,
        loadQuestions,
        loadInterests,
        loadUser,
        load,
    }
})
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import moment from "moment";
import {chatbubbleEllipsesOutline, shieldCheckmarkOutline, sparklesOutline, trophyOutline} from "ionicons/icons";
import {toastController} from "@ionic/vue";

// Initialize user from localStorage
const storedUser = localStorage.getItem('user')
const initialUser = storedUser ? JSON.parse(storedUser) : null

// Shared state (singleton pattern)
const needsRefresh = ref(false)
const user = ref(initialUser)
const loaded = ref(false)
const questions = ref([])
const answers = ref([])
const interests = ref([])
const faq = ref([])
const currentTheme = useLocalStorage('theme', 'light')

// Compute baseUrl lazily to avoid accessing window.axios before it's defined
const baseUrl = computed(() => {
    if (window.axios?.defaults?.baseURL) {
        return window.axios.defaults.baseURL.replace("mobile", "")
    }
    return ''
})

export function useGlobal() {
    const router = useRouter()

    const themeClass = computed(() => (currentTheme.value === 'light' ? 'theme-light' : 'theme-dark'));
    const logo = computed(() => currentTheme.value === 'dark' ? baseUrl + 'assets/logobondWhite.png' : baseUrl + 'assets/logobond.png')

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

    const userPhoto = computed(() => {
        if (!user.value) return logo.value?.toString() || ''
        return user.value.image?.toString() ?? logo.value?.toString() ?? ''
    })

    const userRating = computed(() => {
        if (!user.value) return 5
        return user.value.rating || 5
    })

    const userAge = computed(() => {
        if (!user.value?.birthdate) return '-'
        const birthDate = moment(user.value.birthdate)
        return moment().diff(birthDate, 'years')
    })

    const tesPercentage = computed(() => {
        const total = questions.value.length
        const answered = total_answered.value
        if (total === 0) return 0

        return Math.round((answered / total) * 100)
    })

    const displayBadges = computed(() => {
        if (!user.value) return []

        const badges = [
            {name: 'Active', active: total_answered.value > 0},
            {name: 'Verified', active: user.value?.verified || false},
            {name: 'Respected', active: total_answered.value > 20},
        ]
        const activeCount = badges.filter(b => b.active).length
        return badges.filter(b => b.active || activeCount < 2)
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
        localStorage.setItem('user', JSON.stringify(res.data))
    }

    async function loadFaq() {
        const res = await axios.get('faq')
        faq.value = res.data
    }

    async function showNotificationToast(notification) {
        const toast = await toastController.create({
            message: 'Έχετε μια νέα ειδοποίηση!',
            duration: 5000,
            position: 'top',
            color: 'primary',
            buttons: [
                {
                    text: 'Δείτε',
                    handler: () => {
                        router.push(`/notification?id=${notification.id}`)
                    }
                },
                {
                    text: 'Κλείσιμο',
                    role: 'cancel'
                }
            ]
        })
        await toast.present()
    }

    async function load() {
        await Promise.all([
            loadQuestions(),
            loadAnswers(),
            loadInterests(),
            loadFaq()
        ])

        if (window.echo && user.value?.uuid) {
            window.echo.private(`App.Models.MobileUser.${user.value.uuid}`)
                .notification((notification) => {
                if (user.value?.notifications) {
                    user.value.notifications.push(notification)
                }
                console.log(notification)
                showNotificationToast(notification)
            })
        }

        loaded.value = true
        if (questions_unanswered_required.value.length > 0) await router.replace(`/questions?required`)
    }

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        user.value = null
        window.location = `/`
    }

    async function submitReferralCode(referralCodeInput) {
        if (!referralCodeInput) return

        const response = await axios.post('/referral/verify', {
            referral_code: referralCodeInput
        })

        return response.data
    }

    function getBadgeIcon(name) {
        if (name === 'Active') return sparklesOutline
        if (name === 'Verified') return shieldCheckmarkOutline
        if (name === 'Respected') return trophyOutline
        return chatbubbleEllipsesOutline
    }

    return {
        needsRefresh,
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
        userPhoto,
        userRating,
        userAge,
        displayBadges,
        tesPercentage,
        logo,

        getBadgeIcon,
        submitReferralCode,
        logout,
        loadAnswers,
        loadQuestions,
        loadInterests,
        loadUser,
        load,
    }
}
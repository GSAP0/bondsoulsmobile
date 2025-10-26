import {ref} from "vue";

const x = ref('4')

export const useTest = () => {
    return {x}
}
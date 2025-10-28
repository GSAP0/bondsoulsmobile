import moment from "moment";

export function formatDate(date){
        if (!date) return ''
        return moment(date).format('DD/MM/YYYY')
}

export function formatDateTime(date){
        if (!date) return ''
        return moment(date).format('DD/MM/YYYY HH:mm')
}
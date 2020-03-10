import { delayedApiAxios, setFeedbackData } from '@utils'

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const handleSubscribtion = async (url, serviceWorker) => {
    try {
        const { pushManager } = await serviceWorker.ready
        if (!pushManager) {
            return setFeedbackData(
                'Twoja przeglądarka nie wspiera powiadomień! Nie będziesz otrzymywał powiadomień z aktualnymi dzwonkami w szkole!',
                'Ok'
            )
        }
        const subscription = await pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)
        })
        await delayedApiAxios.post(url, subscription)
    } catch (error) {
        setFeedbackData('Wystąpił niespodziewany problem przy zezwalaniu na powiadomienia!', 'Ok')
    }
}

export default async url => {
    try {
        const { serviceWorker, permissions } = navigator
        if (!serviceWorker || !permissions) {
            return setFeedbackData(
                'Twoja przeglądarka nie wspiera powiadomień! Nie będziesz otrzymywał powiadomień z aktualnymi dzwonkami w szkole!',
                'Ok'
            )
        }
        const { state } = await permissions.query({ name: 'push', userVisibleOnly: true })
        switch (state) {
            case 'granted':
                handleSubscribtion(url, serviceWorker)
                break
            case 'prompt':
                setFeedbackData(
                    'Aplikacja wymaga zgody na wyświetlanie powiadomień!',
                    'Udostępnij',
                    () => handleSubscribtion(url, serviceWorker)
                )
                break
            default:
                setFeedbackData(
                    'Aplikacja wymaga zgody na wyświetlanie powiadomień! Udostępnij ją w ustawieniach przeglądarki!'
                )
        }
    } catch (error) {
        setFeedbackData('Wystąpił niespodziewany problem przy zezwalaniu na powiadomienia!', 'Ok')
    }
}

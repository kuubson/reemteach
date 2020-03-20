self.addEventListener('push', event => {
    const { title, body, image, icon, data } = event.data.json()
    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            image,
            icon,
            data
        })
    )
})

self.addEventListener('notificationclick', ({ notification }) => {
    notification.close()
    clients.openWindow(notification.data.url)
})

self.addEventListener('push', event => {
    const { title, body, image, icon } = event.data.json()
    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            image,
            icon
        })
    )
})

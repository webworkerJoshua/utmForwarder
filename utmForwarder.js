export default class utmForwarder {

    constructor(expireDays = 30) {

        this.expireDays = expireDays

        this.current = {}

        this.storage = {
            area: window.localStorage,
            key: 'latest_utm_query'
        }

        this.restored = {}

        this.initiateCurrentState()
        this.checkCurrentForNewParams()
        this.updateExternalLinks()
    }

    initiateCurrentState() {
        this.current = {
            state: document.location.href,
            query: document.location.search.substring(1),
            time: new Date().getTime()
        }
    }

    checkCurrentForNewParams() {
        if (/(^|&)utm_/.test(this.current.query)) {
            this.updateStorage()
        } else {
            this.restoreFromStorage();
        }

    }

    updateStorage() {
        this.storage.area[this.storage.key] = JSON.stringify({
            time: this.current.time,
            query: this.current.query
        })
    }

    restoreFromStorage() {
        this.restored = JSON.parse(this.storage.area[this.storage.key] || '""')

        if (this.restored && this.current.time - this.restored.time <= this.expireDays * 864E5) {
            let newState = document.createElement("a")
            newState.href = this.current.state
            newState.search += (newState.search ? '&' : '') + this.restored.query
            history.replaceState(null, '', newState.toString())
            this.initiateCurrentState()
        }
    }

    updateExternalLinks() {
        if (this.current.query) {
            document.querySelectorAll("a[target='_blank']").forEach((link) => {
                link.search += (link.search ? '&' : '') + this.current.query
            })
        }

    }

}

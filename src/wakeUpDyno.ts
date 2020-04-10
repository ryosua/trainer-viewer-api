import fetch from 'node-fetch'

const wakeUpDyno = (url: string, interval = 25, callback = () => {}) => {
    const milliseconds = interval * 60000
    setTimeout(() => {
        try {
            console.log(`waking up dyno`)
            // HTTP GET request to the dyno's url
            fetch(url).then(() => console.log(`Fetching ${url}.`))
        } catch (e) {
            // catch fetch errors
            console.log(`Error fetching ${url}: ${e.message} 
            Will try again in ${interval} minutes...`)
        } finally {
            try {
                callback()
            } catch (e) {
                callback ? console.log('Callback failed: ', e.message) : null
            } finally {
                return wakeUpDyno(url, interval, callback)
            }
        }
    }, milliseconds)
}

export default wakeUpDyno

const map = ({ id, title, start_time, link }) => ({
    id,
    title,
    startTime: new Date(start_time).toISOString(),
    link
})

module.exports = map

const map = ({ id, title, required_equipment, start_time, link }) => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link
})

module.exports = map

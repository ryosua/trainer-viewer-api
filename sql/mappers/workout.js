const map = ({ id, title, required_equipment, start_time, link, duration }, workoutCategories) => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter((workoutCategory) => workoutCategory.workoutId === id),
    duration
})

module.exports = map

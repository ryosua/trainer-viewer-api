const map = ({ id, title, required_equipment, start_time, link }, workoutCategories) => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter(workoutCategory => workoutCategory.workoutId === id)
})

module.exports = map

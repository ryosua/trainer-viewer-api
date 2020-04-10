const map = ({ id, title, required_equipment, start_time, link, duration }: any, workoutCategories: any) => ({
    id,
    title,
    requiredEquipment: required_equipment || '',
    startTime: new Date(start_time).toISOString(),
    link,
    categories: workoutCategories.filter((workoutCategory: any) => workoutCategory.workoutId === id),
    duration
})

export default map

const intersection = require('lodash/intersection')

const getWorkoutCategories = require('../../../db/read/getWorkoutCategories')
const authenticate = require('./authenticate')

const validateAddWorkout = async (args: any, context: any) => {
    await authenticate(context)
    const { categories, duration } = args

    const durationDivisbleBy10 = duration % 10 === 0
    if (!durationDivisbleBy10) {
        throw new Error('The duration must be increments of 10 minutes')
    }

    const minDuration = 20
    const maxDuration = 90
    const durationInRange = duration >= minDuration && duration <= maxDuration
    if (!durationInRange) {
        throw new Error(`You must select a duration between ${minDuration} and ${maxDuration}.`)
    }

    if (categories.length <= 0 || categories.length > 2) {
        throw new Error('You must select at least one category and most two categories.')
    }

    // Validate that the workout categories are in the database.
    const allWorkoutCategories = await getWorkoutCategories()
    const allWorkoutCategoriesIds = allWorkoutCategories.map((workoutCategory: any) => Number(workoutCategory.id))
    const validCategories = intersection(categories, allWorkoutCategoriesIds)
    if (categories.length !== validCategories.length) {
        throw new Error('Invalid workout category.')
    }

    return validCategories
}

export default validateAddWorkout

import { QueryTypes } from 'sequelize'

import orm from '../../orm'

const getWorkoutInsertString = (workoutCategories: any) =>
    workoutCategories.reduce(
        (accumulator: Function, workoutCategoryId: any, index: Number) =>
            accumulator + `(:workout_id, ${workoutCategoryId})${index === workoutCategories.length - 1 ? '' : ','}`,
        ''
    )

const associateWorkoutCategoriesWithWorkout: any = async (workoutId: any, workoutCategories: any) => {
    await orm.query(
        `INSERT INTO workout_workout_category (workout_id, workout_category_id) VALUES ${getWorkoutInsertString(
            workoutCategories
        )}`,
        {
            replacements: { workout_id: workoutId },
            type: QueryTypes.INSERT
        }
    )
}

module.exports = associateWorkoutCategoriesWithWorkout

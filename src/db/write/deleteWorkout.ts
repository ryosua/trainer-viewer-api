import orm from '../../orm'
import { QueryTypes } from 'sequelize'

const deleteWorkout = async (workoutId: number): Promise<void> =>
    await orm.query(`DELETE FROM workout WHERE id = :id`, {
        replacements: {
            id: workoutId
        },
        type: QueryTypes.DELETE
    })

export default deleteWorkout

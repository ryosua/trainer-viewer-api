import orm from '../../orm'
import { QueryTypes } from 'sequelize'

import Workout from '../../graphql/types/Workout'
import User from '../../graphql/types/User'
import mapReportedWorkout from '../mappers/reportedWorkout'
import ReportedWorkout from '../../graphql/types/ReportedWorkout'

const addReportedWorkout = async (workout: Workout, reporter: User, reason: string): Promise<ReportedWorkout> => {
    const [[reportedWorkoutRecord]]: any = await orm.query(
        `INSERT INTO reported_workout (reporter_id, workout_id, reason) VALUES (:reporter_id, :workout_id, :reason) RETURNING id, reason`,
        {
            replacements: { reporter_id: reporter.id, workout_id: workout.id, reason },
            type: QueryTypes.INSERT
        }
    )

    const reportedWorkout = mapReportedWorkout(reportedWorkoutRecord, workout, reporter)
    return reportedWorkout
}

export default addReportedWorkout

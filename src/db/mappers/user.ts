import UserRecord from '../types/UserRecord'
import User from '../../graphql/types/User'

const map = (userRecord: UserRecord): User => userRecord

export default map

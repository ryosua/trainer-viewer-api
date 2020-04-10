import UserRecord from '../types/UserRecord'
import User from '../../graphql/types/User'

const map = ({ id }: UserRecord): User => ({
    id
})

export default map

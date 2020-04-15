import UserRecord from '../types/UserRecord'
import User from '../../graphql/types/User'

const map = ({ id, date_user_agreement_signed }: UserRecord): User => ({
    id,
    dateUserAgreementSigned: date_user_agreement_signed
})

export default map

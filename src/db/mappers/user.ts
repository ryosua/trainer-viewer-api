import UserRecord from '../types/UserRecord'
import { User } from '../../shared'

const map = ({ id, date_user_agreement_signed }: UserRecord): User => ({
    id,
    dateUserAgreementSigned: date_user_agreement_signed
})

export default map

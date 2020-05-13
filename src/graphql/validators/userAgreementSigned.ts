import { User } from '../../shared'

const userAgreementSigned = (user: User) => {
    const userAgreementIsSigned = Boolean(user.dateUserAgreementSigned)
    if (!userAgreementIsSigned) {
        throw new Error('You must sign the user agreement to perform this action.')
    }
}

export default userAgreementSigned

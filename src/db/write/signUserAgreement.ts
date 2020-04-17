import orm from '../../orm'
import { QueryTypes } from 'sequelize'

import User from '../../graphql/types/User'
import mapUser from '../../db/mappers/user'

const signUserAgreement = async (signer: User) => {
    const [[userRecord]]: any = await orm.query(
        `UPDATE person  
        SET date_user_agreement_signed = NOW() 
        WHERE id = :id RETURNING id, date_user_agreement_signed;`,
        {
            replacements: { id: signer.id },
            type: QueryTypes.UPDATE
        }
    )

    const user = mapUser(userRecord)
    return user
}

export default signUserAgreement

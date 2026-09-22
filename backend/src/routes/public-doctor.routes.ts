import {
  Router,
} from 'express'

import {
  getDoctors,
} from '../services/doctor.service.js'

const publicDoctorRouter =
  Router()

publicDoctorRouter.get(
  '/',
  async (_req, res, next) => {
    try {
      const result =
        await getDoctors({
          page: 1,
          limit: 100,
          ativo: true,
        })

      const data =
        result.data.map(
          (doctor) => ({
            id:
              doctor.id,

            nomeCompleto:
              doctor.nomeCompleto,

            crmNumero:
              doctor.crmNumero,

            crmUf:
              doctor.crmUf,

            especialidades:
              doctor.especialidades
                .filter(
                  (specialty) =>
                    specialty.ativo,
                )
                .map(
                  (specialty) => ({
                    id:
                      specialty.id,

                    nome:
                      specialty.nome,

                    principal:
                      specialty.principal,
                  }),
                ),
          }),
        )

      return res
        .status(200)
        .json({
          status: 'ok',

          data,

          pagination:
            result.pagination,
        })
    } catch (error) {
      next(error)
    }
  },
)

export default publicDoctorRouter
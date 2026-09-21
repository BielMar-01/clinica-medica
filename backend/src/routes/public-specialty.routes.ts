import {
  Router,
} from 'express'

import {
  getSpecialties,
} from '../services/specialty.service.js'

const publicSpecialtyRouter =
  Router()

publicSpecialtyRouter.get(
  '/',
  async (_req, res, next) => {
    try {
      const result =
        await getSpecialties({
          page: 1,
          limit: 100,
          ativo: true,
        })

      res.status(200).json({
        status: 'ok',
        data: result.data,
        pagination:
          result.pagination,
      })
    } catch (error) {
      next(error)
    }
  },
)

export default publicSpecialtyRouter
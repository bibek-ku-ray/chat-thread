import { Router } from 'express'
import { listCategories } from '../modules/threads/thread.repository'

export const threadsRouter = Router()

threadsRouter.get("/categories", async (_req, res, next) => {
  try {
    const listOfCategories = await listCategories()

    res.json({
      data: listOfCategories
    })

  } catch (error) {
    next(error)
  }
})
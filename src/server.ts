import express from 'express'
import cors from 'cors'
import properties from './api/properties.route'
import fileUpload from 'express-fileupload'

const app = express()

app.use(cors())
app.use(express.json())

app.use(
  fileUpload({
    limits: {
      fileSize: 1000000
    },
    abortOnLimit: true
  })
)
app.use(express.static('public'))
app.use('/images', express.static('images'))

app.use('/api/v1/properties', properties)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'not found' })
})

export default app

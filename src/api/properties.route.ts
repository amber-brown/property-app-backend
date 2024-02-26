import express, { type Request, type Response } from 'express'
import { type UploadedFile } from 'express-fileupload'
import path from 'node:path'

const router = express.Router()

/** TODO: schemas / types
 * As the app expands, I would export a types module from the api
 * This would allow them to be imported into the frontend to avoid duplication
 */
interface Property {
  id: string
  address: string
  price: number
  imageUri: string
}

/** TODO: make this a db
 * The data would go in a db, this could be a noSQL db
 * The images would go in a blob store such as S3
 * For a performance improvement the images would be saved in various sizes, the most appropriate sent in the request
*/
const properties: Property[] = [
  { id: '1', address: 'Brick Street, London, W1J', price: 35000000, imageUri: '/images/house_1.jpeg' },
  { id: '2', address: 'Avenue Road, NW8', price: 30000000, imageUri: '/images/house_2.jpeg' },
  { id: '3', address: 'Pitt Street, London', price: 27000000, imageUri: '/images/house_3.jpeg' },
  { id: '4', address: 'Hanover Terrace, Regents Park, London, NW1', price: 21300000, imageUri: '/images/house_4.jpeg' },
  { id: '5', address: 'Frognal, Hampstead, NW3', price: 19950000, imageUri: '/images/house_5.jpeg' }
]

/** TODO: authentication
 * There would be authentication on these endpoints
 */
router.route('/')
  .get((req: Request, res: Response) => {
    res.json(properties)
  })
  .post((req: Request, res: Response) => {
    /** TODO: add req body/image validation
     * This would use a validation schema such as yup or mongoose
     */
    const { body } = req
    const image = req?.files?.image as UploadedFile

    if (image == null) return res.sendStatus(400)

    const newIndex = (properties.length + 1).toString()
    const imageType = image.name.split('.').pop()
    const newImageName = `house_${newIndex}.${imageType}`

    image.mv(path.join(process.cwd(), `/public/images/${newImageName}`)).then(() => {
      properties.push({ id: newIndex, address: body.address, price: body.price, imageUri: `/images/${newImageName}` })
      res.json(properties)
    }).catch(e => {
      /** TODO: more sophisticated error handling
       * As the APIs expanded, a wrapper function would be good to handle common error / logging functionality
       */
      console.log('error posting property:', e)
      res.sendStatus(400)
    })
  })

export default router

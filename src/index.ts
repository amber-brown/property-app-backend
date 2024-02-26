import app from './server'

const main = async (): Promise<void> => {
  const port = '4000'

  try {
    app.listen(port, () => {
      console.log('server is running on port:' + port)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main().catch(console.error)

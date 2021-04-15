import path from 'path'
import moduleAlias from 'module-alias'

moduleAlias.addAlias('@database', path.resolve(__dirname, './database/database'))
moduleAlias.addAlias('@middlewares', path.resolve(__dirname, './middlewares'))
moduleAlias.addAlias('@routes', path.resolve(__dirname, './routes/routes'))
moduleAlias.addAlias('@utils', path.resolve(__dirname, './utils'))

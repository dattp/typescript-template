import express from "express";
// import bodyParser from 'body-parser'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import morgan from 'morgan'

// import { TodoRoute } from './routes/todo.route'
// import { TodoService } from './services/todo.service'
// import { TodoController } from './controllers/todo.controller'
// import ErrorMiddleware from './middlewares/error.middleware'

class App {
  public app: any;

  constructor() {
    this.app = express();
    const test = "123123";
    // this._setConfig()
    // this._initMiddlewaresError()
    // this._setMongoConfig()
    // this._loadRoute()
  }

  // private _setConfig() {
  //   this.app.use(bodyParser.json({ limit: '50mb' }))
  //   this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  //   this.app.use(morgan('dev'))
  //   dotenv.config({
  //     path: `${__dirname}/.env`
  //   })
  // }

  // private _loadRoute() {

  //   /**
  //    * init component
  //    */
  //   // init constructor service todo
  //   const todoService = new TodoService()
  //   // init constructor controller todo
  //   const todoController = new TodoController(todoService)
  //   // init constructor route
  //   new TodoRoute(this.app, todoController)
  // }

  // private _initMiddlewaresError() {
  //   this.app.use("/api", ErrorMiddleware.handleNotFound);
  // }

  // private _setMongoConfig() {
  //   mongoose.Promise = global.Promise
  //   mongoose.connect(process.env.MONGO_URI + '', {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true
  //   }).then(() => {
  //     console.log('connected to mongo');

  //   }).catch(error => console.log(error))
  // }
}

export default new App().app;

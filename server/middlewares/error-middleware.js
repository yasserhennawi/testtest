import IoC from 'server/IoC';
const PrettyError = require('pretty-error');

export class ErrorMiddleware {
  logErrors(err, req, res, next) {
    let pe = new PrettyError();
    console.log(req.originalUrl);
    console.log(pe.render(err));
    next(err);
  }

  response(err, req, res, next) {
    let error = {
      statusCode: 500,
      message: err.message || "Unknown error",
      type: "unknown",
    };
    if(process.env.NODE_ENV === "development"){
      error.baseError = err;
    }
    if(err  && err.toResponse) {
      error = err.toResponse();
    }
    res.writeHead(404);
    res.status(error.statusCode).send(error);
  }
}

IoC.singleton('errorMiddleware', [], ErrorMiddleware);

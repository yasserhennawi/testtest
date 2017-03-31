import IoC from 'server/IoC';
import * as Q from 'q';

export class BaseController {
  successResponse(res, result = null, spread = false) {
    if (spread) {
      result.statusCode = 200;
      res.json(result);
    } else if (result && result.result) {
      res.json({result: result.result || [], statusCode: 200});
    } else {
      res.json({result, statusCode: 200});
    }
  }
}

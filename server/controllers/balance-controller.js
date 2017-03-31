import IoC from 'server/IoC';
import { BaseController } from './base-controller';
var result = require('./result.json');

export class BalanceController extends BaseController {
  findByIban(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    var random = Math.random();
    if (random  >= 0.8) {
        res.writeHead(503);
        res.end();
    } else {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(JSON.stringify(result, 0, 4));
        res.end();
    }
  }
}

IoC.singleton('balanceController', [], BalanceController);

import { getCacheFn } from './helper';
import { interpilationExprRegex, filters } from './var';

export function evalTextNodeFilter(text, model) {
  return text.replace(interpilationExprRegex, function (m, e) {
    return execFilterExpr(e, model);
  });
}

export function evalExprFilter(expr, model) {
  return execFilterExpr(expr, model);
}

function execFilterExpr(expr, model) {
  var spliter = expr.split('|'), filter, subExpr;
  if (spliter.length === 1) {
    return getCacheFn(model, expr)(model);
  }
  subExpr = spliter[0].trim();
  filter = spliter[1].trim();
  return filters[filter](getCacheFn(model, subExpr)(model));
}
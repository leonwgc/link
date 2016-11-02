import bindHandler from './bind';
import classHandler from './class';
import disabledHandler from './disable';
import modelHandler from './model';
import readonlyHandler from './readonly';
import repeatHandler from './repeat';
import { showHanlder, hideHanlder } from './showhide';

export default {
  'x-show': showHanlder,
  'x-hide': hideHanlder,
  'x-bind': bindHandler,
  'x-disabled': disabledHandler,
  'x-for': repeatHandler,
  'x-class': classHandler,
  'x-model': modelHandler,
  'x-readonly': readonlyHandler
};
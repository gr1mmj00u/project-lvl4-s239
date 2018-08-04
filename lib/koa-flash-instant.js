import _debug from 'debug';

const debug = _debug('koa-flash-instant');

export default (opts) => {
  let key = 'flash';

  if ((opts) && (opts.key)) {
    key = { opts: key };
  }

  return (ctx, next) => {
    const prev = ctx.session[key];

    if (prev) {
      debug('flash message found %j', prev);
      ctx.session[key] = null;
    } else {
      debug('No flash message found');
    }

    ctx.flash = Object.seal({
      get() { return ctx.session[key] ? ctx.session[key] : prev; },
      set(data) { ctx.session[key] = data; },
      setPrimaryAlert(message) { ctx.session[key] = { type: 'primary', message }; },
      setSecandaryAlert(message) { ctx.session[key] = { type: 'secondary', message }; },
      setSuccessAlert(message) { ctx.session[key] = { type: 'success', message }; },
      setDangerAlert(message) { ctx.session[key] = { type: 'danger', message }; },
      setWarningAlert(message) { ctx.session[key] = { type: 'warning', message }; },
      setInfoAlert(message) { ctx.session[key] = { type: 'info', message }; },
      setLightAlert(message) { ctx.session[key] = { type: 'light', message }; },
      setDarkAlert(message) { ctx.session[key] = { type: 'dark', message }; },
    });

    return next();
  };
};

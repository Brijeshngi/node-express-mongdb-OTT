export const catchAsyncError = (fun) => (request, response, next) => {
  Promise.resolve(fun(request, response, next).catch(next));
};

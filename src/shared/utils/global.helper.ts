export const sendResponse = async (
  success: Boolean = true,
  msg: string = '',
  data: any = [],
) => {
  return {
    success: success,
    message: msg,
    data: success ? { data } : [],
    action: 'Route::currentRouteAction()',
    api_version: '1.0',
  };
};

export const validate = async (input, Model, id = 0) => {
  let error = [];
  const rules = await Model.rules();
  console.log(typeof input, rules);

  for await (let [column, rule] of Object.entries(rules)) {
    if (rule == 'unique' && Object.hasOwnProperty.bind(input)(column)) {
      console.log('column: ' + column);
      let ispresent = false;
      if (id) {
        ispresent = await Model.query()
          .whereNot('id', id)
          .where(column, input[column])
          .first();
      } else {
        ispresent = await Model.query().where(column, input[column]).first();
      }
      ispresent ? error.push(column + ' is already taken') : '';
    }
  }
  console.log(error.length);
  if (error.length > 0) {
    return { status: false, error };
  } else {
    return { status: true, error };
  }
};

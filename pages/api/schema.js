import dbConnect from '../../lib/db';
import * as schemas from '../../lib/schemas';

export default async function handler(req, res) {
  await dbConnect();

  const schemaInfo = {};
  for (const [name, model] of Object.entries(schemas)) {
    if (model.schema) {
      schemaInfo[name] = model.schema.obj;
    }
  }
  res.status(200).json(schemaInfo);
}

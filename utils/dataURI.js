import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataURI = (file) => {
  const parser = new DataURIParser();
  const extensionName = path.extname(file.originalName).toString();

  console.log(extensionName);
  return parser.format(extensionName, file.buffer);
};

export default getDataURI;

import * as fs from "fs";
import * as yaml from "js-yaml";

const file = fs.readFileSync("./openapi.yaml", "utf8");
const data = yaml.load(file);

for (const pathKey in data.paths) {
  const path = data.paths[pathKey];

  for (const methodKey in path) {
    const method = path[methodKey];
    if (method.security?.some((sec) => sec.jwt_header_Authorization)) {
      if (!method.parameters) {
        method.parameters = [];
      }

      method.parameters.push({
        name: "Authorization",
        in: "header",
        description: "JWT Authorization header",
        required: false,
        schema: { type: "string" },
      });
    }
  }
}

fs.writeFileSync("./mod-openapi.yaml", yaml.dump(data), "utf8");

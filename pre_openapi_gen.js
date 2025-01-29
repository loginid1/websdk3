import * as fs from "fs";
import * as yaml from "js-yaml";

const file = fs.readFileSync("./openapi.yaml", "utf8");
const data = yaml.load(file);

const allowedTags = new Set(["passkeys", "auth", "reg", "tx"]);
const allowedSchemas = new Set();

const extractSchemas = (schema) => {
  if (!schema) return;

  // Add the schema to allowedSchemas if it has a $ref (reference)
  if (schema.$ref) {
    let schemaName = schema.$ref.replace("#/components/schemas/", "");
    allowedSchemas.add(schemaName);

    const schemaRef = data.components.schemas[schemaName];
    // If it's an object, recursively extract nested schemas
    if (schemaRef.type === "object" && schemaRef.properties) {
      Object.values(schemaRef.properties).forEach(extractSchemas);
    }

    // If it's an array, check its items
    if (schemaRef.type === "array" && schemaRef.items) {
      extractSchemas(schemaRef.items);
    }
  }

  // If it's an array, check its items
  if (schema.type === "array" && schema.items) {
    extractSchemas(schema.items);
  }
};

// Remove disallowed tags from the global "tags" section
if (data.tags) {
  data.tags = data.tags.filter((tag) => allowedTags.has(tag.name));
}

for (const pathKey in data.paths) {
  const path = data.paths[pathKey];

  for (const methodKey in path) {
    const method = path[methodKey];

    const hasAllowedTag = method.tags?.some((tag) => allowedTags.has(tag));

    if (hasAllowedTag) {
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

      if (method.requestBody) {
        const requestBodyContent = method.requestBody.content;
        for (const mediaType in requestBodyContent) {
          extractSchemas(requestBodyContent[mediaType].schema);
        }
      }

      if (method.responses) {
        for (const statusCode in method.responses) {
          const response = method.responses[statusCode];
          if (response.content) {
            for (const mediaType in response.content) {
              extractSchemas(response.content[mediaType].schema);
            }
          }
        }
      }
    } else {
      delete path[methodKey];
    }
  }

  if (Object.keys(path).length === 0) {
    delete data.paths[pathKey];
  }
}

if (data.components && data.components.schemas) {
  for (const schemaKey in data.components.schemas) {
    const schema = data.components.schemas[schemaKey];

    // Filter out schemas not in the allowed list
    if (!allowedSchemas.has(schemaKey)) {
      delete data.components.schemas[schemaKey];
      continue;
    }

    switch (schemaKey) {
      default:
        break;
    }
  }
}

fs.writeFileSync("./mod-openapi.yaml", yaml.dump(data), "utf8");

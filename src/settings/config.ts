import * as config from "./config.json";

console.log(config);

const env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
  const envConfig: Record<string, string> = config[env];
  Object.keys(envConfig).forEach((key) => {
    console.log(key);
    process.env[key] = envConfig[key];
  });
}

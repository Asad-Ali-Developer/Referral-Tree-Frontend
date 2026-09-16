import { productionEnvoirnmentConfig } from "./env.live";
import { stagingEnvoirnmentConfig } from "./env.staging";

const stage = process.env.NODE_ENV;
export const config =
  stage === "production"
    ? productionEnvoirnmentConfig
    : stagingEnvoirnmentConfig;

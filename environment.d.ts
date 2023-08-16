declare global {
  namespace NodeJS {
    interface ProcessEnv {
      Token: string;
      MongoDB: string;
      API: string;
      Environment: "dev" | "prod" | "debug";
      APIBearer: string;
    }
  }
}

export {};

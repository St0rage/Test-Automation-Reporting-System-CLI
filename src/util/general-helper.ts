import { ZodError } from "zod";

export class GeneralHelper {
  static parseIfJson(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  static formatZodErrors(error: ZodError, fileName: string) {
    return error.errors.map((err) => ({
      errorType: "Tars JSON format error",
      path: err.path.join("."),
      message: err.message,
      fileName: fileName,
    }));
  }

  static output(ok: boolean, msg: unknown) {
    const stringifyJson = JSON.stringify(
      {
        ok: ok,
        message: msg,
      },
      null,
      2,
    );

    if (ok) {
      console.info(stringifyJson);
    } else {
      console.error(stringifyJson);
    }
  }
}

process.env.NODE_NO_WARNINGS = "1";
process.removeAllListeners("warning");

import { ZodError } from "zod";
import { CLI } from "./application/cli";
import { ReportService } from "./service/report-service";
import { GeneralHelper } from "./util/general-helper";
import { ReportBuilder } from "./application/report-builder";
import { PlainReportBuilder } from "./application/plain-report-builder";

async function main() {
  const reportBuilder = new ReportBuilder();
  const plainReportBuilder = new PlainReportBuilder();
  const reportService = new ReportService(reportBuilder, plainReportBuilder);
  await new CLI(reportService).setup().run(process.argv);
  process.exit(0);
}

main().catch((e) => {
  let errMsg: unknown;

  if (e instanceof ZodError) {
    errMsg = GeneralHelper.formatZodErrors(e);
  } else if (e instanceof Error) {
    errMsg = GeneralHelper.parseIfJson(e.message);
  } else {
    errMsg = String(e);
  }

  GeneralHelper.output(false, errMsg);
  process.exit(1);
});

process.env.NODE_NO_WARNINGS = "1";
process.removeAllListeners("warning");

import { CLI } from "./application/cli";
import { PlainReportBuilder } from "./application/plain-report-builder";
import { ReportBuilder } from "./application/report-builder";
import { ReportService } from "./service/report-service";
import { GeneralHelper } from "./util/general-helper";

async function main() {
  const reportBuilder = new ReportBuilder();
  const plainReportBuilder = new PlainReportBuilder();
  const reportService = new ReportService(reportBuilder, plainReportBuilder);
  await new CLI(reportService).setup().run(process.argv);
  process.exit(0);
}

main().catch((e) => {
  let errMsg: unknown;

  if (e instanceof Error) {
    errMsg = GeneralHelper.parseIfJson(e.message);
  } else {
    errMsg = String(e);
  }

  GeneralHelper.output(false, errMsg);
  process.exit(1);
});

import { Command } from "commander";
import { ReportService } from "../service/report-service";

export class CLI {
  private program: Command;
  private reportService: ReportService;

  constructor(reportService: ReportService) {
    this.program = new Command();
    this.reportService = reportService;
  }

  public setup() {
    this.program
      .name("TARS-CLI")
      .description("Test Automation Reporting System CLI")
      .version("1.0.0")
      .option("--create-report <file>", "create report from input tars JSON file");

    this.program.option("--gen-tars-file", "generate example tars JSON file");

    return this;
  }

  public async run(argv: string[]) {
    this.program.parse(argv);

    const opts = this.program.opts<{ createReport?: string; genTarsFile?: boolean }>();

    if (Object.keys(opts).length === 0) {
      this.program.help();
    }

    if (opts.createReport) {
      await this.reportService.createReport(opts.createReport);
    }

    if (opts.genTarsFile) {
      await this.reportService.generateTarsFile();
    }
  }
}

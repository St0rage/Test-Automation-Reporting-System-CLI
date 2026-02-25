import path from "path";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import { Validation } from "../validation/validation";
import { ReportValidation } from "../validation/report-validation";
import { ReportData, ReportRequest, SectionData } from "../model/model";
import { ReportBuilder } from "../application/report-builder";
import { PlainReportBuilder } from "../application/plain-report-builder";
import { GeneralHelper } from "../util/general-helper";

export class ReportService {
  private reportBuilder: ReportBuilder;
  private plainReportBuilder: PlainReportBuilder;

  constructor(reportBuilder: ReportBuilder, plainReportBuilder: PlainReportBuilder) {
    this.reportBuilder = reportBuilder;
    this.plainReportBuilder = plainReportBuilder;
  }

  public async createReport(jsonFileName: string) {
    const jsonPath = path.resolve(process.cwd(), jsonFileName);

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Tars JSON File '${jsonPath}' Not Found`);
    }

    let reportRequest;
    try {
      reportRequest = JSON.parse(await readFile(jsonPath, "utf-8"));
    } catch (e) {
      throw new Error(`Failed to read or parse tars JSON file ${jsonPath}`);
    }

    const validatedReportRequest = Validation.validate(
      ReportValidation.reportReqSchema,
      reportRequest as ReportRequest,
    );

    const reportData: ReportData = validatedReportRequest.reportData;
    const sectionData: SectionData[] = validatedReportRequest.stepData;
    const isReportFailed = sectionData.some((section) => section.testSteps.some((step) => step.status === "FAILED"));
    let fileName;

    if (validatedReportRequest.reportType.toLowerCase() === "ui") {
      fileName = await this.reportBuilder.createReport(reportData, sectionData, isReportFailed ? "FAILED" : "PASSED");
    }
    if (validatedReportRequest.reportType.toLocaleLowerCase() === "plain") {
      fileName = await this.plainReportBuilder.createReport(
        reportData,
        sectionData,
        isReportFailed ? "FAILED" : "PASSED",
      );
    }

    GeneralHelper.output(true, `Report generated successfully: ${fileName}`);
  }

  public async generateTarsFile() {
    /* UI Example */
    const UIReportData: ReportData = {
      activity: "activity name (e.g. 'Regression Test')",
      author: "author name or team name",
      project: {
        name: "project name (e.g. 'TARS CLI')",
        platform: "testing platform (e.g. 'Browser')",
        toolName: "testing tool name (e.g. 'Katalon Studio')",
      },
      testCase: {
        title: "test case title (e.g. 'Login with Valid Credentials')",
        testCaseId: "test case ID (e.g. 'TC_LOGIN_01')",
        expectedResult: "expected result (e.g. 'Login successful')",
        criteria: "test criteria (e.g. 'Positive')",
        description: "detailed description of the test case",
        scenarioName: "scenario or test grouping (e.g. 'Authentication')",
      },
    };

    const UIStepData: SectionData[] = [
      {
        sectionNumber: 1,
        name: "section name (e.g. 'Login')",
        testSteps: [
          {
            stepNumber: 1,
            title: "step title (e.g. 'Input Username')",
            description: "detailed description of the step (e.g. 'Username: Admin')",
            image: "step image path (e.g. 'screenshot/img1.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'DONE')",
          },
          {
            stepNumber: 2,
            title: "step title (e.g. 'Input Password')",
            description: "detailed description of the step (e.g. 'Password: admin123')",
            image: "step image path (e.g. 'screenshot/img2.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'DONE')",
          },
          {
            stepNumber: 3,
            title: "step title (e.g. 'Click Login')",
            description: "detailed description of the step (e.g. 'Click login button')",
            image: "step image path (e.g. 'screenshot/img3.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'DONE')",
          },
          {
            stepNumber: 4,
            title: "step title (e.g. 'Verify Login')",
            description: "detailed description of the step (e.g. 'Login success')",
            image: "step image path (e.g. 'screenshot/img4.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'PASSED')",
          },
        ],
      },
      {
        sectionNumber: 2,
        name: "section name (e.g. 'Logout')",
        testSteps: [
          {
            stepNumber: 1,
            title: "step title (e.g. 'Click Logout')",
            description: "detailed description of the step (e.g. 'Click Logout button')",
            image: "step image path (e.g. 'screenshot/img5.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'DONE')",
          },
          {
            stepNumber: 2,
            title: "step title (e.g. 'Verify Logout')",
            description: "detailed description of the step (e.g. 'Logout success')",
            image: "step image path (e.g. 'screenshot/img2.png')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'FAILED')",
          },
        ],
      },
    ];

    const UIExample: ReportRequest = {
      reportType: "UI",
      reportData: UIReportData,
      stepData: UIStepData,
    };

    /* Plain Example */

    const plainReportData: ReportData = {
      activity: "activity name (e.g. 'Regression Test')",
      author: "author name or team name",
      project: {
        name: "project name (e.g. 'TARS CLI')",
        platform: "testing platform (e.g. 'Rest API')",
        toolName: "testing tool name (e.g. 'Katalon Studio')",
      },
      testCase: {
        title: "test case title (e.g. 'Login with Valid Credentials')",
        testCaseId: "test case ID (e.g. 'TC_LOGIN_01')",
        expectedResult: "expected result (e.g. 'Login successful')",
        criteria: "test criteria (e.g. 'Positive')",
        description: "detailed description of the test case",
        scenarioName: "scenario or test grouping (e.g. 'Authentication')",
      },
    };

    const plainStepData: SectionData[] = [
      {
        sectionNumber: 1,
        name: "section name (e.g. 'Get Token')",
        testSteps: [
          {
            stepNumber: 1,
            title: "step title (e.g. 'Request')",
            description:
              "detailed description of the step (e.g. '{\n     'url': 'https://localhost:9000/api/oauth/token',\n     'method': 'POST',\n     'headers': {\n          'Content-Type': 'application/json'\n     },\n     'body': {\n          'username' : 'Admin',\n          'password' : 'admin123', \n     }\n}')",
            image: "not required (e.g '')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'PASSED')",
          },
        ],
      },
      {
        sectionNumber: 2,
        name: "section name (e.g. 'Logout')",
        testSteps: [
          {
            stepNumber: 1,
            title: "step title (e.g. 'Request')",
            description:
              "detailed description of the step (e.g. '{\n     'url': 'https://localhost:9000/api/logout',\n     'method': 'POST',\n     'headers': {\n          'Authorization': 'Bearer fu4rRU8Gtj4wn4XWoq4p10FdkU79Yp6ZnCWJuZ0kQjMYQTTczMywRx',\n          'Content-Type': 'application/json'\n     },\n     'body': {}\n}')",
            image: "not required (e.g '')",
            status: "step status, one of ['DONE', 'PASSED', 'FAILED'] (e.g. 'DONE')",
          },
        ],
      },
    ];

    const plainExample: ReportRequest = {
      reportType: "Plain",
      reportData: plainReportData,
      stepData: plainStepData,
    };

    /*  Write File */

    const UIJsonString = JSON.stringify(UIExample, null, 2);
    const UIOutputPath = path.join(process.cwd(), "tars-ui-example.json");
    await writeFile(UIOutputPath, UIJsonString, "utf-8");

    const plainJsonString = JSON.stringify(plainExample, null, 2);
    const plainOutputPath = path.join(process.cwd(), "tars-plain-example.json");
    await writeFile(plainOutputPath, plainJsonString, "utf-8");

    GeneralHelper.output(true, "Successfully generated TARS JSON example");
  }
}

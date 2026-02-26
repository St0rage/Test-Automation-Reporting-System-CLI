import { z, ZodType } from "zod";
import { SectionData } from "../model/model";

export class ReportValidation {
  private static readonly projectSchema: ZodType = z.object({
    name: z.string().min(3).max(50),
    platform: z.string().min(3).max(20),
    toolName: z.string().min(3).max(50),
  });

  private static readonly testCaseSchema: ZodType = z.object({
    title: z.string().min(3).max(100),
    testCaseId: z.string().min(3).max(50),
    expectedResult: z.string().min(3).max(100),
    criteria: z.string().min(3).max(20),
    description: z.string().min(3).max(380),
    scenarioName: z.string().min(3).max(100),
  });

  private static readonly reportDataSchema: ZodType = z.object({
    activity: z.string().min(3).max(50),
    author: z
      .string({
        required_error: "'author': Required",
        invalid_type_error: "author': Expected string, received number",
      })
      .min(3)
      .max(50),
    project: ReportValidation.projectSchema,
    testCase: ReportValidation.testCaseSchema,
  });

  private static readonly testStepSchema: ZodType = z.object({
    stepNumber: z.number().positive(),
    title: z.string().min(3).max(80),
    description: z.string().min(3),
    image: z.string(),
    status: z.string().refine((val) => ["done", "passed", "failed"].includes(val.toLowerCase()), {
      message: "status must be one of : DONE, PASSED, FAILED",
    }),
  });

  private static readonly stepDataSchema: ZodType = z.object({
    sectionNumber: z.number().positive(),
    name: z.string().min(3).max(80),
    testSteps: z
      .array(ReportValidation.testStepSchema)
      .min(1, { message: "testSteps must contain at least 1 element(s)" }),
  });

  static readonly reportReqSchema: ZodType = z
    .object({
      reportType: z.string().refine((val) => ["ui", "plain"].includes(val.toLowerCase()), {
        message: "reportType must be one of : UI, Plain",
      }),
      reportData: ReportValidation.reportDataSchema,
      stepData: z
        .array(ReportValidation.stepDataSchema)
        .min(1, { message: "StepData must contain at least 1 element(s)" }),
    })
    .superRefine((data, ctx) => {
      const reportType = data.reportType.toLowerCase();

      (data.stepData as SectionData[]).forEach((section, sectionIdx) => {
        section.testSteps.forEach((testStep, testStepIdx) => {
          if (reportType.toLowerCase() === "ui" && testStep.image.trim() === "") {
            ctx.addIssue({
              path: ["stepData", sectionIdx, "testSteps", testStepIdx, "image"],
              message: "image is required",
              code: z.ZodIssueCode.custom,
            });
          }

          if (reportType.toLowerCase() === "ui" && testStep.description.length > 400) {
            ctx.addIssue({
              path: ["stepData", sectionIdx, "testSteps", testStepIdx, "description"],
              message: "String must contain at most 400 character(s)",
              code: z.ZodIssueCode.custom,
            });
          }
        });
      });
    });
}

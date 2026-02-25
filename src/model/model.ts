export type ReportRequest = {
  reportType: string;
  reportData: ReportData;
  stepData: SectionData[];
};

export type ReportData = {
  activity: string;
  author: string;
  project: {
    name: string;
    platform: string;
    toolName: string;
  };
  testCase: {
    title: string;
    testCaseId: string;
    expectedResult: string;
    criteria: string;
    description: string;
    scenarioName: string;
  };
};

export type SectionData = {
  sectionNumber: number;
  name: string;
  testSteps: TestStepData[];
};

export type TestStepData = {
  stepNumber: number;
  title: string;
  description: string;
  image: string;
  status: string;
};

export interface IAssignmentData {
  open: boolean;
  assignmentId?: number;
  lessonId?: number;
}

export interface ITreeConfig {
  htmlFiles: string[];
  cssFiles: string[];
}

export interface AssignmentConfig {
  codeData: string[][];
  courseId: number;
  lessonId: number;
  userId: string;
  previewFileName: string;
}

export enum SubmissionType {
  PROGRAMMING_LANG = "PROGRAMMING_LANG",
  PROGRAMMING_PROJECT = "PROGRAMMING_PROJECT",
  TEXT = "TEXT",
  URL = "URL",
  FILE = "FILE",
}

export enum ProjectFramework {
  STATIC_WEB = "STATIC_WEB",
  REACTJS = "REACTJS",
  NEXT_APP = "NEXT_APP",
}

export type DocumentExtension = "pdf" | "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx" | "txt" | "rtf" | "odt";

export interface IAssignmentSubmission {
  _type: SubmissionType;
}
export interface IProgrammingLangSubmission extends IAssignmentSubmission {
  initialCode: string;
  programmingLang: string;
}

export interface IProgrammingProjectSubmission extends IAssignmentSubmission {
  framework: ProjectFramework;
  versions: Map<string, string>;
  baseProjectArchiveUrl: string;
}

export interface ITextSubmissionContent extends IAssignmentSubmission {
  text: string;
}
export interface IFileSubmission extends IAssignmentSubmission {
  fileExts: DocumentExtension;
}

export interface IUrlSubmission extends IAssignmentSubmission {}

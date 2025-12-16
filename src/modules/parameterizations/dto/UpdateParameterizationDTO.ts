export interface UpdateParameterizationDTO {
  friendlyName?: string | undefined;
  technicalKey?: string | undefined;
  dataType?: string | undefined;
  value?: string | undefined;
  scopeType?: string | undefined;
  scopeTargetId?: string[] | undefined;
  editable?: boolean | undefined;
  updatedBy: string;
}

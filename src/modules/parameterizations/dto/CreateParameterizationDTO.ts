export interface CreateParameterizationDTO {
  friendlyName: string;
  technicalKey: string;
  dataType: string;
  value: string;
  scopeType: string;
  scopeTargetId?: string[] | undefined;
  editable?: boolean | undefined;
  createdBy: string;
}

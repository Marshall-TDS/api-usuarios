import { randomUUID } from "crypto";

export interface ParameterizationProps {
  id: string;
  seqId?: number | undefined;
  friendlyName: string;
  technicalKey: string;
  dataType: string;
  value: string;
  scopeType: string;
  scopeTargetId: string[];
  editable: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export type CreateParameterizationProps = Omit<
  ParameterizationProps,
  "id" | "createdAt" | "updatedAt" | "editable"
> & {
  editable?: boolean;
};

export type UpdateParameterizationProps = {
  friendlyName?: string | undefined;
  technicalKey?: string | undefined;
  dataType?: string | undefined;
  value?: string | undefined;
  scopeType?: string | undefined;
  scopeTargetId?: string[] | undefined;
  editable?: boolean | undefined;
  updatedBy: string;
};

export class Parameterization {
  private constructor(private props: ParameterizationProps) {}

  static create(data: CreateParameterizationProps) {
    const timestamp = new Date();
    return new Parameterization({
      ...data,
      id: randomUUID(),
      scopeTargetId: data.scopeTargetId ?? [],
      editable: data.editable ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  static restore(props: ParameterizationProps) {
    return new Parameterization(props);
  }

  update(data: UpdateParameterizationProps) {
    const nextProps: ParameterizationProps = { ...this.props };

    if (typeof data.friendlyName !== "undefined") {
      nextProps.friendlyName = data.friendlyName;
    }

    if (typeof data.technicalKey !== "undefined") {
      nextProps.technicalKey = data.technicalKey;
    }

    if (typeof data.dataType !== "undefined") {
      nextProps.dataType = data.dataType;
    }

    if (typeof data.value !== "undefined") {
      nextProps.value = data.value;
    }

    if (typeof data.scopeType !== "undefined") {
      nextProps.scopeType = data.scopeType;
    }

    if (typeof data.scopeTargetId !== "undefined") {
      nextProps.scopeTargetId = data.scopeTargetId;
    }

    if (typeof data.editable !== "undefined") {
      nextProps.editable = data.editable;
    }

    nextProps.updatedBy = data.updatedBy;
    nextProps.updatedAt = new Date();

    this.props = nextProps;
  }

  toJSON(): ParameterizationProps {
    return { ...this.props };
  }
}

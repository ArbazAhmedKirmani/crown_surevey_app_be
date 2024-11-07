import { OptionType } from "@prisma/client";

export interface CreateOptionProps {
  name: string;
  isParent: boolean;
  parentId?: number;
  type: OptionType;
}

interface IChildForm {
  name: string;
  prefix: string;
  isChild: boolean;
}

export interface IFormCreateDto {
  name: string;
  prefix: string;
  childForm: IChildForm[];
}

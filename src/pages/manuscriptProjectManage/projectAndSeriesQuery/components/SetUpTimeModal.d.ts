export interface PropsType {
  visible?: boolean;
  setUpTime: string | null;
  form: {
    getFieldDecorator(string, object): any;
  };
  curSetUpTimeProCode?: string;
  loading?: boolean;
  dispatch({ type: string, payload: object }): void;
  onCancel(): void;
  onCreate(): void;
}

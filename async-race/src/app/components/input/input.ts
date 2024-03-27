import { BaseComponent, TaggedElementProps } from '../base-component';

interface InputProps {
  valueType?: string;
  id?: string;
}

export class Input extends BaseComponent<HTMLInputElement> {
  constructor(props: TaggedElementProps, inputProps?: InputProps) {
    super({ tagName: 'input', ...props });

    this.setAttribute({ name: 'type', value: inputProps?.valueType ?? 'text' });
    if (inputProps?.id) this.setAttribute({ name: 'id', value: inputProps.id });
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: string) {
    this.element.value = value;
  }
}

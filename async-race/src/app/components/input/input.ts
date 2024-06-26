import { BaseComponent, TaggedElementProps } from 'Components/base-component';

interface InputProps {
  type?: string;
  placeholder?: string;
  id?: string;
  required?: string;
  onInput?: (value: string) => void;
}

export class Input extends BaseComponent<HTMLInputElement> {
  constructor(props: TaggedElementProps, inputProps?: InputProps) {
    super({ tagName: 'input', ...props });

    this.setAttribute({ name: 'placeholder', value: inputProps?.placeholder ?? '' });
    this.setAttribute({ name: 'type', value: inputProps?.type ?? 'text' });
    if (inputProps?.id) this.setAttribute({ name: 'id', value: inputProps.id });
    if (inputProps?.onInput) this.addOnInput(inputProps.onInput);
    if (inputProps?.required) this.setAttribute({ name: 'required', value: inputProps.required });
  }

  addOnInput(onInput: (value: string) => void) {
    this.addEventListener('input', () => {
      onInput(this.getValue());
    });
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: string) {
    this.element.value = value;
  }
}

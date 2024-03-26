import { BaseComponent, TaggedElementProps } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';

export interface GarageFormValue {
  carName: string;
  carColor: string;
}

export class GarageForm extends BaseComponent {
  constructor(props: TaggedElementProps, onSubmit: (value: GarageFormValue) => void) {
    super({ tagName: 'form', ...props });

    const textInput = new Input({ classNames: 'input_name' });
    const colorInput = new Input({ classNames: 'input_color' }, { valueType: 'color' });
    const submitButton = new Button({
      classNames: 'button_submit',
      textContent: 'CREATE',
      attributes: { name: 'type', value: 'submit' },
    });

    this.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit({ carName: textInput.getValue(), carColor: colorInput.getValue() });
    });

    this.insertChildren([textInput, colorInput, submitButton]);
  }
}

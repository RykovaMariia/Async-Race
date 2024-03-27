import './garage-form.scss';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';

export interface GarageFormValue {
  carName: string;
  carColor: string;
}

export class GarageForm extends BaseComponent {
  constructor(
    props: TaggedElementProps,
    { buttonName, onSubmit }: { buttonName: string; onSubmit: (value: GarageFormValue) => void },
  ) {
    super({ tagName: 'form', ...props });
    this.setClassName('form');

    const textInput = new Input({
      classNames: 'input_name',
      attributes: [
        { name: 'placeholder', value: 'Inter name your car' },
        { name: 'required', value: 'required' },
      ],
    });

    const colorInput = new Input({ classNames: 'input_color' }, { valueType: 'color' });
    const submitButton = new Button({
      classNames: 'button_submit',
      textContent: buttonName,
      attributes: { name: 'type', value: 'submit' },
    });

    this.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit({ carName: textInput.getValue(), carColor: colorInput.getValue() });
    });

    this.insertChildren([textInput, colorInput, submitButton]);
  }
}

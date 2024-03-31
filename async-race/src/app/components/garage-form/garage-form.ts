import './garage-form.scss';
import { BaseComponent, TaggedElementProps } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';

export interface GarageFormValue {
  carName: string;
  carColor: string;
}

export class GarageForm extends BaseComponent {
  private textInput: Input;

  private colorInput: Input;

  constructor(
    props: TaggedElementProps,
    { buttonName, onSubmit }: { buttonName: string; onSubmit: (value: GarageFormValue) => void },
  ) {
    super({ tagName: 'form', ...props });
    this.setClassName('form');

    this.textInput = new Input(
      {
        classNames: 'input_name',
      },
      { placeholder: 'Inter name your car' },
    );

    this.colorInput = new Input({ classNames: 'input_color' }, { type: 'color' });
    const submitButton = new Button(
      {
        classNames: 'button_submit',
        textContent: buttonName,
      },
      { type: 'submit' },
    );

    this.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit({ carName: this.textInput.getValue(), carColor: this.colorInput.getValue() });
    });

    this.insertChildren([this.textInput, this.colorInput, submitButton]);
  }

  setTextInputValue(value: string) {
    this.textInput.setValue(value);
  }

  setColorInputValue(value: string) {
    this.colorInput.setValue(value);
  }
}

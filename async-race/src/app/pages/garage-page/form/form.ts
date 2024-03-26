import { BaseComponent, TaggedElementProps } from '../../../components/base-component';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { apiGarageService } from '../../../services/api-garage-service';

export class GarageForm extends BaseComponent {
  constructor(props: TaggedElementProps, id?: number, isCreate: boolean = true) {
    super({ tagName: 'form', ...props });

    const textInput = new Input({ classNames: 'input_name' });
    const colorInput = new Input({ classNames: 'input_color' }, { valueType: 'color' });
    const submitButton = new Button(
      {
        classNames: 'button_submit',
        textContent: 'CREATE',
        attributes: { name: 'type', value: 'submit' },
      },
      (e) => {
        e.preventDefault();
        if (isCreate) {
          apiGarageService.createCar({ name: textInput.getValue(), color: colorInput.getValue() });
        } else if (id) {
          apiGarageService.updateCar(id, {
            name: textInput.getValue(),
            color: colorInput.getValue(),
          });
        }
      },
    );

    this.insertChildren([textInput, colorInput, submitButton]);
  }
}

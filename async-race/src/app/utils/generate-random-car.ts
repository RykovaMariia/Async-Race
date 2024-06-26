import { carNames } from 'Data/cars';

function getRandomCarName() {
  const randomBrand = Math.floor(Math.random() * (carNames.length - 1));
  const randomModel = Math.floor(Math.random() * (carNames.length - 1));

  return `${carNames[randomBrand].brand} ${carNames[randomBrand].models[randomModel]}`;
}

function getRandomCarColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function getRandomCar() {
  return { carName: getRandomCarName(), carColor: getRandomCarColor() };
}

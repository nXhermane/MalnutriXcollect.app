import { observable } from '@legendapp/state';

export const currentTime = observable<number>(Date.now());

setInterval(() => {
  currentTime.set(Date.now());
}, 30_000);

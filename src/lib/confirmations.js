export function confirmTruckDeletion(truck, confirmFn = window.confirm) {
  return confirmFn(`Supprimer le camion ${truck.plate} ? Cette action est définitive.`);
}

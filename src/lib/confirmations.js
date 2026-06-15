export function getTruckDeletionConfirmation(truck) {
  return {
    title: 'Supprimer le camion ?',
    message: `Confirmez la suppression définitive du camion ${truck.plate}.`,
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
  };
}

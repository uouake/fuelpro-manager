export function getTruckDeletionConfirmation(truck) {
  return {
    title: 'Supprimer le camion ?',
    message: `Confirmez la suppression définitive du camion ${truck.plate}.`,
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
  };
}

export function getPersonnelDeletionConfirmation(person) {
  return {
    title: 'Supprimer le membre du personnel ?',
    message: `Confirmez la suppression définitive de ${person.name}.`,
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
  };
}

function formatPhoneNumber(phoneNumber) {
    // Supprime tous les espaces existants
    const cleanedNumber = phoneNumber.replace(/\s/g, '');
  
    // Vérifie l'indicatif et formate le numéro en conséquence
    if (cleanedNumber.startsWith('+261')) {
      // Format pour Madagascar (+261)
      return cleanedNumber.replace(/(\+261)(\d{2})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4 $5');
    } else if (cleanedNumber.startsWith('+262')) {
      // Format pour La Réunion (+262)
      return cleanedNumber.replace(/(\+262)(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    } else {
      // Aucun format connu, retourne le numéro tel quel
      return cleanedNumber;
    }
  }

  export default formatPhoneNumber;
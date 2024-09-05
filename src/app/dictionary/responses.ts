import { Languages } from "./types";

export const responses = {
  "success.reply": {
    [Languages.EN]: "Sure! Here is a screenshot of this post:",
    [Languages.PT]: "Claro! Aqui está uma captura de tela deste post:",
    [Languages.FR]: "Bien sûr! Voici une capture d'écran de ce post:",
  },
  "error.notAReply": {
    [Languages.EN]:
      "This post is not a reply. Please reply to a post and tag me to get a screenshot of it.",
    [Languages.PT]:
      "Este post não é uma resposta. Responda a um post e mencione-me para obter uma captura de tela dele.",
    [Languages.FR]:
      "Ce post n'est pas une réponse. Répondez à un post et mentionnez-moi pour obtenir une capture d'écran de celui-ci.",
  },
  "error.imageGeneration": {
    [Languages.EN]:
      "Failed to generate image for this post. Please report this issue. You can find more info in my bio.",
    [Languages.PT]:
      "Falha ao gerar imagem para este post. Por favor, reporte este problema. Você pode encontrar mais informações na minha bio.",
    [Languages.FR]:
      "Échec de la génération d'image pour ce post. Veuillez signaler cette erreur. Vous pouvez trouver plus d'informations dans mon bio.",
  },
  "error.unknown": {
    [Languages.EN]:
      "An unknown error occurred while generating a screenshot for fulfilling your request.\n\nError: {{error}}",
    [Languages.PT]:
      "Ocorreu um erro desconhecido ao gerar uma captura de tela para atender à sua solicitação.\n\nErro: {{error}}",
    [Languages.FR]:
      "Une erreur inconnue s'est produite lors de la génération d'une capture d'écran pour satisfaire votre demande.\n\nErreur: {{error}}",
  },
} as const;

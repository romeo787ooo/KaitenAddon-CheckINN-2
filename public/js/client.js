Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: './public/views/check-inn.html',
          height: 150,
          width: 400
        });
      }
    });

    return buttons;
  },
  'card_facade_badges': async (context) => {
    const isChecked = await context.getData('card', 'private', 'innChecked');
    
    if (isChecked) {
      return {
        text: '✅ ИНН проверен',
        color: 'green'
      };
    }
    return null;
  },
  'card_body_section': async (bodySectionContext) => {
    const checkData = await bodySectionContext.getData('card', 'private', 'innCheckData');
    
    if (!checkData) {
      return [];
    }

    return [{
      title: '🏢 Данные о проверке организации',
      content: {
        type: 'iframe',
        url: bodySectionContext.signUrl('./views/check-result.html'),
        height: 400,
      }
    }];
  }
});

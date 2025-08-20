Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: 'public/views/check-inn.html',
          height: 215,
          width: 700
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

  const { companyData, checkDate } = checkData;
  
  return [{
    title: '🏢 Данные о проверке организации',
    content: {
      type: 'text', // Изменили с 'html' на 'text'
      text: `Дата проверки: ${new Date(checkDate).toLocaleString()}

Название: ${companyData.title || '-'}
ИНН: ${companyData.inn || '-'}
КПП: ${companyData.kpp || '-'}
ОГРН: ${companyData.ogrn || '-'}
Статус: ${companyData.status || '-'}
Адрес: ${companyData.address || '-'}
Руководитель: ${companyData.managementFIO || '-'}`
    }
  }];
}
});

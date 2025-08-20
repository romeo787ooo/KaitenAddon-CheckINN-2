Addon.initialize({
  'card_buttons': async (cardButtonsContext) => {
    const buttons = [];

    buttons.push({
      text: '🔍 Проверить ИНН',
      callback: async (buttonContext) => {
        return buttonContext.openPopup({
          type: 'iframe',
          title: 'Проверка ИНН',
          url: 'public/views/check-inn.html',  // убрали ./
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
      type: 'html',
      html: `
        <div style="padding: 16px; font-family: Roboto;">
          <div style="margin-bottom: 12px; color: #666; font-size: 12px;">
            Дата проверки: ${new Date(checkDate).toLocaleString()}
          </div>
          <div style="font-size: 16px; font-weight: 500; margin-bottom: 16px;">
            ${companyData.title || '-'}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div><strong>ИНН:</strong> ${companyData.inn || '-'}</div>
            <div><strong>КПП:</strong> ${companyData.kpp || '-'}</div>
            <div><strong>ОГРН:</strong> ${companyData.ogrn || '-'}</div>
            <div><strong>Статус:</strong> ${companyData.status || '-'}</div>
          </div>
          <div style="margin-top: 12px;">
            <strong>Адрес:</strong> ${companyData.address || '-'}
          </div>
        </div>
      `
    }
  }];
}

const iframe = Addon.iframe();

iframe.render(() => {
  iframe.getData('card', 'private', 'innCheckData')
    .then(data => {
      const loading = document.getElementById('loading');
      const container = document.getElementById('checkResult');
      
      loading.style.display = 'none';
      
      if (!data) {
        container.innerHTML = '<div style="padding: 16px;">Данные не найдены</div>';
        return;
      }

      const { companyData, checkDate } = data;
      
      container.innerHTML = `
        <div style="padding: 16px; font-family: Roboto;">
          <div style="margin-bottom: 8px; font-size: 12px; color: #666;">
            ${new Date(checkDate).toLocaleString()}
          </div>
          <h3>${companyData.title || 'Не указано'}</h3>
          <p><strong>ИНН:</strong> ${companyData.inn || '-'}</p>
          <p><strong>Адрес:</strong> ${companyData.address || '-'}</p>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('loading').textContent = 'Ошибка загрузки';
    });
});

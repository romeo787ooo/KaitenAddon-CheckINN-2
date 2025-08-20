const iframe = Addon.iframe();

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderCheckResult(data) {
  const container = document.getElementById('checkResult');
  const loading = document.getElementById('loading');
  
  if (!data) {
    loading.style.display = 'none';
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--addon-text-secondary-color);">
        Данные проверки не найдены
      </div>
    `;
    iframe.fitSize(container);
    return;
  }

  const { companyData, checks, checkDate } = data;

  const html = `
    <div style="padding: 16px;">
      <div style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--addon-divider);">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">
          Дата проверки: ${formatDate(checkDate)}
        </div>
      </div>
      
      <div style="margin-bottom: 16px;">
        <div style="font-size: 14px; color: var(--addon-text-secondary-color); margin-bottom: 8px;">
          Наименование организации:
        </div>
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 16px; color: var(--addon-text-primary-color);">
          ${companyData.title || 'Не указано'}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background: var(--addon-background-level2); border-radius: 8px; margin-bottom: 16px;">
        <div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">ИНН</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.inn || '-'}</div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">КПП</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.kpp || '-'}</div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">ОГРН</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.ogrn || '-'}</div>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">Статус</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.status || '-'}</div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">ОКПО</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.okpo || '-'}</div>
          </div>
          <div style="margin-bottom: 12px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">ОКВЭД</div>
            <div style="font-weight: 500; color: var(--addon-text-primary-color);">${companyData.okved || '-'}</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">Адрес</div>
        <div style="color: var(--addon-text-primary-color);">${companyData.address || 'Не указан'}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px; margin-bottom: 4px;">Руководитель</div>
        <div style="color: var(--addon-text-primary-color); font-weight: 500;">${companyData.managementFIO || 'Не указан'}</div>
        ${companyData.managementPost ? `<div style="font-size: 12px; color: var(--addon-text-secondary-color); margin-top: 2px;">${companyData.managementPost}</div>` : ''}
      </div>

      ${(checks && (checks.classified || checks.tourOperator || checks.agentLink)) ? `
        <div style="padding-top: 16px; border-top: 1px solid var(--addon-divider);">
          <div style="font-size: 14px; color: var(--addon-text-secondary-color); margin-bottom: 12px;">
            Проверка в реестрах:
          </div>
          ${checks.classified ? `
            <div style="margin-bottom: 8px; color: var(--addon-success-color);">
              ✓ Проверено в Реестре классифицированных объектов
            </div>
          ` : ''}
          ${checks.tourOperator ? `
            <div style="margin-bottom: 8px; color: var(--addon-success-color);">
              ✓ Проверено в Федеральном реестре Туроператоров
            </div>
          ` : ''}
          ${checks.agentLink ? `
            <div style="margin-bottom: 8px;">
              🔗 <a href="${checks.agentLink}" target="_blank" style="color: var(--addon-primary-color); text-decoration: none;">
                Ссылка на реестр Турагентов
              </a>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;

  loading.style.display = 'none';
  container.innerHTML = html;
  iframe.fitSize(container);
}

// Инициализация и загрузка данных
iframe.render(() => {
  iframe.getData('card', 'private', 'innCheckData')
    .then(data => {
      renderCheckResult(data);
    })
    .catch(error => {
      console.error('Error loading check data:', error);
      const container = document.getElementById('checkResult');
      const loading = document.getElementById('loading');
      
      loading.style.display = 'none';
      container.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--addon-error-color);">
          Ошибка загрузки данных проверки
        </div>
      `;
      iframe.fitSize(container);
    });
});

// Подгоняем размер при загрузке
iframe.fitSize('#checkResult');

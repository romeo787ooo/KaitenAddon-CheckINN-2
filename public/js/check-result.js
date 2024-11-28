const iframe = Addon.iframe();

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function renderCheckResult(data) {
  const container = document.getElementById('checkResult');
  const loading = document.getElementById('loading');
  
  if (!data) {
    loading.textContent = 'Данные не найдены';
    return;
  }

  const { companyData, checks, checkDate } = data;

  const html = `
    <div style="margin-bottom: 16px;">
      <span style="color: var(--addon-text-secondary-color); font-size: 12px;">
        Дата проверки: ${formatDate(checkDate)}
      </span>
    </div>
    <div class="company-info">
      <span style="font-size: 14px; color: var(--addon-text-secondary-color);">Наименование организации:</span>
      <div style="font-size: 16px; font-weight: 500; margin: 4px 0 16px 0; color: var(--addon-text-primary-color);">
        ${companyData.title || '-'}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background: var(--addon-background-level2); border-radius: 8px;">
        <div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ИНН</div>
            <div style="font-weight: 500;">${companyData.inn || '-'}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">КПП</div>
            <div style="font-weight: 500;">${companyData.kpp || '-'}</div>
          </div>
          <div>
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОГРН</div>
            <div style="font-weight: 500;">${companyData.ogrn || '-'}</div>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Статус</div>
            <div style="font-weight: 500;">${companyData.status || '-'}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКПО</div>
            <div style="font-weight: 500;">${companyData.okpo || '-'}</div>
          </div>
          <div>
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКВЭД</div>
            <div style="font-weight: 500;">${companyData.okved || '-'}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 12px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Адрес</div>
        <div style="margin-top: 4px;">${companyData.address || '-'}</div>
      </div>
      <div style="margin-top: 12px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Руководитель</div>
        <div style="margin-top: 4px;">${companyData.managementFIO || '-'}</div>
        <div style="font-size: 12px; color: var(--addon-text-secondary-color); margin-top: 2px;">
          ${companyData.managementPost || '-'}
        </div>
      </div>
      ${checks.classified || checks.tourOperator || checks.agentLink ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--addon-divider);">
          <div style="font-size: 14px; color: var(--addon-text-secondary-color); margin-bottom: 8px;">
            Проверка в реестрах:
          </div>
          ${checks.classified ? `<div>✓ Проверено в Реестре классифицированных объектов</div>` : ''}
          ${checks.tourOperator ? `<div>✓ Проверено в Федеральном реестре Туроператоров</div>` : ''}
          ${checks.agentLink ? `<div>🔗 <a href="${checks.agentLink}" target="_blank">Ссылка на реестр Турагентов</a></div>` : ''}
        </div>
      ` : ''}
    </div>
  `;

  loading.style.display = 'none';
  container.innerHTML = html;
  iframe.fitSize(container);
}

iframe.render(() => {
  iframe.getData('card', 'private', 'innCheckData')
    .then(data => {
      renderCheckResult(data);
    });
});

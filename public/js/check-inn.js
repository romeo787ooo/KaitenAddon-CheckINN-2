const iframe = Addon.iframe();

const innInput = document.getElementById('innInput');
const checkButton = document.getElementById('check');
const cancelButton = document.getElementById('cancel');
const loader = document.getElementById('loader');
const buttons = document.getElementById('buttons');
const results = document.getElementById('results');
const debugContent = document.getElementById('debugContent');

let companyData = null;
let checks = {
  classified: false,
  tourOperator: false,
  agentLink: ''
};

iframe.fitSize('#checkInnContent');

// Подгрузка ИНН
iframe.render(async () => {
  try {
    const cardProps = await iframe.getCardProperties('customProperties');
    
    // Ищем поле с ИНН по id 398033
    const innField = cardProps.find(prop => prop.property.id === 398033);
    
    if (innField?.value) {
      innInput.value = innField.value;
      console.log('ИНН загружен:', innField.value);
    }
    
    // Показываем отладочную информацию
    await showDebugInfo();
    
    iframe.fitSize('#checkInnContent');
  } catch (error) {
    console.error('Error loading INN:', error);
  }
});

// Функция для отображения отладочной информации
async function showDebugInfo() {
 try {
   const card = await iframe.getCard();
   const props = await iframe.getCardProperties('customProperties');
   const allData = await iframe.getAllData();

   let debugText = '=== RAW DATA ===\n\n';
   
   debugText += '=== getCard() ===\n';
   debugText += JSON.stringify(card, null, 2) + '\n\n';
   
   debugText += '=== getCardProperties() ===\n';
   debugText += JSON.stringify(props, null, 2) + '\n\n';
   
   debugText += '=== getAllData() ===\n';
   debugText += JSON.stringify(allData, null, 2);

   debugContent.textContent = debugText;
   iframe.fitSize('#checkInnContent');
 } catch (error) {
   debugContent.textContent = `Error getting data: ${error.message}`;
 }
}


function setLoading(isLoading) {
  loader.style.display = isLoading ? 'block' : 'none';
  checkButton.disabled = isLoading;
  innInput.disabled = isLoading;
  iframe.fitSize('#checkInnContent');
}

function renderResults(data) {
  companyData = data;
  results.style.display = 'block';
  results.innerHTML = `
    <div class="company-info">
      <span style="font-size: 14px; color: var(--addon-text-secondary-color);">Наименование организации:</span>
      <div style="font-size: 16px; font-weight: 500; margin: 4px 0 16px 0; color: var(--addon-text-primary-color);">
        ${data.title || '-'}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; background: var(--addon-background-level2); border-radius: 8px;">
        <div style="color: var(--addon-text-primary-color);">
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ИНН</div>
            <div style="font-weight: 500;">${data.inn || '-'}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">КПП</div>
            <div style="font-weight: 500;">${data.kpp || '-'}</div>
          </div>
          <div>
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОГРН</div>
            <div style="font-weight: 500;">${data.ogrn || '-'}</div>
          </div>
        </div>
        <div style="color: var(--addon-text-primary-color);">
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Статус</div>
            <div style="font-weight: 500;">${data.status || '-'}</div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКПО</div>
            <div style="font-weight: 500;">${data.okpo || '-'}</div>
          </div>
          <div>
            <div style="color: var(--addon-text-secondary-color); font-size: 12px;">ОКВЭД</div>
            <div style="font-weight: 500;">${data.okved || '-'}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 12px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Адрес</div>
        <div style="margin-top: 4px; color: var(--addon-text-primary-color);">${data.address || '-'}</div>
      </div>
      <div style="margin-top: 12px;">
        <div style="color: var(--addon-text-secondary-color); font-size: 12px;">Руководитель</div>
        <div style="margin-top: 4px; color: var(--addon-text-primary-color);">${data.managementFIO || '-'}</div>
        <div style="font-size: 12px; color: var(--addon-text-secondary-color); margin-top: 2px;">${data.managementPost || '-'}</div>
      </div>
    </div>
  `;

  // Показываем ссылки на реестры и кнопку "Проверка завершена" сразу
  const registryLinks = document.getElementById('registryLinks');
  const completeButton = document.getElementById('completeCheck');
  
  registryLinks.style.display = 'block';
  completeButton.style.display = 'block';

  // Обновляем ссылки с учетом ИНН
  const classifiedLink = document.getElementById('classifiedLink');
  classifiedLink.href = `https://fsa.gov.ru/use-of-technology/elektronnye-reestryy/reestr-klassifitsirovannykh-obektov-gostinitsy-i-inye-sredstva-razmeshcheniya/?inn=${data.inn}`;

  const tourOperatorLink = document.getElementById('tourOperatorLink');
  tourOperatorLink.href = 'https://economy.gov.ru/material/directions/turizm/reestry_turizm/edinyy_federalnyy_reestr_turoperatorov/poisk_po_efrt/';

  // Обработчики для чек-боксов
  classifiedLink.addEventListener('click', () => {
    checks.classified = true;
    document.getElementById('classifiedCheck').style.display = 'inline';
  });

  tourOperatorLink.addEventListener('click', () => {
    checks.tourOperator = true;
    document.getElementById('tourOperatorCheck').style.display = 'inline';
  });

  document.querySelector('a[href="https://tourism.gov.ru/agents/"]').addEventListener('click', () => {
    document.getElementById('agentLinkInput').style.display = 'block';
  });

// Обработчик ввода ссылки
  document.querySelector('#agentLinkInput input').addEventListener('change', (e) => {
    checks.agentLink = e.target.value;
  });

  iframe.fitSize('#checkInnContent');
}

cancelButton.addEventListener('click', () => {
  iframe.closePopup();
});

checkButton.addEventListener('click', async () => {
  const inn = innInput.value.trim();
  
  if (!inn || inn.length < 10) {
    iframe.showSnackbar('Введите корректный ИНН', 'warning');
    return;
  }

  try {
    results.style.display = 'none';
    setLoading(true);
    
    const response = await fetch(`https://mt.mosgortur.ru/MGTAPI/api/PartnerRequisites/${inn}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      setLoading(false);
      iframe.showSnackbar(`Ошибка: ${data.error}`, 'error');
      return;
    }

    setLoading(false);
    renderResults(data);

  } catch (error) {
    console.error('Error details:', error);
    iframe.showSnackbar('Ошибка при проверке ИНН. Проверьте консоль для деталей.', 'error');
    setLoading(false);
  }
});

// Обработчик для кнопки "Проверка завершена"
document.getElementById('completeCheck').addEventListener('click', async () => {
  // Формируем данные для сохранения
  const checkData = {
    companyData,
    checks,
    checkDate: new Date().toISOString()
  };

  // Сохраняем данные проверки и статус
  await iframe.setData('card', 'private', {
    innChecked: true,
    innCheckData: checkData
  });
  
  // Закрываем попап
  iframe.closePopup();
  iframe.showSnackbar('Результаты проверки сохранены в карточке', 'success');
});

innInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !innInput.disabled) {
    checkButton.click();
  }
});

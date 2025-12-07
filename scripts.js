
   document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('data-body');
    if (!tbody) return;

    const btnAll = document.getElementById('btn-all');
    const btnVielas = document.getElementById('btn-vielas');
    const btnInventars = document.getElementById('btn-inventars');

    let allItems = [];

    function formatId(prefix, id) {
        const num = String(id).padStart(4, '0');
        return prefix + num;
    }

    function renderTable(items) {
        tbody.innerHTML = '';

        if (!items || items.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = 'Nav datu, kas atbilst izvēlei.';
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.idDisplay}</td>
                <td>${item.nosaukums}</td>
                <td>${item.tips || ''}</td>
                <td>${item.apakstips || ''}</td>
                <td>${item.skaits != null ? item.skaits : ''}</td>
                <td>${item.stavoklis || ''}</td>
                <td>${item.komentari || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    Promise.all([
        fetch('inventars.json').then(r => r.json()),
        fetch('vielas.json').then(r => r.json())
    ])
        .then(([inventars, vielas]) => {
            const invItems = inventars.map(obj => ({
                category: 'inventars',
                idDisplay: formatId('I', obj.id),
                nosaukums: obj.nosaukums,
                tips: obj.tips || 'Inventārs',
                apakstips: obj.apakstips || '',
                skaits: obj.skaits,
                stavoklis: '',
                komentari: obj.komentari || ''
            }));

            const vItems = vielas.map(obj => ({
                category: 'viela',
                idDisplay: formatId('V', obj.id),
                nosaukums: obj.nosaukums,
                tips: 'Viela',
                apakstips: obj.apakstips || '',
                skaits: obj.skaits,
                stavoklis: '',
                komentari: obj.komentari || ''
            }));

            allItems = [...invItems, ...vItems];
            renderTable(allItems);
        })
        .catch(err => {
            console.error('Kļūda ielādējot JSON datnes:', err);
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = 'Kļūda ielādējot datus.';
            tr.appendChild(td);
            tbody.appendChild(tr);
        });

    if (btnAll) {
        btnAll.addEventListener('click', () => {
            renderTable(allItems);
        });
    }

    if (btnVielas) {
        btnVielas.addEventListener('click', () => {
            const filtered = allItems.filter(item => item.category === 'viela');
            renderTable(filtered);
        });
    }

    if (btnInventars) {
        btnInventars.addEventListener('click', () => {
            const filtered = allItems.filter(item => item.category === 'inventars');
            renderTable(filtered);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const participantList = document.getElementById('participantList');
    const createCheckFormBtn = document.getElementById('createCheckForm');
    const checkFormContainer = document.getElementById('checkFormContainer');
    const resultSection = document.getElementById('resultSection');
    const checkResult = document.getElementById('checkResult');
    const exportResultBtn = document.getElementById('exportResult');
    
    // チェックフォーム作成ボタンのイベントリスナー
    createCheckFormBtn.addEventListener('click', function() {
        const participants = participantList.value.trim().split('\n').filter(name => name.trim() !== '');
        
        if (participants.length === 0) {
            alert('参加者を入力してください');
            return;
        }
        
        createCheckForm(participants);
    });
    
    // チェックフォームの作成
    function createCheckForm(participants) {
        checkFormContainer.innerHTML = '';
        
        const form = document.createElement('form');
        form.id = 'attendanceForm';
        
        const heading = document.createElement('h2');
        heading.textContent = '参加者チェック';
        form.appendChild(heading);
        
        participants.forEach((name, index) => {
            const participantItem = document.createElement('div');
            participantItem.className = 'participant-item';
            
            const nameElement = document.createElement('div');
            nameElement.className = 'participant-name';
            nameElement.textContent = name;
            participantItem.appendChild(nameElement);
            
            const checkOptions = document.createElement('div');
            checkOptions.className = 'check-options';
            
            // 出席オプション
            const presentOption = document.createElement('label');
            presentOption.className = 'check-option';
            const presentInput = document.createElement('input');
            presentInput.type = 'radio';
            presentInput.name = `attendance-${index}`;
            presentInput.value = 'present';
            presentInput.required = true;
            presentOption.appendChild(presentInput);
            presentOption.appendChild(document.createTextNode('出席'));
            checkOptions.appendChild(presentOption);
            
            // 欠席オプション
            const absentOption = document.createElement('label');
            absentOption.className = 'check-option';
            const absentInput = document.createElement('input');
            absentInput.type = 'radio';
            absentInput.name = `attendance-${index}`;
            absentInput.value = 'absent';
            absentOption.appendChild(absentInput);
            absentOption.appendChild(document.createTextNode('欠席'));
            checkOptions.appendChild(absentOption);
            
            participantItem.appendChild(checkOptions);
            form.appendChild(participantItem);
        });
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'チェック結果を表示';
        form.appendChild(submitButton);
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showResults(participants);
        });
        
        checkFormContainer.appendChild(form);
    }
    
    // 結果の表示
    function showResults(participants) {
        checkResult.innerHTML = '';
        
        let presentCount = 0;
        let absentCount = 0;
        
        participants.forEach((name, index) => {
            const status = document.querySelector(`input[name="attendance-${index}"]:checked`).value;
            
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            if (status === 'present') {
                resultItem.innerHTML = `<span class="present">✓</span> ${name} - 出席`;
                presentCount++;
            } else {
                resultItem.innerHTML = `<span class="absent">✗</span> ${name} - 欠席`;
                absentCount++;
            }
            
            checkResult.appendChild(resultItem);
        });
        
        const summary = document.createElement('div');
        summary.className = 'summary';
        summary.innerHTML = `<p><strong>合計:</strong> ${participants.length}人中 ${presentCount}人出席, ${absentCount}人欠席</p>`;
        checkResult.appendChild(summary);
        
        resultSection.style.display = 'block';
    }
    
    // 結果のエクスポート
    exportResultBtn.addEventListener('click', function() {
        const resultText = checkResult.innerText;
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `参加者チェック_${new Date().toLocaleDateString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});
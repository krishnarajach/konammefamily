// Modals module
const Modals = (function() {
    // DOM elements
    const nodeModal = document.getElementById('node-modal');
    const requestModal = document.getElementById('request-modal');
    const modalClose = document.querySelectorAll('.close');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalActions = document.getElementById('modal-actions');
    const requestForm = document.getElementById('request-form');
    const requestFormFields = document.getElementById('request-form-fields');
    
    let currentNode = null;
    
    function init() {
        // Modal close buttons
        modalClose.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        // Request form submission
        requestForm.addEventListener('submit', handleSubmitRequest);
    }
    
    function showNodeDetails(node) {
        currentNode = node;
        modalTitle.textContent = `${node.name} ವಿವರಗಳು`;
        
        // Determine spouse label based on gender
        const spouseLabel = node.gender === 'male' ? 'ಹೆಂಡತಿ:' : 'ಗಂಡ:';
        
        const detailsHtml = `
            <p><strong>ಐಡಿ:</strong> ${node.id}</p>
            <p><strong>ಹೆಸರು:</strong> ${node.name}</p>
            <p><strong>ಲಿಂಗ:</strong> ${node.gender === 'male' ? 'ಗಂಡು' : 'ಹೆಣ್ಗಸು'}</p>
            <p><strong>${spouseLabel}</strong> ${node.spouse || 'ಇಲ್ಲ'}</p>
            <p><strong>ವಿಳಾಸ:</strong> ${node.address}</p>
            <p><strong>ಪಿನ್‌ಕೋಡ್:</strong> ${node.post}</p>
            <p><strong>ದೂರವಾಣಿ:</strong> ${node.phone.number} ${node.phone.hasWhatsApp ? '(WhatsApp)' : ''}</p>
            <p><strong>ವೃತ್ತಿ:</strong> ${node.profession}</p>
        `;
        
        modalBody.innerHTML = detailsHtml;
        
        // Set modal actions based on user login status
        modalActions.innerHTML = '';
        
        if (Auth.isLoggedIn()) {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'ಸಂಪಾದಿಸಿ';
            editBtn.addEventListener('click', () => editNode(node));
            modalActions.appendChild(editBtn);
        }
        
        const requestBtn = document.createElement('button');
        requestBtn.textContent = 'ಬದಲಾವಣೆಯನ್ನು ವಿನಂತಿಸಿ';
        requestBtn.addEventListener('click', () => showRequestForm(node));
        modalActions.appendChild(requestBtn);
        
        nodeModal.style.display = 'block';
    }
    
    function editNode(node) {
        closeModal();
        
        // In a real implementation, we would show an edit form
        // For simplicity, we'll just show an alert
        alert(`${node.name} ಗಾಗಿ ಸಂಪಾದನೆ ಕಾರ್ಯಕ್ರಮ್ ಇಲ್ಲ ಅನ್ವಲಂಬನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ`);
    }
    
    function showRequestForm(node) {
        currentNode = node;
        closeModal();
        
        requestFormFields.innerHTML = '';
        
        // Determine spouse label based on gender
        const spouseLabel = node.gender === 'male' ? 'ಹೆಂಡತಿ' : 'ಗಂಡ';
        
        // Create form fields for each editable property
        const fields = [
            { key: 'name', label: 'ಹೆಸರು', type: 'text' },
            { key: 'spouse', label: spouseLabel, type: 'text' },
            { key: 'address', label: 'ವಿಳಾಸ', type: 'text' },
            { key: 'post', label: 'ಪಿನ್‌ಕೋಡ್', type: 'text' },
            { key: 'phone', label: 'ದೂರವಾಣಿ', type: 'text' },
            { key: 'hasWhatsApp', label: 'WhatsApp', type: 'select' },
            { key: 'profession', label: 'ವೃತ್ತಿ', type: 'text' }
        ];
        
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = field.label + ':';
            
            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                input.name = field.key;
                
                const optionYes = document.createElement('option');
                optionYes.value = 'true';
                optionYes.textContent = 'ಹೌದು';
                if (node.phone.hasWhatsApp) optionYes.selected = true;
                
                const optionNo = document.createElement('option');
                optionNo.value = 'false';
                optionNo.textContent = 'ಇಲ್ಲ';
                if (!node.phone.hasWhatsApp) optionNo.selected = true;
                
                input.appendChild(optionYes);
                input.appendChild(optionNo);
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.name = field.key;
                input.value = field.key === 'phone' ? node.phone.number : (node[field.key] || '');
                
                // Add pattern validation for pincode
                if (field.key === 'post') {
                    input.setAttribute('pattern', '[0-9]{6}');
                    input.setAttribute('title', 'ದಯವಿಟ್ಟು 6 ಅಂಕಿಗಳ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ');
                    input.setAttribute('maxlength', '6');
                }
            }
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            requestFormFields.appendChild(formGroup);
        });
        
        requestModal.style.display = 'block';
    }
    
    function handleSubmitRequest(e) {
        e.preventDefault();
        
        const formData = new FormData(requestForm);
        const changes = {};
        
        // Collect changes
        for (const [key, value] of formData.entries()) {
            if (key === 'phone') {
                if (currentNode.phone.number !== value) {
                    changes.phone = {
                        old: currentNode.phone.number,
                        new: value
                    };
                }
            } else if (key === 'hasWhatsApp') {
                if (currentNode.phone.hasWhatsApp !== (value === 'true')) {
                    changes.hasWhatsApp = {
                        old: currentNode.phone.hasWhatsApp ? 'ಹೌದು' : 'ಇಲ್ಲ',
                        new: value === 'true' ? 'ಹೌದು' : 'ಇಲ್ಲ'
                    };
                }
            } else if (key === 'spouse') {
                const currentSpouse = currentNode.spouse || '';
                if (currentSpouse !== value) {
                    changes.spouse = {
                        old: currentSpouse || 'ಇಲ್ಲ',
                        new: value || 'ಇಲ್ಲ'
                    };
                }
            } else if (currentNode[key] !== value) {
                changes[key] = {
                    old: currentNode[key] || '',
                    new: value
                };
            }
        }
        
        if (Object.keys(changes).length === 0) {
            alert('ಯಾವುದೇ ಬದಲಾವಣೆಗಳನ್ನು ಪತ್ತೆಹೋದಿಲ್ಲ');
            return;
        }
        
        // Create request object
        const request = {
            id: 'REQ' + Date.now(),
            nodeId: currentNode.id,
            changes: changes,
            status: 'pending',
            requestedBy: Auth.getCurrentUser() ? Auth.getCurrentUser().username : 'guest',
            comments: document.getElementById('request-comments').value
        };
        
        // Add to requests
        Admin.addRequest(request);
        
        // Show success message
        alert('ಬದಲಾವಣೆಯನ್ನು ಯಶಸ್ವಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ');
        closeModal();
    }
    
    function closeModal() {
        nodeModal.style.display = 'none';
        requestModal.style.display = 'none';
        document.getElementById('login-modal').style.display = 'none';
    }
    
    return {
        init,
        showNodeDetails,
        closeModal
    };
})();
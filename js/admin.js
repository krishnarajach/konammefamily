// Admin module
const Admin = (function() {
    // DOM elements
    const requestsList = document.getElementById('requests-list');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    let requests = [];
    
    function init() {
        // Set up event listeners
        exportBtn.addEventListener('click', exportData);
        importBtn.addEventListener('click', importData);
        
        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        loadRequests();
        
        // Add template download buttons
        addTemplateButtons();
    }
    
    function addTemplateButtons() {
        const importSection = document.querySelector('.import-section');
        
        // Create template buttons container
        const templateButtons = document.createElement('div');
        templateButtons.className = 'template-buttons';
        
        // JSON Template Button
        const jsonTemplateBtn = document.createElement('button');
        jsonTemplateBtn.textContent = 'JSON ಟೆಂಪ್ಲೇಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ';
        jsonTemplateBtn.style.backgroundColor = '#4a6baf';
        jsonTemplateBtn.addEventListener('click', downloadJsonTemplate);
        
        // CSV Template Button
        const csvTemplateBtn = document.createElement('button');
        csvTemplateBtn.textContent = 'CSV ಟೆಂಪ್ಲೇಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ';
        csvTemplateBtn.style.backgroundColor = '#28a745';
        csvTemplateBtn.addEventListener('click', downloadCsvTemplate);
        
        templateButtons.appendChild(jsonTemplateBtn);
        templateButtons.appendChild(csvTemplateBtn);
        
        // Insert before the file input
        importSection.insertBefore(templateButtons, importSection.firstChild);
    }
    
    function downloadJsonTemplate() {
        const template = {
            "nodes": [
                {
                    "id": "0000000001",
                    "name": "ಕುಟುಂಬದ ಮುಖ್ಯರ ಹೆಸರು",
                    "gender": "male",
                    "address": "ವಿಳಾಸ",
                    "post": "560001",
                    "phone": {
                        "number": "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
                        "hasWhatsApp": true
                    },
                    "profession": "ವೃತ್ತಿ",
                    "parentId": null,
                    "children": ["0000000002", "0000000003"],
                    "spouse": "ಪತ್ನಿಯ ಹೆಸರು"
                },
                {
                    "id": "0000000002",
                    "name": "ಮಗನ ಹೆಸರು",
                    "gender": "male",
                    "address": "ಮಗನ ವಿಳಾಸ",
                    "post": "560002",
                    "phone": {
                        "number": "ಮಗನ ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
                        "hasWhatsApp": false
                    },
                    "profession": "ಮಗನ ವೃತ್ತಿ",
                    "parentId": "0000000001",
                    "children": ["0000000004"],
                    "spouse": "ಮಗನ ಪತ್ನಿಯ ಹೆಸರು"
                },
                {
                    "id": "0000000003",
                    "name": "ಮಗಳ ಹೆಸರು",
                    "gender": "female",
                    "address": "ಮಗಳ ವಿಳಾಸ",
                    "post": "560003",
                    "phone": {
                        "number": "ಮಗಳ ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
                        "hasWhatsApp": true
                    },
                    "profession": "ಮಗಳ ವೃತ್ತಿ",
                    "parentId": "0000000001",
                    "children": [],
                    "spouse": "ಮಗಳ ಪತಿಯ ಹೆಸರು"
                }
            ]
        };
        
        const dataStr = JSON.stringify(template, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'familyTreeTemplate.json');
        linkElement.click();
    }
    
    function downloadCsvTemplate() {
        // Create CSV header
        const headers = [
            'id', 'name', 'gender', 'spouse', 'address', 'post', 
            'phone_number', 'hasWhatsApp', 'profession', 'parentId', 'children'
        ];
        
        // Create sample data rows
        const sampleData = [
            [
                '0000000001', 'ಕುಟುಂಬದ ಮುಖ್ಯರ ಹೆಸರು', 'male', 'ಪತ್ನಿಯ ಹೆಸರು', 'ವಿಳಾಸ', '560001', 
                'ದೂರವಾಣಿ ಸಂಖ್ಯೆ', 'true', 'ವೃತ್ತಿ', '', '0000000002,0000000003'
            ],
            [
                '0000000002', 'ಮಗನ ಹೆಸರು', 'male', 'ಮಗನ ಪತ್ನಿಯ ಹೆಸರು', 'ಮಗನ ವಿಳಾಸ', '560002', 
                'ಮಗನ ದೂರವಾಣಿ ಸಂಖ್ಯೆ', 'false', 'ಮಗನ ವೃತ್ತಿ', '0000000001', '0000000004'
            ],
            [
                '0000000003', 'ಮಗಳ ಹೆಸರು', 'female', 'ಮಗಳ ಪತಿಯ ಹೆಸರು', 'ಮಗಳ ವಿಳಾಸ', '560003', 
                'ಮಗಳ ದೂರವಾಣಿ ಸಂಖ್ಯೆ', 'true', 'ಮಗಳ ವೃತ್ತಿ', '0000000001', ''
            ]
        ];
        
        // Combine headers and data
        const csvContent = [
            headers.join(','),
            ...sampleData.map(row => 
                row.map(field => `"${field}"`).join(',')
            )
        ].join('\n');
        
        // Create download link
        const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'familyTreeTemplate.csv');
        linkElement.click();
    }
    
    function loadRequests() {
        // Try to load from localStorage first
        const savedRequests = localStorage.getItem('changeRequests');
        if (savedRequests) {
            requests = JSON.parse(savedRequests);
        } else {
            // If no saved data, use initial data
            requests = [
                {
                    id: "REQ001",
                    nodeId: "0000000001",
                    changes: {
                        address: {
                            old: "123 Temple St, Chennai",
                            new: "123 Temple St, Chennai - 600001"
                        },
                        post: {
                            old: "560001",
                            new: "560068"
                        },
                        spouse: {
                            old: "ಲಲಿತಾ ಶರ್ಮಾ",
                            new: "ಲಲಿತಾ ರಾಜ್ ಶರ್ಮಾ"
                        }
                    },
                    status: "pending",
                    requestedBy: "guest",
                    comments: "Updated address, pincode and spouse name"
                }
            ];
            // Save initial data to localStorage
            saveRequests();
        }
    }
    
    function saveRequests() {
        localStorage.setItem('changeRequests', JSON.stringify(requests));
    }
    
    function renderRequests() {
        requestsList.innerHTML = '';
        
        const pendingRequests = requests.filter(req => req.status === 'pending');
        
        if (pendingRequests.length === 0) {
            requestsList.innerHTML = '<p>ಬಾಕಿ ಇರುವ ಬದಲಾವಣೆ ವಿನಂತಿಗಳಿಲ್ಲ</p>';
            return;
        }
        
        pendingRequests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.className = 'request-item';
            
            const node = Tree.getNodeById(request.nodeId);
            
            const requestHeader = document.createElement('div');
            requestHeader.className = 'request-header';
            requestHeader.innerHTML = `
                <strong>${node.name} (${request.id})</strong>
                <span>ಅವರಿಂದ: ${request.requestedBy}</span>
            `;
            
            const requestChanges = document.createElement('div');
            requestChanges.className = 'request-changes';
            
            // Create individual change items with approve/reject buttons
            Object.entries(request.changes).forEach(([field, change]) => {
                const changeItem = document.createElement('div');
                changeItem.className = 'change-item';
                
                const changeText = document.createElement('div');
                changeText.className = 'change-text';
                changeText.innerHTML = `<strong>${getFieldLabel(field)}:</strong> ${change.old} → ${change.new}`;
                
                const changeActions = document.createElement('div');
                changeActions.className = 'change-actions';
                
                const approveChangeBtn = document.createElement('button');
                approveChangeBtn.className = 'approve-change-btn';
                approveChangeBtn.textContent = 'ಅನುಮೋದಿಸಿ';
                approveChangeBtn.addEventListener('click', () => approveChange(request.id, field));
                
                const rejectChangeBtn = document.createElement('button');
                rejectChangeBtn.className = 'reject-change-btn';
                rejectChangeBtn.textContent = 'ತಿರಸ್ಕರಿಸಿ';
                rejectChangeBtn.addEventListener('click', () => rejectChange(request.id, field));
                
                changeActions.appendChild(approveChangeBtn);
                changeActions.appendChild(rejectChangeBtn);
                
                changeItem.appendChild(changeText);
                changeItem.appendChild(changeActions);
                
                requestChanges.appendChild(changeItem);
            });
            
            // Add comments section
            if (request.comments) {
                const commentsSection = document.createElement('div');
                commentsSection.className = 'request-comments';
                commentsSection.innerHTML = `<strong>ಕಾಮೆಂಟ್‌ಗಳು:</strong> ${request.comments}`;
                requestChanges.appendChild(commentsSection);
            }
            
            requestItem.appendChild(requestHeader);
            requestItem.appendChild(requestChanges);
            
            requestsList.appendChild(requestItem);
        });
    }
    
    function getFieldLabel(field) {
        const labels = {
            'name': 'ಹೆಸರು',
            'address': 'ವಿಳಾಸ',
            'post': 'ಪಿನ್‌ಕೋಡ್',
            'phone': 'ದೂರವಾಣಿ',
            'hasWhatsApp': 'WhatsApp',
            'profession': 'ವೃತ್ತಿ',
            'spouse': 'ಪತಿ/ಪತ್ನಿ'
        };
        return labels[field] || field;
    }
    
    function approveChange(requestId, field) {
        const request = requests.find(req => req.id === requestId);
        if (!request || !request.changes[field]) return;
        
        // Apply the specific change to the node
        const node = Tree.getNodeById(request.nodeId);
        if (!node) return;
        
        const change = request.changes[field];
        
        if (field === 'phone') {
            node.phone.number = change.new;
        } else if (field === 'hasWhatsApp') {
            node.phone.hasWhatsApp = change.new === 'ಹೌದು';
        } else if (field === 'spouse') {
            node.spouse = change.new === 'ಇಲ್ಲ' ? '' : change.new;
        } else {
            node[field] = change.new;
        }
        
        // Remove the approved change from the request
        delete request.changes[field];
        
        // If all changes are processed, update request status
        if (Object.keys(request.changes).length === 0) {
            request.status = 'approved';
        }
        
        // Save both family data and requests to localStorage
        Tree.saveData();
        saveRequests();
        
        // Re-render tree and requests
        if (Sidebar.getCurrentSubFamily()) {
            Tree.renderSubFamily(Sidebar.getCurrentSubFamily());
        } else {
            Tree.renderTree();
        }
        renderRequests();
        
        alert('ಬದಲಾವಣೆಯನ್ನು ಯಶಸ್ವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ');
    }
    
    function rejectChange(requestId, field) {
        const request = requests.find(req => req.id === requestId);
        if (!request || !request.changes[field]) return;
        
        // Remove the rejected change from the request
        delete request.changes[field];
        
        // If all changes are processed, update request status
        if (Object.keys(request.changes).length === 0) {
            request.status = 'rejected';
        }
        
        // Save requests to localStorage
        saveRequests();
        
        // Re-render requests
        renderRequests();
        
        alert('ಬದಲಾವಣೆಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ');
    }
    
    function approveRequest(requestId) {
        const request = requests.find(req => req.id === requestId);
        if (!request) return;
        
        // Apply all changes to node
        const node = Tree.getNodeById(request.nodeId);
        if (!node) return;
        
        for (const [field, change] of Object.entries(request.changes)) {
            if (field === 'phone') {
                node.phone.number = change.new;
            } else if (field === 'hasWhatsApp') {
                node.phone.hasWhatsApp = change.new === 'ಹೌದು';
            } else if (field === 'spouse') {
                node.spouse = change.new === 'ಇಲ್ಲ' ? '' : change.new;
            } else {
                node[field] = change.new;
            }
        }
        
        // Update request status
        request.status = 'approved';
        
        // Save both family data and requests to localStorage
        Tree.saveData();
        saveRequests();
        
        // Re-render tree and requests
        if (Sidebar.getCurrentSubFamily()) {
            Tree.renderSubFamily(Sidebar.getCurrentSubFamily());
        } else {
            Tree.renderTree();
        }
        renderRequests();
        
        alert('ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ');
    }
    
    function rejectRequest(requestId) {
        const request = requests.find(req => req.id === requestId);
        if (!request) return;
        
        // Update request status
        request.status = 'rejected';
        
        // Save requests to localStorage
        saveRequests();
        
        // Re-render requests
        renderRequests();
        
        alert('ವಿನಂತಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ');
    }
    
    function exportData() {
        const dataStr = JSON.stringify(Tree.getFamilyData(), null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'familyTree.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    function importData() {
        const file = importFile.files[0];
        if (!file) {
            alert('ದಯವಿಟ್ಟು ಮೊದಲು ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let importedData;
                const fileExtension = file.name.split('.').pop().toLowerCase();
                
                if (fileExtension === 'json') {
                    importedData = JSON.parse(e.target.result);
                } else if (fileExtension === 'csv') {
                    importedData = parseCsvData(e.target.result);
                } else {
                    alert('ದೋಷ: ಕೇವಲ JSON ಅಥವಾ CSV ಫೈಲ್‌ಗಳನ್ನು ಮಾತ್ರ ಇಂಪೋರ್ಟ್ ಮಾಡಬಹುದು');
                    return;
                }
                
                // Validate the imported data structure
                if (!validateImportedData(importedData)) {
                    return;
                }
                
                // Validate pincodes in imported data
                if (!validatePincodes(importedData)) {
                    return;
                }
                
                // Confirm before importing
                if (confirm('ಈ ದತ್ತವನ್ನು ಇಂಪೋರ್ಟ್ ಮಾಡಲು ಖಚಿತವಾಗಿ ಬಯಸುತ್ತೀರಾ? ಈ ಕ್ರಿಯೆಯು ಪ್ರಸ್ತುತ ದತ್ತವನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ.')) {
                    Tree.setFamilyData(importedData);
                    Sidebar.renderSubFamilies();
                    
                    if (Sidebar.getCurrentSubFamily()) {
                        Tree.renderSubFamily(Sidebar.getCurrentSubFamily());
                    } else {
                        Tree.renderTree();
                    }
                    
                    // Clear the file input
                    importFile.value = '';
                    
                    alert('ದತ್ತವನ್ನು ಯಶಸ್ವಾಗಿ ಇಂಪೋರ್ಟ್ ಮಾಡಲಾಗಿದೆ');
                }
            } catch (error) {
                alert('ದತ್ತವನ್ನು ಇಂಪೋರ್ಟ್ ಮಾಡುವಾಗಿ ದೋಷ: ' + error.message);
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }
    
    function validatePincodes(data) {
        for (let i = 0; i < data.nodes.length; i++) {
            const node = data.nodes[i];
            
            if (node.post && !/^\d{6}$/.test(node.post)) {
                alert(`ದೋಷ: ನೋಡ್ ${i + 1} (${node.name}) ರಲ್ಲಿ ಅಮಾನ್ಯ ಪಿನ್‌ಕೋಡ್. ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕಿಗಳನ್ನು ಹೊಂದಿರಬೇಕು.`);
                return false;
            }
        }
        return true;
    }
    
    function parseCsvData(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('CSV ಫೈಲ್ ಕನಿಷ್ಠ ಹೆಡರ್ ಮತ್ತು ಒಂದು ಡೇಟಾ ಸಾಲನ್ನು ಹೊಂದಿರಬೇಕು');
        }
        
        // Parse header
        const headers = lines[0].split(',').map(header => 
            header.replace(/^"|"$/g, '').trim()
        );
        
        // Parse data rows
        const nodes = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => 
                value.replace(/^"|"$/g, '').trim()
            );
            
            if (values.length !== headers.length) {
                throw new Error(`ಸಾಲು ${i + 1} ರಲ್ಲಿ ಸರಿಯಾದ ಸಂಖ್ಯೆಯ ಕಾಲಮ್‌ಗಳು ಇಲ್ಲ`);
            }
            
            // Create node object
            const node = {};
            headers.forEach((header, index) => {
                const value = values[index];
                
                switch (header) {
                    case 'id':
                    case 'name':
                    case 'gender':
                    case 'address':
                    case 'post':
                    case 'profession':
                        node[header] = value;
                        break;
                    case 'spouse':
                        node.spouse = value || '';
                        break;
                    case 'phone_number':
                        if (!node.phone) node.phone = {};
                        node.phone.number = value;
                        break;
                    case 'hasWhatsApp':
                        if (!node.phone) node.phone = {};
                        node.phone.hasWhatsApp = value.toLowerCase() === 'true';
                        break;
                    case 'parentId':
                        node.parentId = value || null;
                        break;
                    case 'children':
                        node.children = value ? value.split(',').filter(id => id.trim() !== '') : [];
                        break;
                }
            });
            
            nodes.push(node);
        }
        
        return { nodes };
    }
    
    function validateImportedData(data) {
        // Check if data has the required structure
        if (!data || typeof data !== 'object') {
            alert('ದೋಷ: ದತ್ತವು ಒಂದು ವಸ್ತುವಾಗಿರಬೇಕು');
            return false;
        }
        
        if (!data.nodes || !Array.isArray(data.nodes)) {
            alert('ದೋಷ: ದತ್ತವು "nodes" ಎಂಬ ಶ್ರೇಣಿಯನ್ನು ಹೊಂದಿರಬೇಕು');
            return false;
        }
        
        // Validate each node
        for (let i = 0; i < data.nodes.length; i++) {
            const node = data.nodes[i];
            
            // Check required fields
            const requiredFields = ['id', 'name', 'gender', 'address', 'post', 'phone', 'profession'];
            for (const field of requiredFields) {
                if (node[field] === undefined || node[field] === null || node[field] === '') {
                    alert(`ದೋಷ: ನೋಡ್ ${i + 1} ರಲ್ಲಿ "${field}" ಕ್ಷೇತ್ರ ಕಾಣೆಯಾಗಿದೆ ಅಥವಾ ಖಾಲಿಯಾಗಿದೆ`);
                    return false;
                }
            }
            
            // Validate phone object
            if (!node.phone || typeof node.phone !== 'object' || !node.phone.number) {
                alert(`ದೋಷ: ನೋಡ್ ${i + 1} ರಲ್ಲಿ ಅಮಾನ್ಯ ಫೋನ್ ಮಾಹಿತಿ`);
                return false;
            }
            
            // Validate gender
            if (node.gender !== 'male' && node.gender !== 'female') {
                alert(`ದೋಷ: ನೋಡ್ ${i + 1} ರಲ್ಲಿ ಲಿಂಗ "male" ಅಥವಾ "female" ಆಗಿರಬೇಕು`);
                return false;
            }
        }
        
        return true;
    }
    
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        tabContents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    function addRequest(request) {
        requests.push(request);
        saveRequests(); // Save to localStorage after adding new request
        renderRequests();
    }
    
    return {
        init,
        renderRequests,
        addRequest
    };
})();
// Tree module
const Tree = (function() {
    // DOM elements
    const familyTree = document.getElementById('family-tree');
    
    let familyData = {};
    
    function init() {
        loadData();
        renderTree();
    }
    
    function loadData() {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('familyData');
        if (savedData) {
            familyData = JSON.parse(savedData);
        } else {
            // If no saved data, use initial data
            familyData = {
                nodes: [
                    {
                        id: "0000000001",
                        name: "ರಾಜ್ ಶರ್ಮಾ ಕುಟುಂಬಂ",
                        gender: "male",
                        address: "123 ಟೆಂಪಲ್ ಸ್ಟ್ರೀಟ್, ಚೆನ್ನೈ",
                        post: "560001",
                        phone: {
                            number: "+919876543210",
                            hasWhatsApp: true
                        },
                        profession: "ಅರ್ಚಕ",
                        parentId: null,
                        children: ["0000000002", "0000000003"],
                        spouse: "ಲಲಿತಾ ಶರ್ಮಾ"
                    },
                    {
                        id: "0000000002",
                        name: "ಅರುಣ್ ಶರ್ಮಾ",
                        gender: "male",
                        address: "456 ಬ್ರಾಹ್ಮಣ್ ಸ್ಟ್ರೀಟ್, ಮುಂಬೈ",
                        post: "560002",
                        phone: {
                            number: "+919876543211",
                            hasWhatsApp: false
                        },
                        profession: "ಶಿಕ್ಷಕ",
                        parentId: "0000000001",
                        children: ["0000000004"],
                        spouse: "ಪ್ರಿಯಾ ಶರ್ಮಾ"
                    },
                    {
                        id: "0000000003",
                        name: "ಪ್ರಿಯಾ ಶರ್ಮಾ",
                        gender: "female",
                        address: "789 ಪಾರ್ಕ್ ಅವೆ, ದೆಹಲಿ",
                        post: "560003",
                        phone: {
                            number: "+919876543212",
                            hasWhatsApp: true
                        },
                        profession: "ವೈದ್ಯೆ",
                        parentId: "0000000001",
                        children: [],
                        spouse: "ವಿಕಾಸ್ ಶರ್ಮಾ"
                    },
                    {
                        id: "0000000004",
                        name: "ವಿಕ್ರಮ್ ಶರ್ಮಾ",
                        gender: "male",
                        address: "321 ಮಾರ್ಕೆಟ್ ರೋಡ್, ಬೆಂಗಳೂರು",
                        post: "560004",
                        phone: {
                            number: "+919876543213",
                            hasWhatsApp: true
                        },
                        profession: "ಇಂಜಿನಿಯರ್",
                        parentId: "0000000002",
                        children: [],
                        spouse: ""
                    },
                    {
                        id: "0000000005",
                        name: "ವಿಕ್ರಮ್ ವರ್ಮಾ ಕುಟುಂಬಂ",
                        gender: "male",
                        address: "654 ಲೇಕ್ ವ್ಯೂ, ಪುಣೆ",
                        post: "560005",
                        phone: {
                            number: "+919876543214",
                            hasWhatsApp: true
                        },
                        profession: "ವ್ಯಾಪಾರಿ",
                        parentId: null,
                        children: ["0000000006", "0000000007"],
                        spouse: "ಅನಿತಾ ವರ್ಮಾ"
                    },
                    {
                        id: "0000000006",
                        name: "ಅನನ್ಯಾ ವರ್ಮಾ",
                        gender: "female",
                        address: "987 ಗಾರ್ಡನ್ ಸಿಟಿ, ಪುಣೆ",
                        post: "560006",
                        phone: {
                            number: "+919876543215",
                            hasWhatsApp: true
                        },
                        profession: "ಆರ್ಕಿಟೆಕ್ಟ್",
                        parentId: "0000000005",
                        children: [],
                        spouse: ""
                    },
                    {
                        id: "0000000007",
                        name: "ರಾಹುಲ್ ವರ್ಮಾ",
                        gender: "male",
                        address: "654 ಲೇಕ್ ವ್ಯೂ, ಪುಣೆ",
                        post: "560007",
                        phone: {
                            number: "+919876543216",
                            hasWhatsApp: false
                        },
                        profession: "ವಿದ್ಯಾರ್ಥಿ",
                        parentId: "0000000005",
                        children: [],
                        spouse: ""
                    },
                    {
                        id: "0000000008",
                        name: "ಸುರೇಶ್ ಅಯ್ಯರ್ ಕುಟುಂಬಂ",
                        gender: "male",
                        address: "111 ಬೀಚ್ ರೋಡ್, ಗೋವಾ",
                        post: "560008",
                        phone: {
                            number: "+919876543217",
                            hasWhatsApp: true
                        },
                        profession: "ವಕೀಲ್ಟರ್",
                        parentId: null,
                        children: ["0000000009"],
                        spouse: "ಮೀನಾ ಅಯ್ಯರ್"
                    },
                    {
                        id: "0000000009",
                        name: "ಮೀನಾ ಅಯ್ಯರ್",
                        gender: "female",
                        address: "111 ಬೀಚ್ ರೋಡ್, ಗೋವಾ",
                        post: "560009",
                        phone: {
                            number: "+919876543218",
                            hasWhatsApp: true
                        },
                        profession: "ಗೃಹಿಣಿ",
                        parentId: "0000000008",
                        children: [],
                        spouse: "ಸುರೇಶ್ ಅಯ್ಯರ್"
                    }
                ]
            };
            // Save initial data to localStorage
            saveData();
        }
    }
    
    function saveData() {
        localStorage.setItem('familyData', JSON.stringify(familyData));
    }
    
    function renderTree() {
        familyTree.innerHTML = '';
        
        // Find root nodes (nodes without parent)
        const rootNodes = familyData.nodes.filter(node => node.parentId === null);
        
        const treeUl = document.createElement('ul');
        rootNodes.forEach(rootNode => {
            const treeElement = createTreeElement(rootNode);
            treeUl.appendChild(treeElement);
        });
        
        familyTree.appendChild(treeUl);
    }
    
    function renderSubFamily(rootNodeId) {
        familyTree.innerHTML = '';
        
        const rootNode = familyData.nodes.find(node => node.id === rootNodeId);
        if (!rootNode) return;
        
        const treeUl = document.createElement('ul');
        const treeElement = createTreeElement(rootNode);
        treeUl.appendChild(treeElement);
        
        familyTree.appendChild(treeUl);
    }
    
    function createTreeElement(node) {
        const li = document.createElement('li');
        
        const nodeDiv = document.createElement('div');
        nodeDiv.className = `node ${node.gender}`;
        nodeDiv.dataset.id = node.id;
        
        const nodeInfo = document.createElement('div');
        nodeInfo.className = 'node-info';
        
        const nodeName = document.createElement('div');
        nodeName.className = 'node-name';
        
        // Add spouse name if available
        if (node.spouse && node.spouse.trim() !== '') {
            nodeName.textContent = `${node.name} & ${node.spouse}`;
        } else {
            nodeName.textContent = node.name;
        }
        
        const nodeGender = document.createElement('div');
        nodeGender.className = 'node-gender';
        nodeGender.textContent = node.gender === 'male' ? 'ಗಂ' : 'ಹೆ';
        
        nodeInfo.appendChild(nodeName);
        nodeInfo.appendChild(nodeGender);
        
        // Create icons container
        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'icons-container';
        
        // Add info icon
        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon';
        infoIcon.textContent = 'ℹ️';
        infoIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            Modals.showNodeDetails(node);
        });
        
        iconsContainer.appendChild(infoIcon);
        
        // Add expand/collapse icon for male nodes with children
        if (node.gender === 'male' && node.children && node.children.length > 0) {
            const expandIcon = document.createElement('span');
            expandIcon.className = 'expand-icon';
            expandIcon.textContent = '−'; // Minus sign for expanded state (children shown by default)
            expandIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleChildren(node, expandIcon);
            });
            iconsContainer.appendChild(expandIcon);
        }
        
        nodeInfo.appendChild(iconsContainer);
        nodeDiv.appendChild(nodeInfo);
        
        // Add click event to the node
        nodeDiv.addEventListener('click', () => {
            Modals.showNodeDetails(node);
        });
        
        li.appendChild(nodeDiv);
        
        // Add children container (shown by default now)
        if (node.children && node.children.length > 0) {
            const childrenUl = document.createElement('ul');
            childrenUl.className = 'children';
            
            node.children.forEach(childId => {
                const childNode = familyData.nodes.find(n => n.id === childId);
                if (childNode) {
                    const childElement = createTreeElement(childNode);
                    childrenUl.appendChild(childElement);
                }
            });
            
            li.appendChild(childrenUl);
        }
        
        return li;
    }
    
    function toggleChildren(node, icon) {
        const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`).parentElement;
        const childrenUl = nodeElement.querySelector('.children');
        
        if (childrenUl.classList.contains('hidden')) {
            childrenUl.classList.remove('hidden');
            icon.textContent = '−'; // Minus sign when expanded
        } else {
            childrenUl.classList.add('hidden');
            icon.textContent = '+'; // Plus sign when collapsed
        }
    }
    
    function getNodeById(nodeId) {
        return familyData.nodes.find(node => node.id === nodeId);
    }
    
    function updateNode(nodeId, updates) {
        const node = getNodeById(nodeId);
        if (!node) return false;
        
        Object.assign(node, updates);
        saveData(); // Save to localStorage after update
        return true;
    }
    
    function getFamilyData() {
        return familyData;
    }
    
    function setFamilyData(data) {
        familyData = data;
        saveData(); // Save to localStorage after setting new data
    }
    
    function getRootNodes() {
        return familyData.nodes.filter(node => node.parentId === null);
    }
    
    return {
        init,
        renderTree,
        renderSubFamily,
        getNodeById,
        updateNode,
        getFamilyData,
        setFamilyData,
        getRootNodes,
        saveData
    };
})();
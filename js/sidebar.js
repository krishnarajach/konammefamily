// Sidebar module for sub-families
const Sidebar = (function() {
    // DOM elements
    const subFamiliesList = document.getElementById('sub-families-list');
    const showAllBtn = document.getElementById('show-all-btn');
    
    let currentSubFamily = null;
    
    function init() {
        // Set up event listeners
        showAllBtn.addEventListener('click', showAllFamilies);
    }
    
    function renderSubFamilies() {
        subFamiliesList.innerHTML = '';
        
        // Get root nodes (nodes without parent)
        const rootNodes = Tree.getRootNodes();
        
        rootNodes.forEach(rootNode => {
            const subFamilyItem = document.createElement('div');
            subFamilyItem.className = 'sub-family-item';
            subFamilyItem.dataset.nodeId = rootNode.id;
            
            const subFamilyName = document.createElement('div');
            subFamilyName.className = 'sub-family-name';
            subFamilyName.textContent = rootNode.name;
            
            const subFamilyCount = document.createElement('div');
            subFamilyCount.className = 'sub-family-count';
            subFamilyCount.textContent = `${countDescendants(rootNode)} ಸದಸ್ಯರು`;
            
            subFamilyItem.appendChild(subFamilyName);
            subFamilyItem.appendChild(subFamilyCount);
            
            subFamilyItem.addEventListener('click', () => {
                showSubFamily(rootNode.id);
            });
            
            subFamiliesList.appendChild(subFamilyItem);
        });
    }
    
    function countDescendants(node) {
        let count = 1; // Count the node itself
        
        if (node.children && node.children.length > 0) {
            node.children.forEach(childId => {
                const childNode = Tree.getNodeById(childId);
                if (childNode) {
                    count += countDescendants(childNode);
                }
            });
        }
        
        return count;
    }
    
    function showSubFamily(nodeId) {
        currentSubFamily = nodeId;
        
        // Update active state in sidebar
        document.querySelectorAll('.sub-family-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`.sub-family-item[data-node-id="${nodeId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        // Render only the selected sub-family
        Tree.renderSubFamily(nodeId);
    }
    
    function showAllFamilies() {
        currentSubFamily = null;
        
        // Remove active state from all sidebar items
        document.querySelectorAll('.sub-family-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Render the entire family tree
        Tree.renderTree();
    }
    
    function getCurrentSubFamily() {
        return currentSubFamily;
    }
    
    return {
        init,
        renderSubFamilies,
        showSubFamily,
        showAllFamilies,
        getCurrentSubFamily
    };
})();
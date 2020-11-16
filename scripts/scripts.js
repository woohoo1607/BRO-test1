window.addEventListener('load', () => {
  initial();
});

const initial = () => {
  const size = 4;
  const root = document.getElementById('root');
  const headerRoot = createElement('div', 'header-root');
  const bodyRoot = createElement('div', 'body-root');
  const footerRoot = createElement('div', 'footer-root');
  const leftBodyRoot = createElement('div', 'left-body-root');
  const rightBodyRoot = createElement('div', 'right-body-root');
  const table = createElement('div', '', 'table');
  const addColumnBtn = createElement('button', 'item button add-button');
  const addLineBtn = createElement('button', 'item button add-button');

  for (let i = 0; i < size; i++) {
    createDeleteBtn(leftBodyRoot, table, false, headerRoot);
    createDeleteBtn(headerRoot, table, true, leftBodyRoot);
    const line = createElement('div', 'line');
    for (let j = 0; j < size; j++) {
      const item = createElement('div', 'item')
      addElement(line, item)
    }
    addElement(table, line);
  }

  addColumnBtn.addEventListener('click', () => {
    for (let i = 0; i < table.childNodes.length; i++) {
      addElement(table.childNodes[i], createElement('div', 'item'))
    }
    createDeleteBtn(headerRoot, table, true, leftBodyRoot);
  });

  addLineBtn.addEventListener('click', () => {
    const line = createElement('div', 'line');
    for (let j = 0; j < table.childNodes[0].childNodes.length; j++) {
      const item = createElement('div', 'item')
      addElement(line, item)
    }
    addElement(table, line);
    createDeleteBtn(leftBodyRoot, table, false, headerRoot);
  })

  addElement(rightBodyRoot, addColumnBtn);
  addElement(footerRoot, addLineBtn);
  addElement(bodyRoot, leftBodyRoot);
  addElement(bodyRoot, table);
  addElement(bodyRoot, rightBodyRoot);
  addElement(root, headerRoot);
  addElement(root, bodyRoot);
  addElement(root, footerRoot);

  root.addEventListener('mouseout', (e) => {
    const el = e.relatedTarget;
    if (el) {
      const isItem = !!el.classList.value.split(' ').find(el => el === 'item');
      if (isItem) {
        const line = el.parentNode;
        const isLine = !!el.parentNode.classList.value.split(' ').find(el => el === 'line');
        if (isLine) {
          const cellIndex = findIndex(el);
          const lineIndex = findIndex(line);
          changeStatusDeleteBtn(headerRoot, cellIndex, true)
          changeStatusDeleteBtn(leftBodyRoot, lineIndex, true)
        }
      } else {
        if (el.parentNode === document) {
          return
        }
        const isBodyRootParent = !!el.parentNode.classList.value.split(' ').find(el => el === 'body-root');
        if (el === null || el.parentNode.id === 'root' || isBodyRootParent && el.id !== 'table' || el.id === 'root') {
          changeStatusDeleteBtn(headerRoot)
          changeStatusDeleteBtn(leftBodyRoot)
        }
      }
    } else {
      changeStatusDeleteBtn(headerRoot)
      changeStatusDeleteBtn(leftBodyRoot)
    }
  });
};

const createElement = (tagName, className, idName) => {
  const element = document.createElement(tagName)
  if (className) {
    const classNames = className.split(' ').filter(Boolean);
    element.classList.add(...classNames);
  }
  if (idName) {
    element.id = idName;
  }
  return element;
};

const addElement = (parent, element) => {
  parent.append(element);
};

const findIndex = (element) => {
  for (let i = 0; i < element.parentNode.childNodes.length; i++) {
    if (element.parentNode.childNodes[i] === element) {
      return i
    }
  }
};

const changeStatusDeleteBtn = (block, index = 0, isVisible = false) => {
  if (block.childNodes.length === 1) {
    return;
  }
  if (isVisible) {
    for (let i = 0; i < block.childNodes.length; i++) {
      if (i === index) {
        block.childNodes[i].style = 'visibility: visible'
      } else {
        block.childNodes[i].style = 'visibility: hidden'
      }
    }
  } else {
    for (let i = 0; i < block.childNodes.length; i++) {
      block.childNodes[i].style = 'visibility: hidden'
    }
  }
};

const createDeleteBtn = (parent, table, isDeleteColumn, otherDeleteBtnParent) => {
  const deleteBtn = createElement('button', 'item button delete-button');
  if (isDeleteColumn) {
    deleteBtn.addEventListener('click', deleteColumn(table, deleteBtn, parent, otherDeleteBtnParent));
  } else {
    deleteBtn.addEventListener('click', deleteLine(table, deleteBtn, parent, otherDeleteBtnParent));
  }
  addElement(parent, deleteBtn);
};

const deleteColumn = (table, btn, btnParent, otherDeleteBtnParent) => () => {
  const index = findIndex(btn);
  for (let i = 0; i < table.childNodes.length; i++) {
    const itemToRemove = table.childNodes[i].childNodes[index];
    table.childNodes[i].removeChild(itemToRemove);
  }
  btnParent.removeChild(btn);
  changeStatusDeleteBtn(otherDeleteBtnParent);
};

const deleteLine = (table, btn, btnParent, otherDeleteBtnParent) => () => {
  const index = findIndex(btn);
  table.removeChild(table.childNodes[index]);
  btnParent.removeChild(btn);
  changeStatusDeleteBtn(otherDeleteBtnParent);
};

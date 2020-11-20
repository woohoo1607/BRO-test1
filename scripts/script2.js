window.addEventListener('load', () => {
  initial2();
});

const initial2 = () => {
  const size = 4;
  const root = document.getElementById('root2');
  const headerRoot = createElement('div', 'header-root');
  const bodyRoot = createElement('div', 'body-root');
  const footerRoot = createElement('div', 'footer-root');
  const leftBodyRoot = createElement('div', 'left-body-root');
  const rightBodyRoot = createElement('div', 'right-body-root');
  const table = createElement('table', '', 'table');
  const tbody = createElement('tbody', '');
  const addColumnBtn = createElement('button', 'item button add-button');
  const addLineBtn = createElement('button', 'item button add-button');

  const deleteLine = createDeleteBtn(leftBodyRoot, table, false, headerRoot);
  const deleteColumn = createDeleteBtn(headerRoot, table, true, leftBodyRoot);

  for (let i = 0; i < size; i++) {
    const line = createElement('tr', 'line');
    for (let j = 0; j < size; j++) {
      const item = createElement('td', 'item')
      addElement(line, item)
    }
    addElement(tbody, line);
  }

  addColumnBtn.addEventListener('click', () => {
    for (let i = 0; i < tbody.childNodes.length; i++) {
      addElement(tbody.childNodes[i], createElement('td', 'item'))
    }
  });

  addLineBtn.addEventListener('click', () => {
    const line = createElement('tr', 'line');
    for (let j = 0; j < tbody.childNodes[0].childNodes.length; j++) {
      const item = createElement('td', 'item')
      addElement(line, item)
    }
    addElement(tbody, line);
  });

  addElement(rightBodyRoot, addColumnBtn);
  addElement(footerRoot, addLineBtn);
  addElement(table, tbody);
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
          deleteLine.style = `top: ${lineIndex*60}px; visibility: visible`
          deleteColumn.style = `left: ${cellIndex*60}px; visibility: visible`
/*          changeStatusDeleteBtn(deleteLine, true)
          changeStatusDeleteBtn(deleteColumn, true)*/
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

const changeStatusDeleteBtn = (btn, isVisible = false) => {

  if (isVisible) {
    btn.style = 'visibility: visible';
  } else {
    btn.style = 'visibility: hidden';
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
  return deleteBtn;
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
